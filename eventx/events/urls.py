from django.urls import path
from . import views 

urlpatterns = [
    # Chart Data APIs
    # path('charts/user-stats/', views.get_user_stats_chart_data, name='user_stats_chart'),
    # path('charts/event-stats/', views.get_event_stats_chart_data, name='event_stats_chart'),
    path('charts/registration-trends/', views.get_event_registration_trend_data, name='registration_trends'),
    path('charts/monthly-events/', views.get_monthly_events_data, name='monthly_events'),
    path('charts/event-categories/', views.get_event_category_stats, name='event_categories'),
    path('charts/venue-stats/', views.get_venue_stats_data, name='venue_stats'),
    # path('analytics/', views.get_dashboard_analytics, name='dashboard_analytics'),

    path('events-view/',views.EventView.as_view(),name="events-view"),

        path('events-view/<int:pk>/', views.EventView.as_view()),    # GET one, PUT update, DELETE block
 path('eventregisters-view/',views.EventRegisterView.as_view(),name="events-view"),
        path('eventregisters-view/<int:pk>/', views.EventRegisterView.as_view()),    # GET one, PUT update, DELETE block
    path('event-model-info/', views.EventDetailsModelsView.as_view(), name='categories'),
        path('city-view/',views.CityView.as_view(),name="city-view"),
        path('city-view/<int:pk>/',views.CityView.as_view(),name="city-view"),
         path('category-view/',views.CategoryView.as_view(),name="category-view"),
        path('category-view/<int:pk>/',views.CategoryView.as_view(),name="category-view"),
         path('venue-view/',views.VenueView.as_view(),name="venue-view"),
        path('venue-view/<int:pk>/',views.VenueView.as_view(),name="venue-view"),
]
