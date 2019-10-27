# -*- coding: utf-8 -*-

import logging

from rest_framework import serializers

from sandbox.restified.accounts.serializers import UserSerializer

from v5.activities.models import Group, Activity, Subscriber
from v5.tagging.models import TaggedItem


logger = logging.getLogger(__name__)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            'pk', 'slug', 'name', 'slogan', 'image', 'description', 'is_public', 'create_date',
            'activeness',
        ]


class ActivitySerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)
    creator = UserSerializer(read_only=True)
    tag_list = serializers.SerializerMethodField()

    # NOTE: [DRF] Model's property attribute is read-only by default. To make it writable, we need
    # to declare a field for it explicitly. This field is required, so it should not have a default
    # value (because setting a ``default`` implies that the field is not required). Instead, we
    # provide an ``initial`` value to pre-populate the value of the HTML form field in DRF's
    # Browsable API.
    custom_subscription_fields = serializers.JSONField(initial=[])

    # NOTE: [DRF] The group slug is required only for create action. Otherwise, it's ignored.
    # Because it is a create-only (write-once) field, there are several ways to implement it.
    # The simplest way is to raise a validation error on create/update. Because it is a
    # non-required field, we validate it at object-level instead of field-level. The downside of
    # this is that, if invalid, it will be reported in ``non_field_errors``.
    #
    # See: http://blog.qax.io/write-once-fields-with-django-rest-framework/
    group_slug = serializers.SlugField(write_only=True, required=False)

    class Meta:
        model = Activity
        fields = [
            'pk', 'group', 'title', 'description', 'thumbnail', 'scheduled_date', 'closing_date',
            'address', 'headcount', 'max_headcount', 'base_price', 'custom_subscription_fields',
            'subscription_notice', 'accept_online_payment', 'is_published',
            'creator', 'create_date', 'update_date', 'tag_list', 'group_slug',
        ]
        read_only_fields = [
            'group', 'thumbnail', 'creator', 'create_date', 'update_date', 'tag_list',
        ]
        # NOTE: [DRF] Specify write-only fields. See: https://stackoverflow.com/a/36771366/808898
        extra_kwargs = {
            # 'subscription_notice': {'write_only': True},
        }

    def get_extra_kwargs(self):
        # NOTE: [DRF] This method can be used to further customize some non-declared fields.
        # This method returns a dict mapping field names to a dict of additional keyword arguments.
        # See: https://stackoverflow.com/a/37487134
        extra_kwargs = super().get_extra_kwargs()
        return extra_kwargs

    def get_tag_list(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def validate(self, data):
        if self.instance is None:
            # This is a create action so we validate the ``group_slug`` field.
            group_slug = data.get('group_slug')
            if not group_slug:
                raise serializers.ValidationError('Group slug field is required.')
            if not Group.objects.filter(slug=group_slug).exists():
                raise serializers.ValidationError('Group {} does not exist.'.format(group_slug))
        else:
            # This is not a create action. We remove ``group_slug`` field if it's present, and do
            # not care about its value at all.
            if 'group_slug' in data:
                data.pop('group_slug')
        return data

    def create(self, validated_data):
        group_slug = validated_data.pop('group_slug')
        validated_data['group'] = Group.objects.get(slug=group_slug)
        return super().create(validated_data)


class ActivityTagListSerializer(serializers.ModelSerializer):
    """
    This serializer provides partial update of activity tags.
    """
    ACTION_CREATE = 'create'
    ACTION_DELETE = 'delete'
    ACTION_CHOICES = (ACTION_CREATE, ACTION_DELETE)

    action = serializers.ChoiceField(write_only=True, choices=ACTION_CHOICES)
    tag = serializers.CharField(write_only=True, allow_blank=False)
    tag_list = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['action', 'tag', 'tag_list']

    def get_tag_list(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def create(self, validated_data):
        raise NotImplementedError('This serializer does not support create.')

    def update(self, instance, validated_data):
        action = validated_data['action']
        tag = validated_data['tag']
        if action == self.ACTION_CREATE:
            TaggedItem.objects.create_tags(instance, [tag])
        elif action == self.ACTION_DELETE:
            TaggedItem.objects.delete_tags(instance, [tag])
        else:
            raise serializers.ValidationError('Unsupported action {}.'.format(action))
        return instance


class SubscriberSerializer(serializers.ModelSerializer):
    activity_pk = serializers.IntegerField(read_only=True, source='activity.pk')
    user = UserSerializer(read_only=True)
    custom_fields = serializers.JSONField(initial=[])

    class Meta:
        model = Subscriber
        fields = [
            'pk', 'activity_pk', 'user', 'real_name', 'email', 'phone_number',
            'is_phone_number_verified', 'message', 'custom_fields',
            'calculated_price', 'payment_key', 'is_paid', 'status', 'subscribe_date',
        ]
        read_only_fields = ['user', 'calculated_price', 'status', 'subscribe_date']
        # NOTE: [DRF] Specify write-only fields. See: https://stackoverflow.com/a/36771366/808898
        extra_kwargs = {
            #'real_name': {'write_only': True},
            #'phone_number': {'write_only': True},
            #'email': {'write_only': True},
        }
