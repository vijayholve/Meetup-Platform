from django.contrib import admin
from .models import Event ,EventRegistration ,Venue,City,Category ,TicketType ,IndividualTicket

data =[Event, EventRegistration, Venue, City, Category ,TicketType,IndividualTicket]
for model in data:
    admin.site.register(model)
