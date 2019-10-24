=====================================
Django REST Framework Common Patterns
=====================================

Conventions
===========

- Use absolute URL for FileField and ImageField.
- Avoid creating serializer instance directly in ViewSet. Calling ``get_serializer()`` method will
  make sure context (containing the current request) is properly prepared.
- Avoid using SerializerMethodField with nested ModelSerializer subclass.
- Always specify ``basename`` when regstering a ViewSet in Router. So we are not forced to declare
  ``queryset`` class attribute on a ViewSet class.
- When using mixins in ViewSet class, follow the CRUDL order.

Restrict some actions on a ViewSet
==================================

Examples:

- ``ProfileViewSet`` does not support ``list``, ``create`` and ``destroy`` actions.


Accept filtering parameters in list action
==========================================


Model-less API View
===================

An API view which does not return any Django models.


Different serializers for listing, retrieving, creating and updating
====================================================================

Different serializers for request and response
==============================================


Extra actions and URLs on a ViewSet
===================================


Nested fields in serializer
===========================

A user may gain a list of badges. From a ``Profile`` object, to get the badges he owns:

.. code-block::python

    profile.user.badge_set

Method 1: Use typed field with source

.. code-block::python

    class ProfileSerializer(serializers.ModelSerializer):
        # Use ``UserBadgeSerializer`` to serialize a related ``UserBadge`` queryset.
        # Use ``source`` to specify how we obtain such a queryset from a ``Profile`` object.
        badge_list = UserBadgeSerializer(source='user.badge_set', many=True)

        class Meta:
            model = Profile
            fields = [..., 'badge_list', ...]  # Make sure to include the ``badge_list`` field.


Method 2: Use SerializerMethodField

.. code-block::python

    class ProfileSerializer(serializers.ModelSerializer):
        # This field will be mapped to the serializer method ``get_badge_list()``.
        # The serializer method needs to return a JSON-serializable value.
        badge_list = serializers.SerializerMethodField()

        class Meta:
            model = Profile
            fields = [..., 'badge_list', ...]  # Make sure to include the ``badge_list`` field.

        def get_badge_list(self, obj):
            # Build a queryset of the related ``UserBadge`` objects.
            queryset = UserBadge.objects.filter(user=obj.user)

            # Serialize the queryset using an appropriate serializer.
            # Note that we also pass in the context argument, so that the nested serializer will be
            # able to construct an absolute URL for the badge image.
            serializer = UserBadgeSerializer(queryset, many=True, context=self.context)
            return serializer.data


Disable some actions in ModelViewSet
====================================

Sub-resources for relations
===========================

Access request in serializer
============================

ModelViewSet for related objects
================================

We want to create a Notification resource which is always bound to a given User object.

Examples:

- ``NotificationViewSet`` requires the ``username`` URL argument to filter on a given user.


Handle file upload
==================

`DRF website <https://www.django-rest-framework.org/api-guide/fields/#parsers-and-file-uploads>`_
states that ``FileField`` and ``ImageField`` are only suitable for use with ``MultiPartParser`` or
``FileUploadParser``. Most parsers, such as e.g. JSON don't support file uploads.

See also:

- https://stackoverflow.com/q/20473572
- https://www.trell.se/blog/file-uploads-json-apis-django-rest-framework/


Return generic JSON for errors
==============================

See: https://www.django-rest-framework.org/api-guide/exceptions/

We may need to provide a custom exception handler which serializes all kinds of exceptions to a
standard JSON format.


References
==========

- https://medium.com/profil-software-blog/10-things-you-need-to-know-to-effectively-use-django-rest-framework-7db7728910e0
- https://restfulapi.net/resource-naming/
