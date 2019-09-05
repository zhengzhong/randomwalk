# -*- coding: utf-8 -*-

from django.views.generic import TemplateView


class ReactAppView(TemplateView):
    def get_template_names(self):
        app_name = self.kwargs['app_name']
        return [
            'frontend/{}.html'.format(app_name),
            'frontend/react_app.html',
        ]

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        context_data['app_name'] = kwargs['app_name']
        return context_data
