from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =User 
        fields = ['username', 'email', 'password','role','profile_image','is_superuser','id']
        extra_kwargs = {
            'password': {'write_only': True},
            'profile_image': {'required': False}
        }
    def create(self, validated_data):
        user = User.objects.create_user(
            **validated_data
        )
        return user 
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance