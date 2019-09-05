# -*- coding: utf-8 -*-

from django.urls import include, path, re_path
from django.views.generic import TemplateView


urlpatterns = [
    path('styles/', TemplateView.as_view(template_name='frontend/styles/index.html')),
]
