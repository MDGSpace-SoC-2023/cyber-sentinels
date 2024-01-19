from rest_framework import serializers
from .models import *

# class PasswordVaultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PasswordVault
#         fields = '__all__'


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = "__all__"


class PasswordSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="domain.vault.user.username", read_only=True)

    class Meta:
        model = Password
        exclude = ["created_at"]
        depth = 1

    def create(self, validated_data):
        validated_data["created_at"] = timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("created_at", None)
        return super().update(instance, validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
