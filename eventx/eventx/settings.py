# eventx/settings.py

from pathlib import Path
import os
from decouple import config
from datetime import timedelta # Import timedelta for JWT settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

SECRET_KEY = config("SECRET_KEY", default='django-insecure-ifhs)dq@r**%ug4g1ql0tt(2tw#i1j4w0b2aeq*%+!9zh=8vkq') # Use default if not found in .env

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    # -------------------------------------------------------------
    # 1. YOUR CUSTOM USER APP MUST BE AT THE VERY TOP
    'users.apps.UsersConfig', # <--- THIS IS THE CRITICAL CHANGE. Ensure this is correct if your apps.py has UsersConfig.
                              # If your apps.py doesn't define UsersConfig, just use 'users'
    # -------------------------------------------------------------

    # 2. Django built-in apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', # Required by allauth

    # 3. Third-party apps that depend on custom user model / REST framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', # If you want refresh token blacklist
    'corsheaders',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google', # For Google OAuth

    'dj_rest_auth',
    'dj_rest_auth.registration',

    # 4. Your other custom apps
    'base', # If this app has models that relate to User, ensure it's loaded after 'users'
    'vendors.apps.VendorsConfig',
    'events.apps.EventsConfig',
    'SiteConfig', # Assuming this is a custom app
    'accounts', # Assuming this is a custom app ,
    'Dashboard',
]

# in settings.py
SITE_ID = 1

# ------------------------------------------------------------------
# This is correctly pointing to your 'users' app.
AUTH_USER_MODEL = 'users.User'
# ------------------------------------------------------------------

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # Ensure corsheaders middleware is here
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware', # This is correct
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'eventx.urls'

# eventx/settings.py
# eventx/settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # allauth required context processors - THESE ARE THE CORRECT ONES
                # 'allauth.account.context_processors.account',
                # 'allauth.socialaccount.context_processors.socialaccount',
            ],
        },
    },
]
WSGI_APPLICATION = 'eventx.wsgi.application' # Corrected this line, remove the `from os import getenv` if not used for WSGI.

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='3306'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # React default port
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication', # Keep this for admin
        'rest_framework.authentication.BasicAuthentication', # Keep this for admin
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True, # Changed to True, recommended for security
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# 
# dj-rest-auth settings
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_HTTPONLY': False,
    'USER_DETAILS_SERIALIZER': 'base.serializers.UserDetailsSerializer',
    'SESSION_LOGIN': False,
    'TOKEN_MODEL': None,
    'OLD_PASSWORD_FIELD_ENABLED': True,
    'LOGOUT_ON_PASSWORD_CHANGE': True,
    'REGISTER_SERIALIZER': 'base.serializers.CustomRegisterSerializer',
    'REGISTER_SERIALIZER_CLASSES': {
        'google': 'dj_rest_auth.registration.serializers.SocialAccountRegisterSerializer',
    }
}

# allauth adapter
ACCOUNT_ADAPTER = 'base.adapters.CustomSocialAccountAdapter'