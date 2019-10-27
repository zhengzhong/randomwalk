# -*- coding: utf-8 -*-

import logging

from rest_framework.permissions import BasePermission, SAFE_METHODS


logger = logging.getLogger(__name__)


class IsStaffUserOrReadOnly(BasePermission):
    """
    Staff user has full access, whilst all other users, anonymous or authenticated, can only read.
    This is a conservative permission. It's suitable for use as ``DEFAULT_PERMISSION_CLASSES``.

    NOTE: [DRF] This permission class does NOT call ``view.get_queryset()`` method. So it is safe
    to be used with a ViewSet that requires URL kwargs.

    When building Open API schema, for each action supported by a ViewSet, DRF needs to check the
    permission. During that moment, the ViewSet does not have its ``kwargs`` attribute bound from
    a URL path. If the permission class needs to call the ViewSet's ``get_queryset()`` method
    (which in turn makes use of ``self.kwargs``), this could cause an error.

    One counterexample is ``DjangoModelPermissions`` (and its subclass).
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        # Unsafe HTTP methods are restricted to staff user only.
        return bool(request.user and request.user.is_staff)


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False

    def has_object_permission(self, request, view, obj):
        return False
