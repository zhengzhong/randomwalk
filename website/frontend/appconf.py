# -*- coding: utf-8 -*-

from django.conf import settings


class _AppSettings:
    setting_name = 'FRONTEND'

    defaults = {
        # The URL path prefix (with a trailing slash) on which ``frontend.urls`` are mounted.
        'URL_PATH_PREFIX': 'frontend/',
    }

    def __init__(self):
        self._populated = None

    def __getattr__(self, name):
        if name not in self.defaults:
            raise AttributeError('Attribute {} not found.'.format(name))
        self._populate_settings()
        return self._populated[name]

    def _populate_settings(self, force=False):
        if not self._populated or force:
            populated = self.defaults.copy()
            populated.update(getattr(settings, self.setting_name, {}))
            self._populated = populated


app_settings = _AppSettings()
