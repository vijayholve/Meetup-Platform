# qrCode/urls.py
from django.urls import path, re_path
from .views import (
    UserRegistrationsListAPIView,
    GenerateTicketQRView,
    EventRegistrationCreateAPIView,
    EventListAPIView,
    ScanTicketView
)

urlpatterns = [
    # Event and Registration APIs
    path('events/', EventListAPIView.as_view(), name='event-list'), # To get list of events for dropdown
    path('registrations/', EventRegistrationCreateAPIView.as_view(), name='event-registration-create'),
    path('registrations/my/', UserRegistrationsListAPIView.as_view(), name='user-registrations-list'),

    # QR Code APIs
    re_path(r'qr/(?P<unique_id>[0-9a-f-]+)/$', GenerateTicketQRView.as_view(), name='generate_ticket_qr'),
    re_path(r'scan/$', ScanTicketView.as_view(), name='scan_ticket'),
]