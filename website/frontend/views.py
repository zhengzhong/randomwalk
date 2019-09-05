# -*- coding: utf-8 -*-

from django.urls import reverse
from django.views.generic import TemplateView


class ReactAppView(TemplateView):
    template_name = 'frontend/react_app.html'

    name = None
    has_css = False

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)

        app_css = None
        if self.has_css:
            app_css = 'frontend/dist/{}.css'.format(self.name)
        app_js = 'frontend/dist/{}.bundle.js'.format(self.name)
        # According to react-router's BrowserRouter documentation: A properly formatted basename
        # should have a leading slash, but no trailing slash.
        app_router_basename = reverse(self.name).rstrip('/')

        context_data.update({
            'app_css': app_css,
            'app_js': app_js,
            'app_router_basename': app_router_basename,
        })
        return context_data
