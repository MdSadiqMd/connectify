'use client';
import { useRef } from 'react';
import { useSocket } from '../context/SocketProvider';

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputRef.current) {
      const message = inputRef.current.value;
      if (message.trim()) {
        sendMessage(message);
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <div>
        <input
          ref={inputRef}
          placeholder='Type Message...'
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