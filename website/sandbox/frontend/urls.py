# -*- coding: utf-8 -*-

from django.urls import path, re_path
from django.views.generic import TemplateView

from .views import ReactAppView


urlpatterns = [
    path('styles/', TemplateView.as_view(template_name='frontend/styles/index.html')),
    re_path(r'^(?P<app_name>[\w\-]+)/.*$', ReactAppView.as_view()),
]
