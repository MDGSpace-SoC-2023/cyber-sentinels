from rest_framework import serializers
from .models import *

# class PasswordVaultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PasswordVault
#         fields = '__all__'

# class DomainSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Domain
#         fields = '__all__'

# class URLSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = URL
#         fields = '__all__'


class PasswordSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="domain.vault.user.username", read_only=True)

    class Meta:
        model = Password
        fields = "__all__"
        depth = 2
