from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from events.models import EventRegistration, Event, Venue, City, Category, User
from django.utils import timezone
from django.db.models import Count, Q
from datetime import datetime, timedelta
import calendar
import random

class EventRegistrationTrendView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication
    
    def get(self, request):
        try:
            # Get last 12 months data
            end_date = timezone.now()
            
            # Initialize data structures
            labels = []
            registrations_data = []
            blocked_data = []
            
            # Generate last 12 months data
            for i in range(12):
                # Calculate month date
                month_date = end_date.replace(day=1) - timedelta(days=i*30)
                month_date = month_date.replace(day=1)
                
                # Calculate next month for range
                if month_date.month == 12:
                    next_month = month_date.replace(year=month_date.year + 1, month=1)
                else:
                    next_month = month_date.replace(month=month_date.month + 1)
                
                # Count registrations for this month
                total_regs = EventRegistration.objects.filter(
                    registered_at__gte=month_date,
                    registered_at__lt=next_month
                ).count()
                
                blocked_regs = EventRegistration.objects.filter(
                    registered_at__gte=month_date,
                    registered_at__lt=next_month,
                    is_blocked=True
                ).count()
                
                # Insert at beginning to maintain chronological order
                labels.insert(0, calendar.month_abbr[month_date.month])
                registrations_data.insert(0, total_regs)
                blocked_data.insert(0, blocked_regs)
            
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
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MonthlyEventsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            current_year = timezone.now().year
            
            # Initialize data
            events_created = []
            events_completed = []
            labels = []
            
            for month in range(1, 13):
                # Events created in this month
                created_count = Event.objects.filter(
                    created_at__year=current_year,
                    created_at__month=month
                ).count()
                
                # Events that ended in this month
                completed_count = Event.objects.filter(
                    end_time__year=current_year,
                    end_time__month=month
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
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventCategoryStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Get category stats
            category_stats = Event.objects.filter(
                category__isnull=False
            ).values('category__name').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            if not category_stats:
                # Return default data if no categories exist
                data = {
                    'labels': ['No Categories'],
                    'datasets': [{
                        'label': 'Events by Category',
                        'data': [0],
                        'backgroundColor': ['rgba(156, 163, 175, 0.8)'],
                        'borderColor': ['rgba(156, 163, 175, 1)'],
                        'borderWidth': 1,
                    }],
                }
            else:
                labels = [stat['category__name'] for stat in category_stats]
                data_values = [stat['count'] for stat in category_stats]
                
                # Generate random colors
                colors = []
                border_colors = []
                color_options = [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)',
                    'rgba(255, 99, 255, 0.8)',
                    'rgba(99, 255, 132, 0.8)',
                ]
                
                border_color_options = [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 99, 255, 1)',
                    'rgba(99, 255, 132, 1)',
                ]
                
                for i in range(len(labels)):
                    colors.append(color_options[i % len(color_options)])
                    border_colors.append(border_color_options[i % len(border_color_options)])
                
                data = {
                    'labels': labels,
                    'datasets': [{
                        'label': 'Events by Category',
                        'data': data_values,
                        'backgroundColor': colors,
                        'borderColor': border_colors,
                        'borderWidth': 1,
                    }],
                }
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VenueStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Get venue stats
            venue_stats = Event.objects.filter(
                venue__isnull=False
            ).values('venue__name', 'venue__city__name').annotate(
                count=Count('id')
            ).order_by('-count')[:8]
            
            if not venue_stats:
                data = {
                    'labels': ['No Venues'],
                    'datasets': [{
                        'label': 'Events by Venue',
                        'data': [0],
                        'backgroundColor': ['rgba(156, 163, 175, 0.8)'],
                        'borderColor': ['rgba(156, 163, 175, 1)'],
                        'borderWidth': 2,
                    }],
                }
            else:
                labels = [f"{stat['venue__name']} ({stat['venue__city__name']})" for stat in venue_stats]
                data_values = [stat['count'] for stat in venue_stats]
                
                # Beautiful gradient colors
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
                    'labels': labels,
                    'datasets': [{
                        'label': 'Events by Venue',
                        'data': data_values,
                        'backgroundColor': gradient_colors[:len(labels)],
                        'borderColor': border_colors[:len(labels)],
                        'borderWidth': 2,
                    }],
                }
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Get total users
            total_users = User.objects.count()
            
            # Get users by role dynamically
            role_stats = User.objects.values('role').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Get superuser count
            superuser_count = User.objects.filter(is_superuser=True).count()
            
            # Prepare data
            labels = ['Total Users']
            data_values = [total_users]
            colors = ['rgba(54, 162, 235, 0.8)']
            border_colors = ['rgba(54, 162, 235, 1)']
            
            # Color palette for different roles
            role_colors = [
                ('rgba(75, 192, 192, 0.8)', 'rgba(75, 192, 192, 1)'),
                ('rgba(255, 206, 86, 0.8)', 'rgba(255, 206, 86, 1)'),
                ('rgba(153, 102, 255, 0.8)', 'rgba(153, 102, 255, 1)'),
                ('rgba(255, 159, 64, 0.8)', 'rgba(255, 159, 64, 1)'),
                ('rgba(199, 199, 199, 0.8)', 'rgba(199, 199, 199, 1)'),
            ]
            
            # Add role-based data
            for i, role_stat in enumerate(role_stats):
                if role_stat['role']:  # Only include non-null roles
                    role_name = role_stat['role'].title()  # Capitalize first letter
                    labels.append(f"{role_name}s")
                    data_values.append(role_stat['count'])
                    
                    color_index = i % len(role_colors)
                    colors.append(role_colors[color_index][0])
                    border_colors.append(role_colors[color_index][1])
            
            # Add superusers if any exist
            if superuser_count > 0:
                labels.append('Superusers')
                data_values.append(superuser_count)
                colors.append('rgba(255, 99, 132, 0.8)')
                border_colors.append('rgba(255, 99, 132, 1)')
            
            data = {
                'labels': labels,
                'datasets': [{
                    'label': 'User Count',
                    'data': data_values,
                    'backgroundColor': colors,
                    'borderColor': border_colors,
                    'borderWidth': 1,
                }],
            }
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            total_events = Event.objects.count()
            active_events = Event.objects.filter(is_blocked=False).count()
            blocked_events = Event.objects.filter(is_blocked=True).count()
            public_events = Event.objects.filter(is_public=True, is_blocked=False).count()
            private_events = Event.objects.filter(is_public=False, is_blocked=False).count()
            
            data = {
                'labels': ['Total Events', 'Active Events', 'Blocked Events', 'Public Events', 'Private Events'],
                'datasets': [{
                    'label': 'Event Statistics',
                    'data': [total_events, active_events, blocked_events, public_events, private_events],
                    'backgroundColor': [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(156, 163, 175, 0.8)',
                    ],
                    'borderColor': [
                        'rgba(99, 102, 241, 1)',
                        'rgba(34, 197, 94, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(156, 163, 175, 1)',
                    ],
                    'borderWidth': 2,
                }],
            }
            
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)