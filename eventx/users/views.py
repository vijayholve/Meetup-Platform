from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from rest_framework.authentication import TokenAuthentication, SessionAuthentication,BasicAuthentication

from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.permissions import AllowAny
from .models import User
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer

class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    authentication_classes += [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    # permission_classes = [IsAuthenticated]  # or JWTAuthentication
    def get(self, request,pk=None):
        if pk:
            # Get single user
            user = get_object_or_404(User, id=pk)
            serializer = UserSerializer(user)
            return Response({
                'status': 200,
                'message': 'User Detail',
                'data': serializer.data ,
            })
        users = User.objects.filter(is_active=True)
        serializer = UserSerializer(users, many=True)
        return Response({
            'status': 200,
            'message': 'User List',
            'data': serializer.data
        })
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'status': 201,
                'message': 'User Created',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 400,
            'message': 'Bad Request',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk=None):
        if not pk:
            return Response({'status': 400, 'message': 'User ID is required for update'}, status=400)

        user = get_object_or_404(User, pk=pk)
        print("Request User:", request.user)
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 200, 'message': 'User Updated', 'data': serializer.data}, status=200)

        return Response({'status': 400, 'message': 'User Update Failed', 'errors': serializer.errors}, status=400)
    def delete(self, request, pk=None):
        if not pk:
            return Response({
            'status':400 ,
            "message":'user is deleted',
            }
)       
        user = get_object_or_404 (User,id=pk)
        user.is_active=False
        user.save()
        return Response({
            'status':200 ,
            "message":'user is deleted',
        },status=status.HTTP_200_OK)
