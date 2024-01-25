from django.db import models
from django.contrib.auth.models import User
import uuid
from django.conf import settings


class MasterHash(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hash = models.TextField()
    salt = models.TextField()


from django.conf import settings
from django.db import models
from rest_framework.authtoken.models import Token


class MultiToken(Token):
    id = models.UUIDField(default=uuid.uuid4, editable=False)
    type = models.BooleanField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tokens",
        on_delete=models.CASCADE,
        verbose_name=("User"),
    )
    browser = models.CharField(max_length=255)
    os = models.CharField(max_length=255)
    loginTime = models.DateTimeField()
