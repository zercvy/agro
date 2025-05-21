from django.conf import settings
from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

from .models import User

@receiver(post_save, sender=User)
def send_activation_email(sender, instance, created, **kwargs):
    if created and not instance.is_active:
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        token = default_token_generator.make_token(instance)
        activation_link = f"http://localhost:8000/api/auth/activate/{uid}/{token}/"
        
        subject = "Активация аккаунта"
        message = f"Здравствуйте! Перейдите по ссылке для активации аккаунта:\n\n{activation_link}"
        
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [instance.email])
