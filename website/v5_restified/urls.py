# -*- coding: utf-8 -*-

from django.urls import include, path
from django.views.generic import TemplateView

from rest_framework.schemas import get_schema_view


urlpatterns = [
    path('v3/activities/', include('v5_restified.activities.urls')),

    path('v3/_meta/auth/', include('rest_framework.urls')),

    # OpenAPI and Swagger.
    path('v3/_meta/openapi/', get_schema_view(
        title='V5 API v3',
        version='3.0.0'
    ), name='openapi-schema'),
    path('v3/_meta/swagger/', TemplateView.as_view(
        template_name='swagger.html',
        extra_context={'schema_url': 'openapi-schema'}
    ), name='swagger'),
]
