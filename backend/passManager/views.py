from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Count
from django.contrib.auth.models import User
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
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


def changePassword(request):
    return render(request, "passManager/changePassword.html")


def profile(request):
    if request.method == "GET":
        username = request.user.username
        name = request.user.first_name
        email = request.user.email
        context = {"username": username, "name": name, "email": email}
        return render(request, "passManager/profile.html", context)

    elif request.method == "POST":
        updated_username = request.POST.get("username")
        updated_name = request.POST.get("name")
        updated_email = request.POST.get("email")

        if (
            User.objects.filter(username=updated_username)
            .exclude(pk=request.user.pk)
            .exists()
        ):
            messages.error(
                request, "Username already exists. Please choose a different one."
            )
            return redirect("profile")

        try:
            EmailValidator()(updated_email)
        except ValidationError as e:
            messages.error(request, e.message)
            return redirect("profile")

        if (
            User.objects.filter(email=updated_email)
            .exclude(pk=request.user.pk)
            .exists()
        ):
            messages.error(
                request, "Email already exists. Please choose a different one."
            )
            return redirect("profile")

        user = request.user
        user.username = updated_username
        user.first_name = updated_name
        user.email = updated_email
        user.save()
        messages.success(request, "Profile updated successfully.")
        return redirect("profile")
    return render(request, "passManager/profile.html")


from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control


@method_decorator(
    cache_control(no_cache=True, must_revalidate=True, no_store=True), name="dispatch"
)
class PasswordListView(generics.ListAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        target_domain = self.request.query_params.get("target_domain")
        usage = self.request.query_params.get("usage")
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return None
        if not target_domain:
            domains = Domain.objects.filter(vault=vault)
        else:
            domains = Domain.objects.filter(name=target_domain)
        if not usage:
            queryset = Password.objects.filter(domain__in=domains)
            return queryset
        else:
            queryset = Password.objects.values("encrypted_password").annotate(
                count=Count("encrypted_password")
            )
            duplicated_passwords = queryset.filter(count__gt=1)
            instances_with_same_encrypted_password = Password.objects.filter(
                encrypted_password__in=duplicated_passwords.values("encrypted_password")
            )
            instances_with_same_encrypted_password = (
                instances_with_same_encrypted_password.annotate(
                    count=Count("encrypted_password")
                )
            )
            return instances_with_same_encrypted_password


class PasswordUsageListView(generics.RetrieveAPIView):
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
