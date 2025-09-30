from django.db import models
from users.models import User
from django.conf import settings # Import settings to get AUTH_USER_MODEL
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
import uuid

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# City Model
class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Venue Model (linked to a City)
class Venue(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='venues')

    def __str__(self):
        return f"{self.name}, {self.city.name}"
from django.db.models import Avg # Import Avg
class Event(models.Model):
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True, blank=True)
    venue = models.ForeignKey('Venue', on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_public = models.BooleanField(default=True)
    banner_image = models.ImageField(upload_to='event_banners/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_blocked = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.title} by {self.organizer.username}"
    def blocked(self):
        self.is_blocked = True
        self.save()
    @property
    def average_rating(self):
        # Calculate the average rating for this specific event
        # If there are no ratings, Avg returns None, so handle that.
        avg_rating = self.ratings.aggregate(Avg('rating'))['rating__avg']
        return round(avg_rating, 2) if avg_rating is not None else 0.0 # Round to 2 decimal places
    @property
    def total_ratings_count(self):
        # Count the number of ratings for this specific event
        return self.ratings.count() 
    @property
    def total_attendee(self):
        # Count the number of ratings for this specific event
        return self.registrations.count() 
    @property
    def total_likes_count(self):
        return self.likes.count()

    # Method to check if a specific user has liked this event
    def is_liked_by_user(self, user):
        if user.is_authenticated:
            return self.likes.filter(user=user).exists()
        return False
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_likes')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        # Ensures a user can only like a specific event once
        unique_together = ('user', 'event')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} likes {self.event.title}"

# class EventRegistration(models.Model):
#     event = models.ForeignKey(Event, on_delete=models.CASCADE,related_name='registrations') 
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     registered_at = models.DateTimeField(auto_now_add=True)
#     is_checked_in = models.BooleanField(default=False)
#     is_blocked = models.BooleanField(default=False)  # Blocked registration

#     def __str__(self):
#         return f"{self.user.username} - {self.event.title}"

class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField(default=0) 
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True) 
    sale_starts = models.DateTimeField(null=True, blank=True)
    sale_ends = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.event.title} - {self.name}"
class EventRegistration(models.Model):
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    is_checked_in = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    
    # If using TicketType (Recommended):
    ticket_type = models.ForeignKey('TicketType', on_delete=models.CASCADE, null=True, blank=True)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    quantity = models.PositiveIntegerField(default=1) # Quantity of tickets for this registration/ticket_type

    # New field to store the generated QR code image (optional, you can also generate on-the-fly)
    qr_code_image = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def __str__(self):
        if self.ticket_type:
            return f"{self.user.username} - {self.event.title} ({self.quantity} x {self.ticket_type.name})"
        return f"{self.user.username} - {self.event.title} ({self.quantity} tickets)"

    class Meta:
        unique_together = ('event', 'user', 'ticket_type',) # If using TicketType

    # Method to generate QR code data for each individual ticket
    def generate_ticket_qrs(self):
        # This will be a list of unique codes for each ticket
        ticket_codes = []
        for i in range(self.quantity):
            # Generate a unique, unpredictable string for each ticket
            # A UUID is a good choice for uniqueness
            unique_ticket_id = f"{self.pk}-{uuid.uuid4()}" 
            ticket_codes.append(unique_ticket_id)
        return ticket_codes

    # Method to generate and save a QR code image for a specific ticket ID
    def save_qr_code_image(self, ticket_id):
        qr_data = ticket_id # The data to be encoded in the QR code

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
        
        # Optionally, add event/user info to the image itself (not in the QR code data)
        draw = ImageDraw.Draw(img)
        # You'd need a font for this
        # from PIL import ImageFont
        # font = ImageFont.truetype("arial.ttf", 20) # Path to a font file
        # draw.text((10, 10), f"Event: {self.event.title}", font=font, fill=(0,0,0))
        # draw.text((10, 40), f"User: {self.user.username}", font=font, fill=(0,0,0))
        # draw.text((10, 70), f"Ticket ID: {ticket_id}", font=font, fill=(0,0,0))

        buffer = BytesIO()
        img.save(buffer, format='PNG')
        file_name = f'qr_code_{ticket_id}.png'
        self.qr_code_image.save(file_name, File(buffer), save=False)
        self.save() # Save the model instance after saving the image    

class IndividualTicket(models.Model):
    registration = models.ForeignKey(EventRegistration, on_delete=models.CASCADE, related_name='individual_tickets')
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True) # The unique ID encoded in the QR code
    is_scanned = models.BooleanField(default=False)
    scanned_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Ticket for {self.registration.user.username} - {self.registration.event.title} ({self.unique_id})"

    # You can add a method here to generate the QR code data string
    def get_qr_data(self):
        return str(self.unique_id) # Simple UUID as QR data
    





