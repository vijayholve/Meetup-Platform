from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication,BasicAuthentication
from rest_framework import generics
from users.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from rest_framework.response import Response
from .serializers import RegisterSerializer , EventCommentsSerializer
from .models import Rating
from django.db.models import Avg 
from events.models import Event ,EventRegistration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer 


class DashboardUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ModelSerializer

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(is_active=True)
        total_users = users.count()
        superusers_count = users.filter(is_superuser=True).count()
        vendor_count = users.filter(role='vendor').count()
        organizer_count = users.filter(role='organizer').count()
        attendee_count = users.filter(role='attendee').count()

        data = {
            'total_users': total_users,
            'superusers_count': superusers_count,
            'vendor_count': vendor_count,
            'organizer_count': organizer_count,
            'attendee_count': attendee_count,
        }
        return Response(data)
class DashboardEventView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ModelSerializer

    def get(self, request, *args, **kwargs):
        events = Event.objects.filter(is_blocked=False)
        total_events = events.count()
        public_events_count = events.filter(is_public=True).count()
        blocked_events = Event.objects.filter(is_blocked=True).count()
        total_eventsregister = EventRegistration.objects.filter(is_blocked=False).count()
        blocked_eventregisters = EventRegistration.objects.filter(is_blocked=True).count()

        data = {
            'total_events': total_events,
            'public_events_count': public_events_count,
            'blocked_events': blocked_events,
            'total_eventsregister': total_eventsregister,
            'blocked_eventregisters': blocked_eventregisters,
        }
        return Response(data)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication, BasicAuthentication # Keep other DRF importsfrom django.db.models import Avg
from django.contrib.auth import get_user_model # To get the User model

from .models import Comment, Rating, Event # Assuming Event is imported from .models
from .serializers import CommentSerializer, RatingSerializer # Import both serializers

User = get_user_model() # Get the User model instance

class CommentAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]
    # Allow GET requests from anyone. For POST, it's typically 'IsAuthenticated'.
    # If a user *must* be logged in to comment, change to [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request, event_id):
        # Enforce authentication for posting comments
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required to post a comment.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # We explicitly extract 'content' and 'parent' from request.data
        # because the Comment model only cares about these fields.
        # Any 'user_rated' sent from frontend is ignored by this serializer for saving.
        data_for_comment = {
            'content': request.data.get('content'),
            'parent': request.data.get('parent') # This could be null for top-level comments
        }

# In CommentAPIView.post method

        serializer = CommentSerializer(data=data_for_comment, context={'request': request, 'event': event})
        if serializer.is_valid():
            serializer.save() # This creates the Comment instance
            return Response({'message': 'Comment created successfully'}, status=status.HTTP_201_CREATED) # Changed status to 201 Created
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get top-level comments (those without a parent) and order them
        comments = event.comments.filter(parent__isnull=True).order_by('-created_at')
        
        # Pass 'request' and 'event' to the serializer context
        serializer = CommentSerializer(comments, many=True, context={'request': request, 'event': event})

        # Calculate average rating from the Rating model for the event
        avg_rating = Rating.objects.filter(event=event).aggregate(avg=Avg('rating'))['avg'] or 0.0

        return Response({
            'avg_rating': round(avg_rating, 1),
            'data': serializer.data # This 'data' will now contain nested comments and user_rated
        }, status=status.HTTP_200_OK)



class SingleCommentAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]
    # Allow GET requests from anyone. For POST, it's typically 'IsAuthenticated'.
    # If a user *must* be logged in to comment, change to [IsAuthenticated]
    permission_classes = [IsAuthenticated]
    
    def delete(self,request,comment_id):
        if not comment_id:
            return Response({
                'status': 400,
                'message': 'Event ID is required for deletion'
            })

        if comment := Comment.objects.filter(id=comment_id).first():
            comment.delete() 

            return Response({
                'status': 200,
                'message': 'Comment Deleted (Blocked)',
                'data': {
                    'comment_id': comment_id,
                }
            })
        return Response({
            'status': 404,
            'message': 'Event Not Found',
            'data': {'event_id': comment_id}
        })



# ...# ... other imports ...
# Make sure Event is imported here
from .models import Comment, Rating, Event
from .serializers import CommentSerializer, RatingSerializer

class RatingAPIView(APIView):
    # ...
    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        data_for_rating = {'rating': request.data.get('rating')} # Ensure 'rating' key is used here
        if data_for_rating['rating'] is None:
            return Response({'rating': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RatingSerializer(data=data_for_rating, context={'request': request, 'event': event})
        if serializer.is_valid():
            serializer.save() # This calls the create/update method in RatingSerializer
            return Response({'message': 'Rating saved successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# base/views.py

from django.db.models import Count, Avg, F # Import F for database field references
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404


# ... (your existing views: CommentAPIView, RatingAPIView, UserEventRatingRetrieveAPIView) ...

class EventRatingSummaryAPIView(APIView):
    """
    API view to get a summary of ratings for a specific event.
    Returns counts for each star rating (1-5) and the average rating.
    """
    permission_classes = [AllowAny] # Anyone can see the rating summary

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        # Initialize counts for all possible star ratings (1 to 5)
        rating_counts = {str(i): 0 for i in range(1, 6)} # Use string keys for consistency with Chart.js labels

        # Aggregate ratings by their value
        ratings_data = Rating.objects.filter(event=event).values('rating') \
                                   .annotate(count=Count('rating')) \
                                   .order_by('rating')

        total_ratings = 0
        for item in ratings_data:
            # Convert float rating to int for grouping (e.g., 3.0 -> 3)
            # If your model allows 0.5 precision, you might need to round.
            # Assuming your choices enforce whole numbers 1-5 for simpler aggregation here.
            # If `choices` are removed and 0.5 values are allowed,
            # you'd need to adjust how you group (e.g., floor() or round() and then group).
            # For simplicity, assuming incoming ratings are whole numbers 1-5.
            star_value = int(item['rating'])
            rating_counts[str(star_value)] = item['count']
            total_ratings += item['count']

        # Calculate average rating
        average_rating_query = Rating.objects.filter(event=event).aggregate(avg_rating=Avg('rating'))
        average_rating = average_rating_query.get('avg_rating', 0)
        if average_rating is None: # Handle case where there are no ratings
            average_rating = 0.0

        response_data = {
            "average_rating": round(average_rating, 2), # Round to 2 decimal places
            "rating_counts": rating_counts,
            "total_ratings": total_ratings
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
# base/views.py
# (Add these imports at the top of your base/views.py)
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny # For the social login view

# ... (your existing views like CommentAPIView, RatingAPIView, UserEventRatingRetrieveAPIView) ...

# New View for Google Login
class GoogleLogin(SocialLoginView):
    """
    This view handles the social login process for Google.
    The frontend will POST the Google authorization code/access_token to this endpoint.
    It uses django-allauth's GoogleOAuth2Adapter to process the authentication.
    """
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:8000/accounts/google/login/callback/" # Must match Google Cloud Console redirect URI
                                                                            # and your allauth setup.
                                                                            # Use your actual frontend domain in production.
    client_class = None # Set to None for implicit flow with access_token from frontend, or explicit for code flow.
    permission_classes = [AllowAny] # Allow unauthenticated users to hit this endpoint
                                     # as they are trying to log in/register.
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication # Assuming you use JWT
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Event, Comment
from .serializers import EventCommentsSerializer

class EventCommentsView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication] # Keep if you want authentication to apply
    permission_classes = [AllowAny] # This allows unauthenticated users to fetch comments

    def get(self, request, event_id): # <--- Change pk=None to event_id
        try:
            event = Event.objects.get(id=event_id) # Use event_id here
            serializer = EventCommentsSerializer(event)
            return Response({
                "status": 200,
                "message": f"Comments for Event ID {event_id}",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({
                "status": 404,
                "message": "Event not found."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the full exception for debugging server-side errors
            print(f"Error in EventCommentsView for event_id {event_id}: {e}")
            import traceback
            traceback.print_exc() # This will print the full traceback to your console
            return Response({
                "status": 500,
                "message": f"An internal server error occurred." # Don't expose internal errors to frontend
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Remove the `events = Event.objects.all()` part if this view is strictly for single event comments
    # If you need an endpoint for all comments, create a separate view and URL.