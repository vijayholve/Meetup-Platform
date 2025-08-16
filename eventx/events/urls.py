from django.urls import path
from . import views 

urlpatterns = [
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
