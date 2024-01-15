from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path("", home, name="home"),
    path("view/", PasswordListView.as_view()),
    path("<int:pk>/view/", PasswordRetrieveView.as_view()),
    path("create/", PasswordCreateView.as_view()),
    path("<int:pk>/update/", PasswordUpdateView.as_view()),
    path("<int:pk>/delete/", PasswordDeleteView.as_view()),
]