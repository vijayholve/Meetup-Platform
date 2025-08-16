from rest_framework import serializers 
from .models import Siteconfig 
class siteConfigSerializers(serializers.ModelSerializer ):
    class Meta:
        model= Siteconfig 
        fields= '__all__'
        
        