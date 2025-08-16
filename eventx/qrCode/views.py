from django.shortcuts import render

# Create your views here.
# In your views.py (Django)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
import qrcode
from io import BytesIO
import base64
from PIL import Image # For handling image processing
from events.models import EventRegistration ,IndividualTicket
# Assuming you have a serializer for EventRegistration
# from .serializers import EventRegistrationSerializer
# In your views.py
# ... (imports: qrcode, BytesIO, base64, PIL.Image, LoginRequiredMixin, APIView, Response, status, get_object_or_404, EventRegistration, IndividualTicket) ...

class GenerateTicketQRView(LoginRequiredMixin, APIView):
    def get(self, request, unique_id): # <-- Expects unique_id here
        try:
            # Fetch the specific IndividualTicket based on its unique_id
            # Ensure the ticket belongs to the requesting user's registration
            individual_ticket = get_object_or_404(
                IndividualTicket,
                unique_id=unique_id,
                registration__user=request.user # Ensure it's the current user's ticket
            )

            # The data for the QR code is the unique_id itself
            qr_data = str(individual_ticket.unique_id)

            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

            # Convert image to base64 string
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            qr_image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

            # Fetch related event and user details from the registration
            registration = individual_ticket.registration

            return Response({
                "ticket_id": str(individual_ticket.unique_id), # Return the UUID as ticket_id
                "qr_code_image": f"data:image/png;base64,{qr_image_base64}",
                "event_title": registration.event.title,
                "user_name": registration.user.username,
                "ticket_type_name": registration.ticket_type.name if registration.ticket_type else "General",
                "quantity": 1 # This view generates one QR code per call, representing one individual ticket
            }, status=status.HTTP_200_OK)
        except IndividualTicket.DoesNotExist:
            return Response({"detail": "Ticket not found or does not belong to your account."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the full exception for debugging on the server side
            import logging
            logger = logging.getLogger(__name__)
            logger.exception("Error generating QR code:")
            return Response({"detail": f"An error occurred during QR generation: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# In your views.py (Django)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone # <--- This is the correct way to import it


class ScanTicketView(APIView):
    # You'll likely want to add permission checks here (e.g., IsStaff, custom permissions)
    # permission_classes = [IsAuthenticated, IsStaff] 

    def post(self, request):
        scanned_ticket_id = request.data.get('ticket_id')

        if not scanned_ticket_id:
            return Response({"detail": "No ticket_id provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the ticket_id to get registration_pk and unique_id
        try:
            registration_pk_str, unique_uuid_str = scanned_ticket_id.split('-', 1)
            registration_pk = int(registration_pk_str)
            # You might not need to parse the UUID explicitly if you just verify its existence
            # But it's good practice to ensure it's a valid UUID format
            # uuid.UUID(unique_uuid_str) # This would raise ValueError if not a valid UUID
        except (ValueError, IndexError):
            return Response({"detail": "Invalid QR code format."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Fetch the EventRegistration based on the primary key from the QR code
                # You might want to make sure this registration is for an active event etc.
                registration = EventRegistration.objects.select_for_update().get(pk=registration_pk)

                # Assuming you've stored the list of unique ticket IDs within the EventRegistration model
                # or a related model. For simplicity, let's assume `generate_ticket_qrs` always returns them.
                # In a real system, you might have a dedicated `IndividualTicket` model linked to Registration.
                
                # IMPORTANT: This is a placeholder. You need a robust way to store
                # and track *each individual ticket's* check-in status.
                # If `quantity > 1`, you can't just set `is_checked_in` on the `EventRegistration` itself.
                # You'd need a separate model like `IndividualTicket`
                
                # Placeholder for individual ticket tracking
                # A more robust solution would involve a `Ticket` model for each individual ticket
                # or a JSONField on EventRegistration to track status of each UUID.
                
                # For this example, let's just confirm the presence of the UUID.
                # A better approach would be to have a `Ticket` model as shown below.

                # --- More Robust Tracking (RECOMMENDED) ---
                # Add an `IndividualTicket` model:
                # class IndividualTicket(models.Model):
                #     registration = models.ForeignKey(EventRegistration, on_delete=models.CASCADE, related_name='individual_tickets')
                #     unique_id = models.UUIDField(default=uuid.uuid4, unique=True)
                #     is_scanned = models.BooleanField(default=False)
                #     scanned_at = models.DateTimeField(null=True, blank=True)
                #
                # Then, when you generate tickets, you create `IndividualTicket` instances.
                # When scanning:
                
                individual_ticket = IndividualTicket.objects.get(unique_id=unique_uuid_str, registration=registration)

                if individual_ticket.is_scanned:
                    return Response({"detail": "Ticket already scanned.", "status": "scanned"}, status=status.HTTP_400_BAD_REQUEST)

                # Check if the event is still active, etc.
                if registration.event.end_time < timezone.now(): # You need to import timezone
                    return Response({"detail": "Event has ended.", "status": "event_ended"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Check-in the ticket
                individual_ticket.is_scanned = True
                individual_ticket.scanned_at = timezone.now()
                individual_ticket.save()

                return Response({
                    "detail": "Ticket confirmed successfully!",
                    "status": "success",
                    "event_title": registration.event.title,
                    "user_name": registration.user.username,
                    "ticket_type": registration.ticket_type.name if registration.ticket_type else "General",
                    "scanned_at": individual_ticket.scanned_at,
                    "ticket_id": scanned_ticket_id
                }, status=status.HTTP_200_OK)

        except EventRegistration.DoesNotExist:
            return Response({"detail": "Invalid ticket or registration not found."}, status=status.HTTP_404_NOT_FOUND)
        except IndividualTicket.DoesNotExist: # If you implement IndividualTicket model
            return Response({"detail": "Invalid ticket ID or ticket not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

from rest_framework import serializers
from rest_framework import generics, permissions
from events.models import Event, EventRegistration, IndividualTicket, TicketType
from .serializers import EventSerializer, EventRegistrationSerializer, IndividualTicketSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils import timezone # Make sure this is correctly imported now!

# ... (Your GenerateTicketQRView and ScanTicketView from previous answers) ...

class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.filter(is_public=True, is_blocked=False)
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated] # Or AllowAny if events are public to all

class EventRegistrationCreateAPIView(generics.CreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        # Pass the request to the serializer context so it can access request.user
        return {'request': self.request }
    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        quantity = serializer.validated_data.get('quantity', 1)
        ticket_type = serializer.validated_data.get('ticket_type')
        existing_registration = EventRegistration.objects.filter(
            user=self.request.user,
            event=event,
            ticket_type=ticket_type
        ).first()
        if existing_registration:
            # Handle if user tries to re-register for the same ticket type for the same event
            # You might update quantity or return an error
            return Response({"detail": "You are already registered for this event with this ticket type."}, status=status.HTTP_409_CONFLICT)
        if ticket_type:
            if ticket_type.quantity_available < quantity:
                raise serializers.ValidationError(f"Not enough tickets of type '{ticket_type.name}' available. Only {ticket_type.quantity_available} left.")
        # --- End robust check ---

        with transaction.atomic():
            # Create the EventRegistration
            registration = serializer.save(user=self.request.user) # user is set here

            # --- Create individual tickets ---
            if ticket_type: # If using ticket types, deduct from specific ticket type
                ticket_type.quantity_available -= quantity
                ticket_type.save()
            # If not using ticket types, you'd have a total_tickets_available on Event model
            # event.total_tickets_available -= quantity
            # event.save()

            for _ in range(registration.quantity):
                IndividualTicket.objects.create(registration=registration)

class UserRegistrationsListAPIView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Fetch registrations for the logged-in user, and prefetch related individual tickets
        return EventRegistration.objects.filter(user=self.request.user).prefetch_related('individual_tickets')