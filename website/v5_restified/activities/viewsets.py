# -*- coding: utf-8 -*-

import datetime
import logging

from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, AllowAny
from rest_framework.response import Response

from v5.activities.models import Group, GroupMember, Activity

from .serializers import GroupSerializer, ActivitySerializer


logger = logging.getLogger(__name__)


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False

    def has_object_permission(self, request, view, obj):
        return False


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


class CanUpdateActivity(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        activity = obj
        return (
            request.user.is_superuser
            or activity.creator == request.user
            or GroupMember.objects.filter(
                group=activity.group,
                user=request.user,
                role__in=(GroupMember.ROLE_ADMINISTRATOR, GroupMember.ROLE_MODERATOR),
                is_approved=True
            ).exists()
        )


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.filter(is_public=True)
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        if self.action == 'create':
            group = self._get_group()
            return [IsApprovedGroupMember(group)]
        if self.action in ('update', 'partial_update'):
            return [CanUpdateActivity()]
        # All other actions, including ``destroy``, are disallowed.
        return [DenyAll()]

    def get_queryset(self):
        group = self._get_group()
        if not group:
            return self.queryset.none()

        queryset = self.queryset.filter(group=group)
        if self.action == 'list':
            return queryset.filter(is_published=True)
        return queryset

    def perform_create(self, serializer):
        group = self._get_group()
        serializer.save(group=group, creator=self.request.user)

    def _get_group(self):
        group_slug = self.kwargs.get('group_slug')
        if not group_slug:
            return None
        return Group.objects.get(slug=group_slug)


class UpcomingActivityViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    A list-only view set to list upcoming activities.

    NOTE: DRF has an issue generating unique OpenAPI operationId for multiple view sets for the
    same model. See: https://github.com/encode/django-rest-framework/issues/6844
    """
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

    def get_queryset(self):
        today = datetime.date.today()
        return self.queryset.filter(
            is_published=True,
            scheduled_date__gte=today
        ).order_by('scheduled_date')
