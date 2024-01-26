from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from account.models import MultiToken


class MultiTokenAuthentication(TokenAuthentication):
    model = MultiToken

    def authenticate_credentials(self, key):
        try:
            token = self.model.objects.select_related("user").get(key=key)
        except self.model.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        if not token.user.is_active:
            raise AuthenticationFailed("User inactive or deleted")

        return (token.user, token)
