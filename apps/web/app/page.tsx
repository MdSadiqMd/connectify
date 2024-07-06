'use client';
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';

export default function Page() {
  const { sendMessage } = useSocket();
  const [messages, setMessages] = useState('');

  return (
    <div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type something'
        />
        <button
          onClick={() => sendMessage(message)}
        >
          Send
        </button>
      </div>
      <div>
        {
          messages.map((e) => <li>{e}</li>)
        }
      </div>
    </div>
  );
}
