# -*- coding: utf-8 -*-

import datetime
import logging

from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.filters import BaseFilterBackend
from rest_framework.permissions import BasePermission, IsAuthenticatedOrReadOnly, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from drfutils.permissions import DenyAll

from v5.activities.models import Group, GroupMember, Activity, Subscriber

from .serializers import (
    GroupSerializer, ActivitySerializer, ActivityTagListSerializer, SubscriberSerializer,
)


logger = logging.getLogger(__name__)


# ---------- Permissions --------------------------------------------------------------------------


class IsApprovedGroupMember(BasePermission):
    def __init__(self, group):
        self.group = group

    def has_permission(self, request, view):
        if not self.group:
            return False
        if not request.user.is_authenticated:
            return False
        return (
            request.user.is_superuser
            or GroupMember.objects.filter(
                group=self.group,
                user=request.user,
                is_approved=True
            ).exists()
        )


# ---------- Group --------------------------------------------------------------------------------


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.filter(is_public=True)
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


# ---------- Activity -----------------------------------------------------------------------------


class ActivityFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        # For list action, by default, return only published activities.
        if view.action == 'list':
            filter_kwargs = {}

            if 'group_slug' in request.query_params:
                filter_kwargs['group__slug'] = request.query_params['group_slug']

            # By default, return only published activities, unless user explicitly requests for
            # unpublished activities.
            if request.query_params.get('is_published') == 'false':
                filter_kwargs['is_published'] = False
            else:
                filter_kwargs['is_published'] = True

            scheduled = request.query_params.get('scheduled')
            if scheduled == 'upcoming':
                filter_kwargs['scheduled_date__gte'] = datetime.date.today()
            elif scheduled == 'past':
                filter_kwargs['scheduled_date__lt'] = datetime.date.today()
            else:
                logger.warning('Invalid scheduled value: %s', scheduled)

            tag = request.query_params.get('tag')
            if tag:
                filter_kwargs['tags__name'] = tag

            queryset = queryset.filter(**filter_kwargs).order_by('-scheduled_date')
        return queryset


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    filter_backends = [ActivityFilterBackend]

    # NOTE: [DRF] For the sake of readability, we define a coarse-grained permission class in the
    # ViewSet class. Fine-grained permission checks are performed on action methods.
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        self._ensure_can_create(request)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def update(self, request, *args, **kwargs):
        self._ensure_can_update_or_destroy(request, self.get_object())
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self._ensure_can_update_or_destroy(request, self.get_object())
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True, methods=['post'], url_path='tags',
        serializer_class=ActivityTagListSerializer
    )
    def tags(self, request, **kwargs):
        activity = self.get_object()
        self._ensure_can_update_or_destroy(request, activity)
        serializer = self.get_serializer(instance=activity, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def _ensure_can_create(self, request):
        can_create = (request.user and request.user.is_staff)
        if not can_create:
            raise PermissionDenied()

    def _ensure_can_update_or_destroy(self, request, activity):
        can_update_or_destroy = (
            request.user and request.user.is_authenticated and (
                request.user == activity.creator or request.user.is_staff
            )
        )
        if not can_update_or_destroy:
            raise PermissionDenied()


# ---------- Subscriber ---------------------------------------------------------------------------


class SubscriberViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # NOTE: [DRF] Activity subscribers are NOT paginated.
    pagination_class = None

    def get_queryset(self):
        activity = self._lookup_activity()
        return Subscriber.objects.filter(activity=activity)

    def create(self, request, *args, **kwargs):
        self._ensure_can_subscribe(request)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        activity = self._lookup_activity()
        serializer.save(activity=activity, user=self.request.user)

    def update(self, request, *args, **kwargs):
        self._ensure_can_update_or_destroy(request, self.get_object())
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self._ensure_can_update_or_destroy(request, self.get_object())
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='current-user')
    def current_user_subscriber(self, request, **kwargs):
        """
        Checks whether the current authenticated user has subscribed to the activity. Returns the
        subscriber of the current user if he has already subscribed, or returns 204 No-Content if
        the current user is anonymous or has not yet subscribed.
        """
        if request.user and request.user.is_authenticated:
            try:
                subscriber = self.get_queryset().get(user=request.user)
                serializer = self.get_serializer(subscriber)
                return Response(serializer.data)
            except Subscriber.DoesNotExist:
                pass
        # Current user is not authenticated or has not subscribed.
        return Response(status=HTTP_204_NO_CONTENT)

    def _lookup_activity(self):
        activity_pk = self.kwargs.get('activity_pk')
        return Activity.objects.get(pk=activity_pk)

    def _ensure_can_subscribe(self, request):
        activity = self._lookup_activity()
        can_subscribe = (
            request.user and request.user.is_authenticated and
            # Current user has not yet subscribed.
            not self.get_queryset().filter(user=request.user).exists()
        )
        if not can_subscribe:
            raise PermissionDenied()

    def _ensure_can_update_or_destroy(self, request, subscriber):
        can_update_or_destroy = (
            request.user and request.user.is_authenticated and (
                request.user == subscriber.user or
                request.user == subscriber.activity.creator or
                request.user.is_staff
            )
        )
        if not can_update_or_destroy:
            raise PermissionDenied()
