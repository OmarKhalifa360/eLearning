import React, { useState, useEffect } from 'react';

function Chat({ roomName }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let socket;

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className='chat-input'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message...'
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;