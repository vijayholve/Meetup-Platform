

from django.urls import path  
from .  import views
urlpatterns = [
    path("main/",views.siteconfigApi.as_view())
]
