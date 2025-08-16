from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from rest_framework.response import Response

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
from rest_framework import serializers
from .models import Comment, Rating, Event # Assuming Event is also in .models
from django.db.models import Avg
from django.contrib.auth import get_user_model

User = get_user_model()

# A simple serializer for the User model, to display username
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username'] # You might want to add other fields like 'id' if needed

# A simple serializer for the Event model, to display event details if embedded
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title'] # Add other relevant event fields

# In your serializers.py (or where CommentSerializer is defined)
from rest_framework import serializers
from .models import Comment, Rating, Event # Ensure all models are imported
from django.db.models import Avg # Might not be needed in serializer, but good to have if you calculate averages elsewhere

# Assuming you have a UserSerializer defined somewhere, like:
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Import User model as well
        fields = ['username', 'id'] # Or other relevant user fields

# In your Django serializers.py

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    user_rated = serializers.SerializerMethodField()
    
    # New: Field to get the parent comment's user's username
    parent_user_username = serializers.SerializerMethodField() 

    class Meta:
        model = Comment
        fields = ['id', 'user', 'event', 'content', 'parent', 'created_at', 'replies', 'user_rated', 'parent_user_username']
        read_only_fields = ['user', 'event', 'created_at']
        extra_kwargs = {'parent': {'required': False, 'allow_null': True}}

    def get_replies(self, obj):
        if hasattr(obj, 'children') and obj.children.exists():
            # Pass context down to ensure parent_user_username works for deeper replies too
            return self.__class__(obj.children.all().order_by('created_at'), many=True, context=self.context).data
        return []

    def get_user_rated(self, obj):
        # ... (your existing implementation for user_rated) ...
        try:
            rating_obj = Rating.objects.get(user=obj.user, event=obj.event)
            return float(rating_obj.rating)
        except Rating.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error in get_user_rated for comment {obj.id}: {e}")
            return None

    def get_parent_user_username(self, obj):
        # If this comment has a parent, return the parent's user's username
        if obj.parent and obj.parent.user:
            return obj.parent.user.username
        return None # Or an empty string, or "a user" as a fallback

    # ... (your existing create method) ...
# In your Django serializers.py - inside CommentSerializer

    def create(self, validated_data):
        request = self.context.get('request')
        event = self.context.get('event')

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required to create a comment.")
        if not event:
            raise serializers.ValidationError("Event context missing for comment creation.")

        # REMOVED: Parent handling for strict top-level comments only
        # You can keep `parent` in the model for display purposes,
        # but disallow setting it during creation if replies are truly removed.
        if 'parent' in validated_data and validated_data['parent'] is not None:
            raise serializers.ValidationError({"parent": "Replies are not allowed for this endpoint."})


        comment = Comment.objects.create(
            user=request.user,
            event=event,
            content=validated_data.get('content'),
            # parent=parent_instance # No longer setting parent here directly from validated_data
            # parent will be None by default if not provided, which is what we want for top-level comments
        )
        return comment
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'user', 'event', 'rating', 'created_at']
        read_only_fields = ['user', 'event', 'created_at']
        extra_kwargs = {'rating': {'required': True}}

    def create(self, validated_data):
        request = self.context.get('request')
        event = self.context.get('event')
        user = request.user

        # This part checks if a rating already exists and updates it.
        # If no rating exists, it creates a new one.
        existing_rating = Rating.objects.filter(user=user, event=event).first()

        if existing_rating:
            existing_rating.rating = validated_data.get('rating', existing_rating.rating)
            existing_rating.save()
            return existing_rating
        else:
            return Rating.objects.create(user=user, event=event, **validated_data)
# base/serializers.py

from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer as DefaultUserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer
from allauth.account.utils import setup_user_email
from allauth.socialaccount.adapter import get_adapter
from django.db import transaction

from .models import User


class CommentSerializer(serializers.ModelSerializer):
    # Use the UserSerializer to get 'id' and 'username' for the user object
    user = UserSerializer(read_only=True)
    
    user_rated = serializers.SerializerMethodField()
    
    # Re-add replies for nested comments
    replies = serializers.SerializerMethodField()
    
    # Re-add parent_user_username for "Reply to..." label
    parent_user_username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        # Ensure all fields you want to output are listed here
        # Removed 'user_id' as 'user' (via UserSerializer) provides ID
        fields = ['id', 'user', 'content', 'created_at', 'user_rated', 'parent', 'replies', 'parent_user_username'] 
        read_only_fields = ['user', 'created_at'] # user is set by backend, created_at is auto_add
        extra_kwargs = {
            'parent': {'required': False, 'allow_null': True}, # Allow parent to be null for top-level comments
            'event': {'write_only': True} # Event ID is passed via context, not directly in request body
        }
    
    # --- Methods for SerializerMethodFields ---

    def get_user_rated(self, obj):
        # The 'obj' here is a Comment instance. obj.user is a User object.
        try:
            # Look up the rating from the separate Rating model
            rating_obj = Rating.objects.get(user=obj.user, event=obj.event)
            return float(rating_obj.rating) 
        except Rating.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error in get_user_rated for comment {obj.id} by user {obj.user.username}: {e}")
            return None

    def get_replies(self, obj):
        # Recursively serialize child comments using the same serializer
        if hasattr(obj, 'children') and obj.children.exists():
            # Pass the context down for nested serializers to also get 'request' and 'event'
            return self.__class__(obj.children.all().order_by('created_at'), many=True, context=self.context).data
        return []

    def get_parent_user_username(self, obj):
        # If this comment has a parent, return the parent's user's username
        if obj.parent and obj.parent.user:
            return obj.parent.user.username
        return None 

    # --- Create Method ---
    def create(self, validated_data):
        request = self.context.get('request')
        event = self.context.get('event') # Ensure event is passed in context from view

        user = request.user if request and request.user.is_authenticated else None

        if not user:
            raise serializers.ValidationError("Authentication required to post a comment.")
        if not event:
            raise serializers.ValidationError("Event context missing for comment creation.")

        # If you are not allowing replies, ensure 'parent' is not in validated_data or set to None
        parent_instance = validated_data.pop('parent', None)
        if parent_instance: # If a parent was provided (meaning it's a reply)
            # You might add a check here if you want to strictly disallow replies
            # e.g., raise serializers.ValidationError({"parent": "Replies are not allowed."})
            try:
                # Ensure the parent comment actually exists for this event
                parent_instance = Comment.objects.get(id=parent_instance.id, event=event)
            except Comment.DoesNotExist:
                raise serializers.ValidationError({"parent": "Parent comment does not exist or is not for this event."})

        # Create the comment instance
        comment = Comment.objects.create(
            user=user,
            event=event,
            content=validated_data.get('content'),
            parent=parent_instance # Assign the parent instance
        )
        print("Comment created with ID:", comment.id)
        return comment

class EventCommentsSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True) 
    class Meta:
        model = Event
        fields = '__all__'
     
class UserDetailsSerializer(DefaultUserDetailsSerializer):
    role = serializers.CharField(read_only=True)
    profile_image = serializers.ImageField(read_only=True)

    class Meta(DefaultUserDetailsSerializer.Meta):
        fields = DefaultUserDetailsSerializer.Meta.fields + ('role', 'profile_image')


class CustomRegisterSerializer(DefaultRegisterSerializer):
    role = serializers.CharField(required=True)
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.role = self.data.get('role', 'attendee') 
        user.save()
        return user