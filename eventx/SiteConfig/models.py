from django.db import models

class Siteconfig(models.Model):
    navbar_title = models.CharField(max_length=200)
    navbar_image = models.ImageField(upload_to="Siteconfig/")
    headers_name = models.CharField(max_length=100)
    footer_text = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    social_links = models.JSONField(default=dict, blank=True, null=True)
    homepage_banner = models.ImageField(upload_to="banners/", blank=True, null=True)
    primary_color = models.CharField(max_length=7, default="#000000")
    secondary_color = models.CharField(max_length=7, default="#FFFFFF")
    meta_title = models.CharField(max_length=150, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.TextField(blank=True, null=True)
    about_text = models.TextField(blank=True, null=True)
    about_image = models.ImageField(upload_to="about/", blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    favicon = models.ImageField(upload_to="icons/", blank=True, null=True)
    default_language = models.CharField(max_length=10, default="en")
    privacy_policy = models.TextField(blank=True, null=True)
    terms_and_conditions = models.TextField(blank=True, null=True)
    is_maintenance = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.navbar_title}"

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configurations"
