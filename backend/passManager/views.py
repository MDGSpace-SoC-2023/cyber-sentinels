from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import generics


def home(request):
    return render(request, "passManager/home.html")


def passwordGenerator(request):
    return render(request, "passManager/passwordGenerator.html")


def notifications(request):
    return render(request, "passManager/notifications.html")


def passwordUsage(request):
    return render(request, "passManager/passwordUsage.html")


def darkwebMonitoring(request):
    return render(request, "passManager/darkwebMonitoring.html")


def devices(request):
    return render(request, "passManager/devices.html")


class PasswordListView(generics.ListAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        target_domain = self.request.query_params.get("target_domain")
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return None
        if not target_domain:
            domains = Domain.objects.filter(vault=vault)
        else:
            domains = Domain.objects.filter(name=target_domain)
        queryset = Password.objects.filter(domain__in=domains)
        return queryset


class PasswordRetrieveView(generics.RetrieveAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)

        return queryset


class PasswordCreateView(generics.CreateAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        print(self.request)
        domain_name = self.request.data.get("domain_name", "")
        vault, vault_created = PasswordVault.objects.get_or_create(user=user)
        domain, domain_created = Domain.objects.get_or_create(
            vault=vault, name=domain_name
        )
        serializer.save(domain=domain)
        return super().perform_create(serializer)


class PasswordUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        return queryset


class PasswordDeleteView(generics.RetrieveDestroyAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        return queryset
