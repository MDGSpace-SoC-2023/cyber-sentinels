from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path("", home, name="home"),
    path("generate/", passwordGenerator, name="passwordGenerator"),
    path("notifications/", notifications, name="notifications"),
    path("usage", passwordUsage, name="usage"),
    path("monitor", darkwebMonitoring, name="darkweb"),
    path("devices/", devices, name="devices"),
    path("changepassword/", changePassword, name="changepassword"),
    path("profile/", profile, name="profile"),
    path("view/", PasswordListView.as_view()),
    path("<int:pk>/view/", PasswordRetrieveView.as_view()),
    path("create/", PasswordCreateView.as_view()),
    path("<int:pk>/update/", PasswordUpdateView.as_view()),
    path("<int:pk>/delete/", PasswordDeleteView.as_view()),
    path("notificationslist/", NotificationListView.as_view()),
]
