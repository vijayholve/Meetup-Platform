from django.contrib import admin
from django.urls import path,include
# add these two imports
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/vendors/', include('vendors.urls')),
    path('api/users/', include('users.urls')),
    path('', include('base.urls')),
    path('api/events/', include('events.urls')),
    path('api/auth/', include('accounts.urls')),
    path('siteconfig/',include('SiteConfig.urls')),
        path('api/tickets/',include('qrCode.urls')),

]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )