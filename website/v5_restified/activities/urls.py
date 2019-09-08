# -*- coding: utf-8 -*-

from rest_framework.routers import DefaultRouter

from .viewsets import GroupViewSet, ActivityViewSet, UpcomingActivityViewSet


def build_urlpatterns():
    router = DefaultRouter()
    router.register(r'groups', GroupViewSet, basename='group')
    router.register(r'activities/(?P<group_slug>[^/]+)', ActivityViewSet, basename='activity')
    router.register(r'upcoming-activities', UpcomingActivityViewSet, basename='upcoming-activity')
    return router.urls


urlpatterns = build_urlpatterns()
