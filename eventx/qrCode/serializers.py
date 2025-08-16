# qrCode/serializers.py
from rest_framework import serializers
from events.models import Event, EventRegistration, IndividualTicket, TicketType
# Make sure your models are correctly imported here based on their actual location
from django.db import transaction

class EventSerializer(serializers.ModelSerializer):
    ticket_types = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'banner_image', 'is_public', 'is_blocked', 'category', 'venue', 'city', 'organizer', 'ticket_types']
        read_only_fields = ['organizer', 'category', 'venue', 'city']

    def get_ticket_types(self, obj):
        ticket_types = obj.ticket_types.filter(quantity_available__gt=0).order_by('price')
        return TicketTypeSerializer(ticket_types, many=True).data

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'quantity_available', 'description']

class IndividualTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualTicket
        fields = ['unique_id', 'is_scanned', 'scanned_at']
        read_only_fields = ['unique_id', 'is_scanned', 'scanned_at']

class EventRegistrationSerializer(serializers.ModelSerializer):
    # These fields are for READ-ONLY nested representation.
    # They MUST be included in `Meta.fields` because they are explicitly defined here.
    event_details = EventSerializer(source='event', read_only=True)
    ticket_type_details = TicketTypeSerializer(source='ticket_type', read_only=True)
    individual_tickets = IndividualTicketSerializer(many=True, read_only=True)

    class Meta:
        model = EventRegistration
        # Re-include the custom read-only fields here.
        # DRF will understand they are read-only from their direct definition above.
        fields = ['id', 'event', 'user', 'ticket_type', 'quantity', 'registered_at',
                  'event_details', 'ticket_type_details', 'individual_tickets']

        # Only list the fields that are purely read-only and *not* meant for input
        # from the client, and are *not* custom fields defined above with `read_only=True`.
        # 'user' and 'registered_at' are automatically set by the server.
        read_only_fields = ['user', 'registered_at'] # 'event_details', 'ticket_type_details', 'individual_tickets'
                                                    # are already marked read_only=True in their direct declaration.


    def create(self, validated_data):
        print("--- Entering EventRegistrationSerializer create method ---")
        print(f"Validated data: {validated_data}")
        user = self.context['request'].user
        print(f"User: {user.username}")

        event = validated_data['event']
        quantity = validated_data.get('quantity', 1)
        ticket_type = validated_data.get('ticket_type') # This will be the TicketType object instance due to ModelSerializer's default behavior

        # Basic validation: Check if already registered for this event with this ticket type
        if EventRegistration.objects.filter(user=user, event=event, ticket_type=ticket_type).exists():
            raise serializers.ValidationError("You are already registered for this event with this specific ticket type. Please go to 'My Tickets' to view them.")

        # --- Check Ticket Type Availability ---
        if ticket_type:
            # Use select_for_update to prevent race conditions during quantity deduction
            # We fetch the ticket_type again within the transaction to ensure we have the latest data under lock.
            ticket_type_locked = TicketType.objects.select_for_update().get(pk=ticket_type.pk)

            if ticket_type_locked.quantity_available < quantity:
                raise serializers.ValidationError(
                    f"Not enough tickets of type '{ticket_type_locked.name}' available. Only {ticket_type_locked.quantity_available} left."
                )
        else:
            # Handle cases where no specific ticket_type is provided (e.g., free events, general admission)
            pass

        with transaction.atomic():
            # 1. Create the EventRegistration
            registration = EventRegistration.objects.create(
                user=user,
                event=event,
                ticket_type=ticket_type_locked if ticket_type else None, # Use the locked instance if available
                price_at_purchase=ticket_type_locked.price if ticket_type else 0, # Store price at purchase
                quantity=quantity
            )

            # 2. Deduct from TicketType quantity
            if ticket_type:
                ticket_type_locked.quantity_available -= quantity
                ticket_type_locked.save(update_fields=['quantity_available'])

            # 3. Create IndividualTicket instances
            individual_tickets_created = []
            for _ in range(quantity):
                individual_tickets_created.append(IndividualTicket(registration=registration))
            IndividualTicket.objects.bulk_create(individual_tickets_created)

        return registration