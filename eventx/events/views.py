from rest_framework.views import APIView
from rest_framework.response import Response
from .models import EventRegistration, Event ,Venue ,City ,Category ,User
from django.utils import timezone
from .serializers import EventRegistrationSerializer, EventSerializer ,CitySerailizer,CategorySerailizer,VenueSerailizer 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication,BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
# Count imports
from django.db.models import Count
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
import calendar
import random
from django.db import models

class EventView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated]  # or JWTAuthentication
    def get(self, request,pk=None):
        if pk:
            # Get single event
            event = get_object_or_404(Event, pk=pk, is_blocked=False)
            serializer = EventSerializer(event)
            return Response({
                'status': 200,
                'message': 'Event Detail',
                'data': serializer.data
            })
        events = Event.objects.filter(is_blocked=False)
        serializer = EventSerializer(events, many=True)

        return Response({
            'status': 200,
            'message': 'Event List',
            'data': serializer.data
        })

   
    def post(self, request):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 201,
                'message': 'Event Created',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)  # Explicit 201 status here
        if not serializer.is_valid():
            print(serializer.errors)  # <-- log this
            return Response({
                'status': 400,
                'message': 'Event Creation Failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        


    # def put(self, request, pk=None):
    #     if not pk:
    #         return Response({'status': 400, 'message': 'Event ID is required for update'}, status=400)

    #     event = get_object_or_404(Event, pk=pk)

    #     if event.organizer.role != "organizer":
    #         return Response({'status': 403, 'message': 'You do not have permission to edit this event.'}, status=403)
    #     print("Request User:", request.user)
    #     print("Event Organizer:", event.organizer)
    #     serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'status': 200, 'message': 'Event Updated', 'data': serializer.data}, status=200)

    #     return Response({'status': 400, 'message': 'Event Update Failed', 'errors': serializer.errors}, status=400)
    def patch(self, request, pk=None):
        if not pk:
            return Response({'status': 400, 'message': 'Event ID is required for update'}, status=400)

        event = get_object_or_404(Event, pk=pk)
        if event.organizer.role != "organizer":
            return Response({'status': 403, 'message': 'You do not have permission to edit this event.'}, status=403)
        print("Request User:", request.user)
        print("Event Organizer:", event.organizer)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'message': 'Event Updated', 'data': serializer.data}, status=200)

        return Response({'status': 400, 'message': 'Event Update Failed', 'errors': serializer.errors}, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({
                'status': 400,
                'message': 'Event ID is required for deletion'
            })

        if event := Event.objects.filter(pk=pk).first():
            event.is_blocked = True
            event.save()
            return Response({
                'status': 200,
                'message': 'Event Deleted (Blocked)',
                'data': {
                    'event_id': pk,
                    'event_title': event.title
                }
            })
        return Response({
            'status': 404,
            'message': 'Event Not Found',
            'data': {'event_id': pk}
        })

class EventDetailsModelsView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]

    permission_classes = [IsAuthenticated]
    def get(self, request):
        categories = Category.objects.all()
        cities = City.objects.all()
        venues = Venue.objects.all()

        categories_data = [{'id': category.id, 'name': category.name} for category in categories]
        cities_data = [{'id': city.id, 'name': city.name} for city in cities]
        venues_data = [{'id': venue.id, 'name': venue.name, 'city': venue.city.name} for venue in venues]

        return Response({
            'status': 200,
            'message': 'Event Details Models',
            'data': {
                'categories': categories_data,
                'cities': cities_data,
                'venues': venues_data
            }
        })
class CityView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk=None):
        if pk :
            # Get single city
            city = get_object_or_404(City, pk=pk)
            serializer = CitySerailizer(city)
            if city:

                return Response({
                    'status': 200,
                    'message': 'City Detail',
                    'data': serializer.data
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'City Not Found',
                    'data': {'city_id': pk}
                })
        data = City.objects.filter(is_blocked=False)
        serializer= CitySerailizer(data,many=True)
        return  Response({
                'status': 200,
                'message': 'EventRegistration Detail',
                'data': serializer.data
            })
    def patch(self, request, pk=None):
        if not pk:
            return Response({'status': 400, 'message': 'City ID is required for update'}, status=400)

        city = get_object_or_404(City, pk=pk)
        serializer = CitySerailizer(city, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'message': 'City Updated', 'data': serializer.data}, status=200)

        return Response({'status': 400, 'message': 'City Update Failed', 'errors': serializer.errors}, status=400)
    def post(self,request):
        print(request.data)
        serealizer =CitySerailizer(data= request.data)

        if serealizer.is_valid():
            serealizer.save()
            return Response({

                'message': 'Data is created',
                'status':201,
                'data':serealizer.data,
            },status=status.HTTP_201_CREATED)
        
        return Response({
            'message': 'Data is not created',
                'status':400,
            },status=status.HTTP_400_BAD_REQUEST) 
    def delete(self,request,pk=None):
        if not pk:
            return Response({
                'status': 400,
                'message': 'City ID is required for deletion'
            })

        if city := City.objects.filter(pk=pk).first():
            city.delete()
            return Response({
                'status': 200,
                'message': 'city Deleted ',
                'data': {
                    'city_id': pk,
                }
            })
        return Response({
            'status': 404,
            'message': 'City Not Found',
            'data': {'cities_id': pk}
        })


class CategoryView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk=None):
        if pk :
            # Get single category
            category = get_object_or_404(Category, pk=pk)
            serializer = CategorySerailizer(category)
            if category:

                return Response({
                    'status': 200,
                    'message': 'Category Detail',
                    'data': serializer.data
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'Category Not Found',
                    'data': {'category_id': pk}
                })
        data = Category.objects.filter(is_blocked=False)
        serializer= CategorySerailizer(data,many=True)
        return  Response({
                'status': 200,
                'message': 'EventRegistration Detail',
                'data': serializer.data
            })
    def patch(self, request, pk=None):
        if not pk:
            return Response({'status': 400, 'message': 'Category ID is required for update'}, status=400)

        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerailizer(category, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'message': 'Category Updated', 'data': serializer.data}, status=200)

        return Response({'status': 400, 'message': 'Category Update Failed', 'errors': serializer.errors}, status=400)
    def post(self,request):
        print(request.data)
        serealizer =CategorySerailizer(data= request.data)

        if serealizer.is_valid():
            serealizer.save()
            return Response({

                'message': 'Data is created',
                'status':201,
                'data':serealizer.data,
            },status=status.HTTP_201_CREATED)
        
        return Response({
            'message': 'Data is not created',
                'status':400,
            },status=status.HTTP_400_BAD_REQUEST) 
    def delete(self,request,pk=None):
        if not pk:
            return Response({
                'status': 400,
                'message': 'Category ID is required for deletion'
            })

        if category := Category.objects.filter(pk=pk).first():
            category.delete()
            return Response({
                'status': 200,
                'message': 'category Deleted ',
                'data': {
                    'category_id': pk,
                }
            })
        return Response({
            'status': 404,
            'message': 'Category Not Found',
            'data': {'cities_id': pk}
        })


class VenueView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,pk=None):
        if not pk:
            venue=get_object_or_404(Venue,id=pk)
            serializer = VenueSerailizer(venue)
            if venue:

                return Response({
                    'status': 200,
                    'message': 'Category Detail',
                    'data': serializer.data
                })
            else:
                return Response({
                    'status': 404,
                    'message': 'Category Not Found',
                    'data': {'category_id': pk}
                })
        venues = Venue.objects.all()
        serializers = VenueSerailizer(venues,many=True)
        return Response({
            'status': 200,
            'message': 'venues List',
            'data': serializers.data
        })
    def post(self,request):
        serializer=VenueSerailizer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status":400,
                "message":"venues is not created",
                "errors":serializer.errors
                })
        serializer.save()
        return Response({
            "status":200,
            "message":"venues is created",
            "data":serializer.data
        })
    def patch(self, request, pk=None):
        if not pk:
            return Response({'status': 400, 'message': 'Venue ID is required for update'}, status=400)

        venue = get_object_or_404(Venue, pk=pk)
        serializer = VenueSerailizer(venue, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'message': 'Venue Updated', 'data': serializer.data}, status=200)

        return Response({'status': 400, 'message': 'Venue Update Failed', 'errors': serializer.errors}, status=400)
    def delete(self,request,pk=None):
        if pk:
            venue= Venue.objects.get(id=pk)
            venue.delete()
            return Response({
                "status":200,
                "message":"venue is delete succesfully",
                "data":pk
            })

        

        


class EventRegisterView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # permission_classes = [IsAuthenticated]  # or JWTAuthentication
    def get(self, request,pk=None):
        if pk:
            # Get single event
            eventRegistration = get_object_or_404(EventRegistration, pk=pk, is_blocked=False)
            serializer = EventRegistrationSerializer(eventRegistration)
            return Response({
                'status': 200,
                'message': 'EventRegistration Detail',
                'data': serializer.data
            })
        eventRegistrations = EventRegistration.objects.filter(is_blocked=False)
        serializer = EventRegistrationSerializer(eventRegistrations, many=True)
        return Response({
            'status': 200,
            'message': 'EventRegistration List',
            'data': serializer.data
        })

    def post(self, request):
        serializer = EventRegistrationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 201,
                'message': 'EventRegistration Created',
                'data': serializer.data
            })
        return Response({
            'status': 400,
            'message': 'EventRegistration Creation Failed',
            'errors': serializer.errors
        })
    def delete(self, request, pk=None):
        if not pk:
            return Response({
                'status': 400,
                'message': 'EventRegistration ID is required for deletion'
            })

        if eventRegistration := EventRegistration.objects.filter(pk=pk).first():
            eventRegistration.is_blocked = True
            eventRegistration.save()
            return Response({
                'status': 200,
                'message': 'EventRegistration Deleted (Blocked)',
                'data': {
                    'event_id': pk,
                    'event_title': eventRegistration.event.title
                }
            })
        return Response({
            'status': 404,
            'message': 'EventRegistration Not Found',
            'data': {'event_id': pk}
        })

def get_event_registration_trend_data(request):
    """API to get event registration trends over the last 12 months"""
    try:
        from datetime import datetime, timedelta
        from django.utils import timezone
        from django.db.models import Count
        from django.db.models.functions import TruncMonth
        import calendar
        
        # Get last 12 months data
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        
        # Get monthly registration data using TruncMonth for better accuracy
        monthly_data = EventRegistration.objects.filter(
            registered_at__range=[start_date, end_date]
        ).extra(
            select={'month': 'EXTRACT(month FROM registered_at)', 'year': 'EXTRACT(year FROM registered_at)'}
        ).values('month', 'year').annotate(
            total_registrations=Count('id'),
            blocked_registrations=Count('id', filter=models.Q(is_blocked=True))
        ).order_by('year', 'month')
        
        # Initialize data structures for 12 months
        labels = []
        registrations_data = []
        blocked_data = []
        
        # Create a dictionary for easy lookup
        data_dict = {}
        for item in monthly_data:
            key = f"{item['year']}-{item['month']}"
            data_dict[key] = item
        
        # Generate last 12 months labels and data
        current_date = end_date.replace(day=1)  # Start from first day of current month
        for i in range(12):
            month_date = current_date - timedelta(days=i*30)
            month_date = month_date.replace(day=1)  # Ensure we're at the start of month
            
            month_key = f"{month_date.year}-{month_date.month}"
            month_name = calendar.month_abbr[month_date.month]
            
            labels.insert(0, month_name)  # Insert at beginning to maintain chronological order
            
            if month_key in data_dict:
                registrations_data.insert(0, data_dict[month_key]['total_registrations'])
                blocked_data.insert(0, data_dict[month_key]['blocked_registrations'])
            else:
                registrations_data.insert(0, 0)
                blocked_data.insert(0, 0)
        
        # Create chart data structure
        data = {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Event Registrations',
                    'data': registrations_data,
                    'fill': False,
                    'borderColor': 'rgb(75, 192, 192)',
                    'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                    'tension': 0.1,
                },
                {
                    'label': 'Blocked Registrations',
                    'data': blocked_data,
                    'fill': False,
                    'borderColor': 'rgb(255, 99, 132)',
                    'backgroundColor': 'rgba(255, 99, 132, 0.2)',
                    'tension': 0.1,
                },
            ],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_monthly_events_data(request):
    """API to get monthly events created and completed data"""
    try:
        from datetime import datetime, timedelta
        from django.utils import timezone
        from django.db.models import Count
        import calendar
        
        current_year = timezone.now().year
        
        # Get events created and ended by month for current year
        monthly_created = Event.objects.filter(
            created_at__year=current_year
        ).extra(
            select={'month': 'EXTRACT(month FROM created_at)'}
        ).values('month').annotate(
            count=Count('id')
        )
        
        monthly_ended = Event.objects.filter(
            end_time__year=current_year
        ).extra(
            select={'month': 'EXTRACT(month FROM end_time)'}
        ).values('month').annotate(
            count=Count('id')
        )
        
        # Create dictionaries for easy lookup
        created_dict = {item['month']: item['count'] for item in monthly_created}
        ended_dict = {item['month']: item['count'] for item in monthly_ended}
        
        # Generate data for all 12 months
        events_created = []
        events_completed = []
        labels = []
        
        for month in range(1, 13):
            labels.append(calendar.month_abbr[month])
            events_created.append(created_dict.get(month, 0))
            events_completed.append(ended_dict.get(month, 0))
        
        data = {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Events Created',
                    'data': events_created,
                    'backgroundColor': 'rgba(99, 102, 241, 0.8)',
                    'borderColor': 'rgba(99, 102, 241, 1)',
                    'borderWidth': 1,
                },
                {
                    'label': 'Events Completed',
                    'data': events_completed,
                    'backgroundColor': 'rgba(34, 197, 94, 0.8)',
                    'borderColor': 'rgba(34, 197, 94, 1)',
                    'borderWidth': 1,
                },
            ],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_event_category_stats(request):
    """API to get event statistics by category"""
    try:
        from django.db.models import Count
        import random
        
        # Get category stats
        category_stats = Event.objects.filter(
            category__isnull=False
        ).values('category__name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]  # Top 10 categories
        
        labels = [stat['category__name'] for stat in category_stats]
        data_values = [stat['count'] for stat in category_stats]
        
        # Generate random colors for each category
        colors = []
        border_colors = []
        for i in range(len(labels)):
            # Generate random RGB values
            r = random.randint(50, 255)
            g = random.randint(50, 255)
            b = random.randint(50, 255)
            
            colors.append(f'rgba({r}, {g}, {b}, 0.8)')
            border_colors.append(f'rgba({r}, {g}, {b}, 1)')
        
        data = {
            'labels': labels if labels else ['No Categories'],
            'datasets': [{
                'label': 'Events by Category',
                'data': data_values if data_values else [0],
                'backgroundColor': colors if colors else ['rgba(156, 163, 175, 0.8)'],
                'borderColor': border_colors if border_colors else ['rgba(156, 163, 175, 1)'],
                'borderWidth': 1,
            }],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_venue_stats_data(request):
    """API to get venue statistics"""
    try:
        from django.db.models import Count
        import random
        
        # Get venue stats
        venue_stats = Event.objects.filter(
            venue__isnull=False
        ).values('venue__name', 'venue__city__name').annotate(
            count=Count('id')
        ).order_by('-count')[:8]  # Top 8 venues
        
        labels = [f"{stat['venue__name']} ({stat['venue__city__name']})" for stat in venue_stats]
        data_values = [stat['count'] for stat in venue_stats]
        
        # Generate beautiful gradient colors
        gradient_colors = [
            'rgba(99, 102, 241, 0.8)',   # Purple
            'rgba(59, 130, 246, 0.8)',   # Blue
            'rgba(16, 185, 129, 0.8)',   # Green
            'rgba(245, 158, 11, 0.8)',   # Yellow
            'rgba(239, 68, 68, 0.8)',    # Red
            'rgba(139, 92, 246, 0.8)',   # Violet
            'rgba(6, 182, 212, 0.8)',    # Cyan
            'rgba(251, 146, 60, 0.8)',   # Orange
        ]
        
        border_colors = [
            'rgba(99, 102, 241, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(251, 146, 60, 1)',
        ]
        
        data = {
            'labels': labels if labels else ['No Venues'],
            'datasets': [{
                'label': 'Events by Venue',
                'data': data_values if data_values else [0],
                'backgroundColor': gradient_colors[:len(labels)] if labels else ['rgba(156, 163, 175, 0.8)'],
                'borderColor': border_colors[:len(labels)] if labels else ['rgba(156, 163, 175, 1)'],
                'borderWidth': 2,
            }],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


def get_user_stats_chart_data(request):
    """API to get user statistics for charts"""
    try:
        total_users = User.objects.count()
        attendee_count = User.objects.filter(user_type='attendee').count()
        organizer_count = User.objects.filter(user_type='organizer').count()
        superuser_count = User.objects.filter(is_superuser=True).count()
        vendor_count = User.objects.filter(user_type='vendor').count()
        
        data = {
            'labels': ['Total Users', 'Attendees', 'Organizers', 'Superusers', 'Vendors'],
            'datasets': [{
                'label': 'User Count',
                'data': [total_users, attendee_count, organizer_count, superuser_count, vendor_count],
                'backgroundColor': [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                'borderColor': [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                'borderWidth': 1,
            }],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_event_stats_chart_data(request):
    """API to get event statistics for doughnut chart"""
    try:
        active_events = Event.objects.filter(is_blocked=False).count()
        blocked_events = Event.objects.filter(is_blocked=True).count()
        public_events = Event.objects.filter(is_private=False, is_blocked=False).count()
        private_events = Event.objects.filter(is_private=True, is_blocked=False).count()
        
        data = {
            'labels': ['Active Events', 'Blocked Events', 'Public Events', 'Private Events'],
            'datasets': [{
                'label': 'Event Statistics',
                'data': [active_events, blocked_events, public_events, private_events],
                'backgroundColor': [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                'borderColor': [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(156, 163, 175, 1)',
                ],
                'borderWidth': 2,
            }],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_event_registration_trend_data(request):
    """API to get event registration trends over the last 12 months"""
    try:
        # Get last 12 months data
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        
        # Get monthly registration data
        monthly_registrations = []
        monthly_blocked = []
        labels = []
        
        for i in range(12):
            month_start = (start_date + timedelta(days=i*30)).replace(day=1)
            month_end = (month_start.replace(month=month_start.month+1) - timedelta(days=1)) if month_start.month < 12 else month_start.replace(year=month_start.year+1, month=1) - timedelta(days=1)
            
            # Count registrations for this month
            registrations = EventRegistration.objects.filter(
                registered_at__range=[month_start, month_end]
            ).count()
            
            blocked_registrations = EventRegistration.objects.filter(
                registered_at__range=[month_start, month_end],
                is_blocked=True
            ).count()
            
            monthly_registrations.append(registrations)
            monthly_blocked.append(blocked_registrations)
            labels.append(calendar.month_abbr[month_start.month])
        
        data = {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Event Registrations',
                    'data': monthly_registrations,
                    'fill': False,
                    'borderColor': 'rgb(75, 192, 192)',
                    'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                    'tension': 0.1,
                },
                {
                    'label': 'Blocked Registrations',
                    'data': monthly_blocked,
                    'fill': False,
                    'borderColor': 'rgb(255, 99, 132)',
                    'backgroundColor': 'rgba(255, 99, 132, 0.2)',
                    'tension': 0.1,
                },
            ],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_monthly_events_data(request):
    """API to get monthly events created and completed data"""
    try:
        current_year = timezone.now().year
        
        # Get events created by month
        events_created = []
        events_completed = []
        labels = []
        
        for month in range(1, 13):
            # Events created in this month
            created_count = Event.objects.filter(
                created_at__year=current_year,
                created_at__month=month
            ).count()
            
            # Events that ended in this month (assuming end_date field exists)
            completed_count = Event.objects.filter(
                end_date__year=current_year,
                end_date__month=month
            ).count()
            
            events_created.append(created_count)
            events_completed.append(completed_count)
            labels.append(calendar.month_abbr[month])
        
        data = {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Events Created',
                    'data': events_created,
                    'backgroundColor': 'rgba(99, 102, 241, 0.8)',
                    'borderColor': 'rgba(99, 102, 241, 1)',
                    'borderWidth': 1,
                },
                {
                    'label': 'Events Completed',
                    'data': events_completed,
                    'backgroundColor': 'rgba(34, 197, 94, 0.8)',
                    'borderColor': 'rgba(34, 197, 94, 1)',
                    'borderWidth': 1,
                },
            ],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_event_category_stats(request):
    """API to get event statistics by category"""
    try:
        # Assuming you have categories in your Event model
        category_stats = Event.objects.values('category').annotate(
            count=Count('id')
        ).order_by('-count')[:10]  # Top 10 categories
        
        labels = [stat['category'] for stat in category_stats]
        data_values = [stat['count'] for stat in category_stats]
        
        # Generate colors dynamically
        colors = [
            f'rgba({50 + i * 20}, {100 + i * 15}, {200 - i * 10}, 0.8)'
            for i in range(len(labels))
        ]
        
        data = {
            'labels': labels,
            'datasets': [{
                'label': 'Events by Category',
                'data': data_values,
                'backgroundColor': colors,
                'borderWidth': 1,
            }],
        }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def get_dashboard_analytics(request):
    """Comprehensive dashboard analytics API"""
    try:
        # User stats
        user_stats = {
            'total_users': User.objects.count(),
            'attendee_count': User.objects.filter(user_type='attendee').count(),
            'organizer_count': User.objects.filter(user_type='organizer').count(),
            'superuser_count': User.objects.filter(is_superuser=True).count(),
            'vendor_count': User.objects.filter(user_type='vendor').count(),
        }
        
        # Event stats
        event_stats = {
            'total_events': Event.objects.count(),
            'active_events': Event.objects.filter(is_blocked=False).count(),
            'blocked_events': Event.objects.filter(is_blocked=True).count(),
            'public_events': Event.objects.filter(is_private=False).count(),
            'private_events': Event.objects.filter(is_private=True).count(),
        }
        
        # Registration stats
        registration_stats = {
            'total_registrations': EventRegistration.objects.count(),
            'active_registrations': EventRegistration.objects.filter(is_blocked=False).count(),
            'blocked_registrations': EventRegistration.objects.filter(is_blocked=True).count(),
        }
        
        # Recent activity (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_stats = {
            'recent_events': Event.objects.filter(created_at__gte=thirty_days_ago).count(),
            'recent_registrations': EventRegistration.objects.filter(registered_at__gte=thirty_days_ago).count(),
            'recent_users': User.objects.filter(date_joined__gte=thirty_days_ago).count(),
        }
        
        return JsonResponse({
            'success': True,
            'data': {
                'user_stats': user_stats,
                'event_stats': event_stats,
                'registration_stats': registration_stats,
                'recent_stats': recent_stats,
            }
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)