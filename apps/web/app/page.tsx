'use client';
import { useState, useRef } from 'react';
import { useSocket } from '../context/SocketProvider';

export default function Page() {
  const { sendMessage } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim()) {
        sendMessage(message);
        setMessages((prevMessages) => [...prevMessages, message]);
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <div>
        <input
          ref={inputRef}
          placeholder='Type something'
        />
        <button onClick={handleSendMessage}>
          Send
        </button>
      </div>
      <div>
        <ul>
          {
            messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}
