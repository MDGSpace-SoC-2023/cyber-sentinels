from django.db import models
from django.contrib.auth.models import User


class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_token = models.CharField(max_length=255, unique=True)
    expiration_time = models.DateTimeField()

    def __str__(self):
        return f"Session for {self.user.username}"


class MasterHash(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    hash = models.TextField()
    salt = models.TextField()