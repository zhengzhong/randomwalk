# -*- coding: utf-8 -*-

import logging

from rest_framework import permissions, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


logger = logging.getLogger(__name__)


class NonModelViewSet(viewsets.ViewSet):
    """
    A generic view set which is not bound to a Django model. It provides serializer-related methods
    ported from ``GenericViewSet``. This allows to:
    
    - Properly render HTML in DRF Browsable API.
    - Accept ``serializer_class`` keyword argument in ``@action``.

    Like ``ViewSet``, this base class does not provide any actions by default.
    """
    serializer_class = None

    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
        }

    def get_serializer_class(self):
        assert self.serializer_class is not None, (
            "Class `{}` should either include a `serializer_class` attribute, "
            "or override the `get_serializer_class()` method."
        ).format(self.__class__.__name__)
        return self.serializer_class

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)
