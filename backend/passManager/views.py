import base64
from .models import *
from account.models import MasterHash, MultiToken, ProfileSettings
from .serializers import *
from django.db.models import Count
from datetime import timedelta
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.validators import EmailValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import Fernet
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


def generate_key(secret, salt):
    secret_bytes = secret.encode()
    salt = salt.encode()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(secret_bytes))
    return key.decode()


def decrypt_password(encrypted_password, key):
    cipher_suite = Fernet(key)
    decrypted_password = cipher_suite.decrypt(encrypted_password.encode()).decode()
    return decrypted_password


def encrypt_password(password, key):
    cipher_suite = Fernet(key)
    encrypted_password = cipher_suite.encrypt(password.encode())
    return encrypted_password.decode()


@login_required
def home(request):
    return render(request, "passManager/home.html")


@login_required
def passwordGenerator(request):
    return render(request, "passManager/passwordGenerator.html")


@login_required
def notifications(request):
    return render(request, "passManager/notifications.html")


@login_required
def passwordUsage(request):
    return render(request, "passManager/passwordUsage.html")


@login_required
def darkwebMonitoring(request):
    return render(request, "passManager/darkwebMonitoring.html")


@login_required
def devices(request):
    user = request.user
    queryset = MultiToken.objects.filter(user=user).order_by("-loginTime")

    if request.method == "POST":
        uid = request.POST.get("uid")
        MultiToken.objects.filter(uid=uid).delete()
    return render(request, "passManager/devices.html", {"activeLogin": queryset})


@login_required
def changePassword(request):
    if request.method == "POST":
        user = request.user
        old_password = request.POST.get("currentpwd")
        new_password = request.POST.get("newpwd")
        confirm_password = request.POST.get("confirmpwd")

        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            messages.error(request, ", ".join(e.messages))
            return redirect("changepassword")

        if check_password(old_password, user.password):
            if new_password == old_password:
                messages.error(request, "Password already in use")
                return redirect("changepassword")
            if new_password == confirm_password:
                hashed_password = make_password(new_password)
                user.password = hashed_password
                user.save()
                update_session_auth_hash(request, user)
                messages.success(request, "Password Updated Successfully")
                return redirect("changepassword")
            else:
                messages.error(
                    request, "New Password and Confirm Password do not match"
                )
        else:
            messages.error(request, "Current Password Not Matching")
    return render(request, "passManager/changePassword.html")


from django.shortcuts import get_object_or_404


@login_required
def profile(request):
    if request.method == "GET":
        username = request.user.username
        name = request.user.first_name
        email = request.user.email
        profile = get_object_or_404(ProfileSettings, user=request.user)
        expiry_minutes = 365 * 100 * 24 * 3600
        context = {
            "username": username,
            "name": name,
            "email": email,
            "auto_capture": profile.autoCapture,
            "expiry": int(profile.expiry_duration.total_seconds() / 60),
            "expiry_not_default": profile.expiry_duration.total_seconds()
            != expiry_minutes,
        }
        return render(request, "passManager/profile.html", context)

    elif request.method == "POST":
        if request.POST.get("username"):
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
        else:
            expiry_duration_minutes = request.POST.get("time")
            if expiry_duration_minutes:
                try:
                    expiry_duration_minutes = int(expiry_duration_minutes)
                    expiry_duration = timezone.timedelta(
                        minutes=expiry_duration_minutes
                    )
                except ValueError:
                    expiry_duration = timezone.timedelta(days=36500)
            auto_capture = request.POST.get("autoCapture")
            automatic_logout = request.POST.get("automaticLogout")
            if auto_capture:
                flag = False
            else:
                flag = True
            profile, created = ProfileSettings.objects.get_or_create(user=request.user)
            profile.autoCapture = flag
            if automatic_logout and expiry_duration:
                profile.expiry_duration = expiry_duration
            else:
                profile.expiry_duration = timezone.timedelta(days=36500)
            profile.save()
            return redirect("profile")

    return render(request, "passManager/profile.html")


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
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        if not target_domain:
            domains = Domain.objects.filter(vault=vault)
        else:
            domains = Domain.objects.filter(name=target_domain)
        if not usage:
            queryset = Password.objects.filter(domain__in=domains)
            for instance in queryset:
                instance.encrypted_password = decrypt_password(
                    instance.encrypted_password, key
                )
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
            for instance in instances_with_same_encrypted_password:
                instance.encrypted_password = decrypt_password(
                    instance.encrypted_password, key
                )
            return instances_with_same_encrypted_password


class PasswordRetrieveView(generics.RetrieveAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return Password.objects.none()
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        instance.encrypted_password = decrypt_password(instance.encrypted_password, key)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PasswordCreateView(generics.CreateAPIView):
    serializer_class = PasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_authentication_classes(self):
        if "Authorization" in self.request.headers:
            auth_header = self.request.headers["Authorization"]
            if auth_header.startswith("Token "):
                return [TokenAuthentication]
        elif "sessionid" in self.request.COOKIES:
            return [SessionAuthentication]
        return super().get_authentication_classes()

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        for instance in queryset:
            instance.encrypted_password = decrypt_password(
                instance.encrypted_password, key
            )
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        domain_name = self.request.data.get("domain_name", "")
        user_name = self.request.data.get("username")
        vault, vault_created = PasswordVault.objects.get_or_create(user=user)
        domain, domain_created = Domain.objects.get_or_create(
            vault=vault, name=domain_name
        )
        if user_name:
            check = Password.objects.filter(domain=domain, username=user_name)
            if check.exists():
                raise serializers.ValidationError(
                    "Username already exists for this domain."
                )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        password = serializer.validated_data.get("encrypted_password", "")
        encrypted_password = encrypt_password(password, key)
        serializer.validated_data["encrypted_password"] = encrypted_password
        serializer.save(domain=domain)
        Notification.objects.create(
            vault=vault,
            username=serializer.instance.username,
            domain=serializer.instance.domain.name,
            tag=serializer.instance.notes,
            status="Created",
        )
        return super().perform_create(serializer)


class PasswordUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_authentication_classes(self):
        if "Authorization" in self.request.headers:
            auth_header = self.request.headers["Authorization"]
            if auth_header.startswith("Token "):
                return [TokenAuthentication]
        elif "sessionid" in self.request.COOKIES:
            return [SessionAuthentication]
        return super().get_authentication_classes()

    def get_authentication_classes(self):
        if "Authorization" in self.request.headers:
            auth_header = self.request.headers["Authorization"]
            if auth_header.startswith("Token "):
                return [TokenAuthentication]
        elif "sessionid" in self.request.COOKIES:
            return [SessionAuthentication]
        return super().get_authentication_classes()

    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except:
            return Password.objects.none()
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        for instance in queryset:
            instance.encrypted_password = decrypt_password(
                instance.encrypted_password, key
            )
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        instance.encrypted_password = decrypt_password(instance.encrypted_password, key)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_update(self, serializer):
        user = self.request.user
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        password = serializer.validated_data.get("encrypted_password", "")
        encrypted_password = encrypt_password(password, key)
        serializer.validated_data["encrypted_password"] = encrypted_password
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return None
        Notification.objects.create(
            vault=vault,
            username=serializer.instance.username,
            domain=serializer.instance.domain.name,
            tag=serializer.instance.notes,
            status="Updated",
        )
        serializer.save()


class PasswordDeleteView(generics.RetrieveDestroyAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return Password.objects.none()
        salt = MasterHash.objects.get(user=user).salt
        key = generate_key(settings.SECRET_KEY, salt=salt)
        domains = Domain.objects.filter(vault=vault)
        queryset = Password.objects.filter(domain__in=domains)
        for instance in queryset:
            instance.encrypted_password = decrypt_password(
                instance.encrypted_password, key
            )
        return queryset

    def perform_destroy(self, instance):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return None
        Notification.objects.create(
            vault=vault,
            username=instance.username,
            domain=instance.domain.name,
            tag=instance.notes,
            status="Deleted",
        )
        instance.delete()


class DomainDelete(generics.DestroyAPIView):
    serializer_class = PasswordSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return Domain.objects.none()
        queryset = Domain.objects.filter(vault=vault)
        return queryset

    def perform_destroy(self, instance):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return None
        passwords = Password.objects.filter(domain=instance)
        for password in passwords:
            Notification.objects.create(
                vault=vault,
                username=password.username,
                domain=password.domain.name,
                tag=password.notes,
                status="Deleted",
            )
        instance.delete()


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            vault = PasswordVault.objects.get(user=user)
        except PasswordVault.DoesNotExist:
            return None

        cutoff_date = timezone.now() - timedelta(days=90)
        outdated_passwords = Password.objects.filter(
            domain__vault=vault, updated_at__lte=cutoff_date
        )

        for outdated_password in outdated_passwords:
            existing_notification = Notification.objects.filter(vault=vault).first()

            if not existing_notification:
                new_notification = Notification.objects.create(
                    vault=vault,
                    username=outdated_password.username,
                    domain=outdated_password.domain.name,
                    tag=outdated_password.instance.notes,
                    status="deprecated",
                )
        notifications = Notification.objects.filter(vault=vault)
        return notifications