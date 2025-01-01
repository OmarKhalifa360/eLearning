from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
# from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
import jwt
from jwt import InvalidTokenError

class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware that attaches the user to the scope using JWT tokens.
    """

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        query_string = scope['query_string'].decode()
        query_params = dict(qc.split('=') for qc in query_string.split('&') if '=' in qc)
        token_key = query_params.get('token')
        if b'authorization' in headers:
            token_name, token_key = headers[b'authorization'].decode().split()
            try:
                UntypedToken(token_key)
            except (InvalidTokenError, jwt.DecodeError):
                scope['user'] = AnonymousUser()
            else:
                decoded_data = jwt.decode(
                    token_key, settings.SECRET_KEY, algorithms=["HS256"])
                scope['user'] = await self.get_user(decoded_data['user_id'])
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()