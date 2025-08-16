from django.urls import path
from . import views
urlpatterns = [
        path('users-view/',views.UserView.as_view(),name="users-view"),
        path('users-view/<int:pk>/', views.UserView.as_view()),    # GET one, PUT update, DELETE block

]
