from rest_framework.views import APIView
from rest_framework.response import Response
from .models import EventRegistration, Event ,Venue ,City ,Category
from .serializers import EventRegistrationSerializer, EventSerializer ,CitySerailizer,CategorySerailizer,VenueSerailizer 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication,BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

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
