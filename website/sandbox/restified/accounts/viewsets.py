# -*- coding: utf-8 -*-

import logging

from django.contrib.auth.models import User

from rest_framework import permissions, mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from v5.accounts.models import Profile, Notification

from sandbox.drfutils.viewsets import NonModelViewSet

from .serializers import (
    ProfileSerializer, ProfileAvatarSerializer, ProfileWithSensitiveDataSerializer,
    CurrentUserSerializer, NotificationSerializer, LoginSerializer, LogoutSerializer,
)


logger = logging.getLogger(__name__)


# ---------- Permissions --------------------------------------------------------------------------


class IsSelfProfile(permissions.IsAuthenticated):
    message = 'You are not allowed to update this profile.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Profile):
            return False
        return request.user.username == obj.user.username


# ---------- View sets on models ------------------------------------------------------------------


class ProfileViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ProfileSerializer
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_queryset(self):
        queryset = Profile.objects.filter(user__is_active=True)
        if self.action != 'list':
            return queryset
        # For list action, allow filtering on some bool fields.
        filter_kwargs = {}
        for bool_param_name in ('is_email_confirmed', 'is_phone_number_confirmed'):
            value = self.request.query_params.get(bool_param_name, None)
            if value is not None:
                filter_kwargs[bool_param_name] = value == 'true'
        return queryset.filter(**filter_kwargs)

    # Extra actions...
    #
    # NOTE: [DRF] Extra action can take extra kwargs that will be set for the routed view only.
    # For example: ``permission_classes`` and ``serializer_class``.
    # See: https://www.django-rest-framework.org/api-guide/viewsets/#marking-extra-actions-for-routing

    @action(
        detail=False, methods=['get'], url_path='my',
        permission_classes=[AllowAny],
        serializer_class=ProfileWithSensitiveDataSerializer
    )
    def retrieve_my_profile(self, request, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response(status=HTTP_204_NO_CONTENT)
        serializer = self.get_serializer(request.user.profile)
        return Response(serializer.data)

    @action(
        detail=False, methods=['put'], url_path='my',
        permission_classes=[IsSelfProfile],
        serializer_class=ProfileWithSensitiveDataSerializer
    )
    def update_my_profile(self, request, **kwargs):
        serializer = self.get_serializer(request.user.profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False, methods=['post'], url_path='my/avatar',
        permission_classes=[IsSelfProfile],
        serializer_class=ProfileAvatarSerializer
    )
    def update_my_avatar(self, request, **kwargs):
        serializer = self.get_serializer(request.user.profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class NotificationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Notification.objects.none()
        return Notification.objects.filter(receiver=self.request.user)


class AuthViewSet(NonModelViewSet):
    """
    Endpoints related to user authentication.
    """
    permission_classes = [AllowAny]

    @action(
        detail=False, methods=['post'], url_path='login',
        serializer_class=LoginSerializer
    )
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.login(request)
        return Response(serializer.data)

    @action(
        detail=False, methods=['get', 'post'], url_path='logout',
        serializer_class=LogoutSerializer
    )
    def logout(self, request):
        serializer = self.get_serializer()
        serializer.logout(request)
        return Response(serializer.data)
