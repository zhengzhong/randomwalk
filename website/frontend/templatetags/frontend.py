# -*- coding: utf-8 -*-

from django import template
from django.conf import settings
from django.templatetags.static import static

from ..appconf import app_settings


register = template.Library()


@register.simple_tag
def frontend_router_basename(mount_path):
    return '/{}{}'.format(app_settings.URL_PATH_PREFIX, mount_path.rstrip('/'))


@register.simple_tag
def frontend_js(name):
    path = 'frontend/dist/{}.bundle.js'.format(name)
    return static(path)


@register.simple_tag
def frontend_css(name):
    path = 'frontend/dist/{}.css'.format(name)
    return static(path)
