from django.shortcuts import render
from .models import Siteconfig
from rest_framework.response import Response
from rest_framework.decorators  import api_view ,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import siteConfigSerializers
from rest_framework import status
import logging
logger = logging.getLogger(__name__)
@permission_classes([AllowAny])
class siteconfigApi(APIView):
    def get(self,request):
        try:
            site_config = Siteconfig.objects.first()
            serializers = siteConfigSerializers(site_config)
            return Response(serializers.data,status=status.HTTP_200_OK)
        except Siteconfig.DoesNotExist:
            return Response({"error":f"error is occur "},status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request):
        try:
            # Fetch the first Siteconfig object
            site_config = Siteconfig.objects.first()
            if not site_config:
                return Response(
                    {"error": "SiteConfig not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Validate and update the object with partial data
            serializer = siteConfigSerializers(
                site_config, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "SiteConfig updated successfully", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "error": "Validation failed",
                        "details": serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            logger.error(f"An error occurred during SiteConfig update: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )