from django.urls import path
from .views import (
    EventRegistrationTrendView,
    MonthlyEventsView,
    EventCategoryStatsView,
    VenueStatsView,
    UserStatsView,
    EventStatsView
)

urlpatterns = [
    # Chart Data APIs
    path('charts/user-stats/', UserStatsView.as_view(), name='user_stats_chart'),
    path('charts/event-stats/', EventStatsView.as_view(), name='event_stats_chart'),
    path('charts/registration-trends/', EventRegistrationTrendView.as_view(), name='registration_trends'),
    path('charts/monthly-events/', MonthlyEventsView.as_view(), name='monthly_events'),
    path('charts/event-categories/', EventCategoryStatsView.as_view(), name='event_categories'),
    path('charts/venue-stats/', VenueStatsView.as_view(), name='venue_stats'),
    # path('analytics/', views.get_dashboard_analytics, name='dashboard_analytics'),
]