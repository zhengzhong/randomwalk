# -*- coding: utf-8 -*-

from rest_framework import serializers

from v5_restified.accounts.serializsers import UserSerializer

from v5.activities.models import Group, Activity


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

    class Meta:
        model = Activity
        read_only_fields = ['pk', 'group', 'creator', 'create_date', 'update_date', 'tag_list']
        fields = read_only_fields + [
            'title', 'description', 'thumbnail', 'scheduled_date', 'closing_date', 'address',
            'headcount', 'subscription_notice', 'accept_online_payment',
        ]
        # Specify write-only fields. See: https://stackoverflow.com/a/36771366/808898
        extra_kwargs = {
            'subscription_notice': {'write_only': True},
            'accept_online_payment': {'write_only': True},
        }

    def get_tag_list(self, obj):
        return [tag.name for tag in obj.tags.all()]
