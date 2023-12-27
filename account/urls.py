from django.urls import path, include
from .views import *

urlpatterns = [
    path('', index),
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
]
