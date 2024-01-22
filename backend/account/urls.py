from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path('', index,name='auth'),
    path('user/',my_view),
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('password-reset/', CustomPasswordResetView.as_view(
        template_name='account/password_reset.html'), name='password_reset'),
    path('password-reset-sent/', auth_views.PasswordResetDoneView.as_view(
        template_name='account/password_reset_sent.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='account/password_reset_confirm.html'),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='account/password_reset_complete.html'),
         name='password_reset_complete'),
     path('get_csrf_token/', get_csrf_token, name='get_csrf_token'),
]
