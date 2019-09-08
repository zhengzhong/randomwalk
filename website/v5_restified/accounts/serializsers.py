# -*- coding: utf-8 -*-

from django.contrib.auth.models import User

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(source='profile.avatar_url')
    class Meta:
        model = User
        fields = ['username', 'email', 'avatar_url']
