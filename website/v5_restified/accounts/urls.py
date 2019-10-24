# -*- coding: utf-8 -*-

from rest_framework import routers

from . import viewsets


def build_urlpatterns():
    router = routers.DefaultRouter()
    router.register(
        r'profiles',
        viewsets.ProfileViewSet,
        basename='profile'
    )
    router.register(
        r'notifications',
        viewsets.NotificationViewSet,
        basename='notification'
    )
    router.register(
        r'auth',
        viewsets.AuthViewSet,
        basename='auth'
    )
    return router.urls


urlpatterns = build_urlpatterns()
