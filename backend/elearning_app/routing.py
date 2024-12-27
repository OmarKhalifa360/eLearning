from django.urls import re_path # type: ignore
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?p<room_name>)/w+/$', consumers.ChatConsumer.as_asgi())
]