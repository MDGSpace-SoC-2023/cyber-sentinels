from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class PasswordVault(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Vault"


class Domain(models.Model):
    vault = models.ForeignKey(PasswordVault, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.vault.user.username}'s Domain: {self.name}"

    class Meta:
        unique_together = ("vault", "name")


class Password(models.Model):
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    sync = models.BooleanField(default=True)
    encrypted_password = models.TextField()
    username = models.CharField(max_length=255, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    device_identifier = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.domain.vault.user.username}'s Domain: {self.domain.name} Password for: {self.username}"


class Notification(models.Model):
    STATUS_CHOICES = [
        ("deprecated", "Deprecated"),
        ("created", "Created"),
        ("deleted", "Deleted"),
        ("updated", "Updated"),
    ]
    vault = models.ForeignKey(PasswordVault, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateField(default=timezone.now)

    username = models.CharField(max_length=255, null=True, blank=True)
    domain = models.CharField(max_length=255, null=True, blank=True)
    tag = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.pk_field} - {self.status}"
