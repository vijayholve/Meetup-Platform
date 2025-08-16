# base/adapters.py

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.signals import pre_social_login
from django.dispatch import receiver
from django.conf import settings

# This adapter is for general allauth account management (e.g., during traditional signup)
class CustomAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        # Default behavior: save user, then set email
        user = super().save_user(request, user, form, commit=False)
        # Assuming 'role' is in the form if using a custom signup form
        user.role = form.cleaned_data.get('role', 'attendee') # Default to 'attendee'
        if commit:
            user.save()
        setup_user_email(request, user, [])
        return user

# This adapter is specifically for social account logins
class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Invoked just prior to the actual login process.
        Here, we can modify the user object before it's saved.
        """
        user = sociallogin.user
        if not user.pk: # If it's a new user (not linking an existing account)
            # Set a default role for new social users
            # You might want to prompt them to choose a role on the frontend
            # after this initial login, but for a "quick way", a default is easiest.
            user.role = 'attendee' # Or 'organizer', 'vendor', etc. based on your default
            # You could also try to get a profile picture here if the social provider offers it
            # if sociallogin.account.extra_data.get('picture'):
            #     # Logic to download and save profile image
            #     pass
        # You can add more logic here, e.g., to link existing users
        # if User.objects.filter(email=user.email).exists():
        #     # Logic to connect existing user
        #     pass

    def save_user(self, request, sociallogin, form=None):
        """
        Hook for saving the user after the social login.
        Overrides default to ensure role is saved if set in pre_social_login.
        """
        user = sociallogin.user
        # The role should already be set if it's a new user from pre_social_login
        # If it's an existing user linking, the role should already be there.

        # Call the default save_user to save the user and associated social account
        # Ensure user.save() is called here or in pre_social_login if you set a role.
        # DefaultSocialAccountAdapter.save_user handles user.save() and sociallogin.save().
        return super().save_user(request, sociallogin, form)