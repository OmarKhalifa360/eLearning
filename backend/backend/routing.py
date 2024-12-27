from channels.auth import AuthMiddlewareStack # type: ignore
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
import elearning_app.routing # type: ignore


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            elearning_app.routing.websocket_urlpatterns
        )
    ),
})