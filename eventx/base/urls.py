from django.urls import path
from .views import RegisterView 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
        path('api/event/Comments', views.EventCommentsView.as_view(), name='EventCommentsView'),
path('api/event/Comments/<int:event_id>/', views.EventCommentsView.as_view(), name='EventCommentsView'),
path('api/event/single-Comment/<int:comment_id>/', views.SingleCommentAPIView.as_view(), ),
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/dashboard/user/', views.DashboardUserView.as_view(), name='dashboard'),
    path('api/dashboard/event/', views.DashboardEventView.as_view(), name='dashboard'),
    path('events/<int:event_id>/comment/', views.CommentAPIView.as_view(), name='comment-with-rating'),
    path('events/<int:event_id>/rating/',views.RatingAPIView.as_view(), name='rating_api'),
    path('events/<int:event_id>/rating-summary/', views.EventRatingSummaryAPIView.as_view(), name='event_rating_summary_api'),

]

