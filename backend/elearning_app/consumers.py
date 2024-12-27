from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Logic to accept connection
        await self.accept()

    async def disconnect(self, close_code):
        # Logic to disconnect
        pass

    async def receive(self, text_data):
        # Logic to receive and send messages
        await self.send(text_data=json.dumps({
            'message': text_data
        }))
        

