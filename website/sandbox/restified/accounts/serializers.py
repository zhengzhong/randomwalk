# -*- coding: utf-8 -*-

import logging

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework import serializers

from v5.accounts.models import Profile, UserBadge, Notification
from v5.accounts.utils import generate_jwt_token


logger = logging.getLogger(__name__)


# ---------- User & Profile -----------------------------------------------------------------------


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='profile.display_name', read_only=True)
    avatar_url = serializers.CharField(source='profile.avatar_url', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'display_name', 'avatar_url']


class UserBadgeSerializer(serializers.ModelSerializer):
    """
    This is a nested serializer used by ``ProfileSerializer``.
    """
    # NOTE: [DRF] ``UserBadge.image`` is a property attribute but not a model field, so DRF would
    # not know the type of the field by introspecting the model. So We need to declare the field
    # type explicitly.
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = UserBadge
        fields = ('title', 'image', 'earn_date')


class ProfileSerializer(serializers.ModelSerializer):
    """
    ``Profile`` is a superset of ``User``, including extra fields about the user.
    NOTE: This serializer does not include sensitive data of the user.
    """
    badge_list = UserBadgeSerializer(source='user.badge_set', many=True)

    class Meta:
        model = Profile
        fields = [
            'username', 'display_name', 'avatar_url', 'biography',
            'is_email_confirmed', 'is_phone_number_verified', 'credit_rating', 'karma', 'coins',
            'num_following', 'num_followers', 'badge_list',
        ]
        read_only_fields = fields


class ProfileWithSensitiveDataSerializer(ProfileSerializer):
    """
    This serializer extends ``ProfileSerializer`` by including sensitive data of the user.
    It should only be used with current authenticatd user profile.
    """
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)

    class Meta(ProfileSerializer.Meta):
        fields = ProfileSerializer.Meta.fields + [
            # Extra fields containing sensitive data...
            'real_name', 'email', 'phone_number', 'preferred_language', 'num_unread_notifications',
            'is_staff',
        ]
        read_only_fields = [field for field in fields if field not in (
            # Editable fields...
            'display_name', 'real_name', 'phone_number', 'biography', 'preferred_language',
        )]

    def validate_display_name(self, value):
        if self.instance is None:
            raise serializers.ValidationError('Profile to update is not provided.')
        value = value.strip()
        if Profile.objects.exclude(pk=self.instance.pk).filter(display_name=value).exists():
            raise serializers.ValidationError('This display name is already taken.')
        return value

    def validate_preferred_language(self, value):
        # Get valid values for user preferred language. Note that empty value is allowed.
        valid_values = ['']
        supported_languages = getattr(settings, 'V5_SUPPORTED_LANGUAGES', None)
        if supported_languages:
            valid_values.extend([lang for lang, __ in supported_languages])
        # Check the value.
        if value not in valid_values:
            raise serializers.ValidationError('Invalid language code: {}'.format(value))
        return value


class ProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']


class CurrentUserSerializer(serializers.Serializer):
    """
    A non-model serializer for the current anonymous or authenticated user.
    """
    is_authenticated = serializers.BooleanField(read_only=True)
    profile = ProfileWithSensitiveDataSerializer(read_only=True)


# ---------- Notification -------------------------------------------------------------------------


class NotificationSerializer(serializers.ModelSerializer):
    # NOTE: [DRF] Specify serializers for related fields and calculated fields. As a convention,
    # ``SerializerMethodField`` should only be used with simple JSON-serializable fields.
    sender = UserSerializer()
    receiver = UserSerializer()
    title = serializers.SerializerMethodField()
    related_model = serializers.SerializerMethodField()
    related_object_pk = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            'pk', 'sender', 'receiver', 'title', 'content', 'process_type', 'process_result',
            'collapse_key', 'related_model', 'related_object_pk', 'is_unread', 'is_delivered',
            'is_deleted', 'create_date',
        )

    def get_title(self, obj):
        return obj.title_text

    def get_related_model(self, obj):
        if obj.related_object:
            return obj.related_content_type.model
        return None

    def get_related_object_pk(self, obj):
        if obj.related_object:
            return obj.related_object_pk
        return None


# ---------- User authentication ------------------------------------------------------------------


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, allow_blank=False)
    password = serializers.CharField(write_only=True, allow_blank=False, style={'input_type': 'password'})
    use_jwt = serializers.BooleanField(write_only=True, default=False)
    profile = ProfileSerializer(read_only=True)
    jwt_token = serializers.CharField(read_only=True, allow_blank=False)

    def validate(self, data):
        """
        Validates user credentials.
        """
        authenticated_user = authenticate(username=data['username'], password=data['password'])
        if authenticated_user is None:
            raise serializers.ValidationError('Invalid username or password')
        # Save the authenticated user as an attribute.
        self._authenticated_user = authenticated_user
        return data

    @property
    def authenticated_user(self):
        user = getattr(self, '_authenticated_user', None)
        assert user is not None, 'User must be authenticated before generating JWT token.'
        return user

    def login(self, request):
        user = self.authenticated_user
        if self.validated_data['use_jwt']:
            jwt_token, __ = generate_jwt_token(user)
        else:
            # NOTE: [DRF] Serializer can access the current request via its context.
            # See: https://www.django-rest-framework.org/api-guide/serializers/#including-extra-context
            login(request, user)
            jwt_token = ''
        self.instance = {
            'profile': user.profile,
            'jwt_token': jwt_token,
        }


class LogoutSerializer(serializers.Serializer):
    is_success = serializers.BooleanField(read_only=True)

    def logout(self, request):
        logout(request)
        self.instance = {
            'is_success': True
        }
