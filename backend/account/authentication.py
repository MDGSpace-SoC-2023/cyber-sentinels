from rest_framework.authentication import TokenAuthentication

from .models import MultiToken


class MultiTokenAuthentication(TokenAuthentication):
    model = MultiToken
