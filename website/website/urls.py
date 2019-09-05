#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.urls import include, path
from django.contrib import admin
from django.views.generic import TemplateView


urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html')),
    path('frontend/', include('frontend.urls')),

    path('_admin/', admin.site.urls),
]
