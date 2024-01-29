import secrets
import string
import re
from .models import MasterHash, MultiToken, ProfileSettings
from .serializers import UserSerializer
from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import PasswordResetView
from django.contrib.auth import logout, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.urls import reverse
from django.utils.safestring import mark_safe
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.middleware import csrf as django_csrf


@require_GET
def get_master_password(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    master = MasterHash.objects.get(user=request.user)
    hashed_master_password = master.hash
    salt = master.salt
    email = request.user.email
    return JsonResponse(
        {"hashedMasterPassword": hashed_master_password, "salt": salt, "email": email}
    )


def generate(length=16, lowercase=True, uppercase=True, numbers=True, symbols=True):
    characters = string.ascii_lowercase
    if uppercase:
        characters += string.ascii_uppercase
    if numbers:
        characters += string.digits
    if symbols:
        characters += string.punctuation
    pattern = r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])"
    password = ""
    while not (
        any([char in password for char in string.ascii_lowercase])
        and any([char in password for char in string.ascii_uppercase])
        and any([char in password for char in string.digits])
        and any([char in password for char in string.punctuation])
        and re.search(pattern, password)
    ):
        password = "".join(secrets.choice(characters) for _ in range(length))

    return password


def index(request):
    if request.user.is_authenticated:
        return redirect("home")
    return render(request, "account/index.html")


@api_view(["POST"])
def register_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            ProfileSettings.objects.create(user=user)
            password = generate(20)
            salt = generate(20).replace("$", "")
            hash = make_password(password, salt=salt)
            MasterHash.objects.create(user=user, hash=hash, salt=generate(20))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def csrf_view(request):
    csrf_token = django_csrf.get_token(request)
    print(csrf_token)
    return JsonResponse({"csrf": csrf_token})


@api_view(["POST"])
def user_login(request):
    # print(request.headers)
    # csrf_token = csrf.get_token(request)
    # response = HttpResponse("Response content")
    # response["X-CSRFToken"] = csrf_token
    # print(request.headers)
    # if request.user.is_authenticated:
    #     return redirect("home")
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")
        browser = request.data.get("browser")
        os = request.data.get("os")
        type = request.data.get("loginType")
        if "@" in username:
            user = User.objects.filter(email=username).first()

            if user:
                if user.check_password(password):
                    login(request, user)
                    token = MultiToken.objects.create(
                        user=user,
                        browser=browser,
                        loginTime=timezone.now(),
                        os=os,
                        type=type,
                    )
                    profile, _ = ProfileSettings.objects.get_or_create(
                        request=request.user
                    )
                    return Response({"token": token.key}, status=status.HTTP_200_OK)

        else:
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                token = MultiToken.objects.create(
                    user=user,
                    browser=browser,
                    loginTime=timezone.now(),
                    os=os,
                    type=type,
                )
                profile, _ = ProfileSettings.objects.get_or_create(user=request.user)
                return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        auth_header = request.headers.get("Authorization")
        token = auth_header.split()[1]
        MultiToken.objects.filter(key=token, user=request.user).delete()
        logout(request)

        return Response(
            {"message": "Successfully logged out."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def is_valid(loginTime, expiry_duration):
    expiry_datetime = loginTime + expiry_duration
    return timezone.now() < expiry_datetime


@api_view(["POST"])
def verify(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JsonResponse(
                {"result": False, "error": "Missing authorization header"}, status=401
            )
        token = auth_header.split()[1]
        token_instance = MultiToken.objects.filter(key=token).first()
        if not token_instance:
            return JsonResponse({"result": False, "error": "Invalid token"}, status=401)
        profile_settings = ProfileSettings.objects.filter(user=request.user).first()
        if not profile_settings or not profile_settings.expiry_duration:
            return JsonResponse(
                {"result": False, "error": "Expiry duration not set for user"},
                status=401,
            )
        if is_valid(token_instance.loginTime, profile_settings.expiry_duration):
            return JsonResponse({"result": True})
        else:
            return JsonResponse({"result": False, "error": "Token expired"}, status=401)
    except IndexError:
        return JsonResponse(
            {"result": False, "error": "Invalid authorization header"}, status=401
        )
    except Exception as e:
        return JsonResponse(
            {"result": False, "error": "Internal server error"}, status=500
        )


class CustomPasswordResetView(PasswordResetView):
    def form_valid(self, form):
        email = form.cleaned_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            register_url = reverse("auth")
            error_message = 'Email address not found. Please  <a style="color: #0000FF" href="{}">Register</a>'.format(
                register_url
            )
            messages.error(self.request, mark_safe(error_message))
            return self.form_invalid(form)

        return super().form_valid(form)


from django.http import HttpResponse


@login_required
def my_view(request):
    user = request.user

    if user.is_authenticated:
        return HttpResponse(f"Hello, {user.username}! You are logged in.")
    else:
        return HttpResponse("You are not logged in.")