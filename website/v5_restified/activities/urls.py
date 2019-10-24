# -*- coding: utf-8 -*-

from rest_framework.routers import DefaultRouter

from . import viewsets


def build_urlpatterns():
    router = DefaultRouter()
    router.register(
        r'groups',
        viewsets.GroupViewSet,
        basename='group'
    )
    router.register(
        r'activities',
        viewsets.ActivityViewSet,
        basename='activity'
    )
    router.register(
        r'activities/(?P<activity_pk>\d+)/subscribers',
        viewsets.SubscriberViewSet,
        basename='subscriber'
    )
    return router.urls


urlpatterns = build_urlpatterns()
