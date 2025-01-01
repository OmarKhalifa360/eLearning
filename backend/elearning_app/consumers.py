from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
from asgiref.sync import database_sync_to_async
from .models import ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Notify group that a user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'{self.scope["user"].username} has joined the chat',
                'username': 'System'
            }
        )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # Notify group that a user has left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'{self.scope["user"].username} has left the chat',
                'username': 'System'
            }
        )

    async def receive(self, text_data):
        message = content.get('message', '')
        user = self.scope['user']
        room_name = self.room_name
        if message:
            await database_sync_to_async(ChatMessage.objects.create)(
                room_name=room_name, user=user, message=message
            )
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "chat_message", 
                 "message": message, 
                 "username": user.username},
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))
        

