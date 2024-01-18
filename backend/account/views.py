from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.contrib.auth.views import PasswordResetView
from django.contrib import messages
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.auth import logout,login


def index(request):
    return render(request, 'account/index.html')

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if '@' in username:
            user = User.objects.filter(email=username).first()

            if user:
                if user.check_password(password):
                    login(request,user)
                    token, _ = Token.objects.get_or_create(user=user)
                    return Response({'token': token.key}, status=status.HTTP_200_OK)

        else:
            user = authenticate(username=username, password=password)
            if user:
                login(request,user)
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        logout(request)
    except:
        pass
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class CustomPasswordResetView(PasswordResetView):
    def form_valid(self, form):
        email = form.cleaned_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            register_url = reverse('auth')
            error_message = 'Email address not found. Please  <a style="color: #0000FF" href="{}">Register</a>'.format(register_url)
            messages.error(self.request, mark_safe(error_message))
            return self.form_invalid(form)

        return super().form_valid(form)
    

from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

def my_view(request):
    # This view requires the user to be logged in
    # You can access the logged-in user using request.user
    user = request.user

    # Check if the user is authenticated
    if user.is_authenticated:
        return HttpResponse(f'Hello, {user.username}! You are logged in.')
    else:
        return HttpResponse('You are not logged in.')