'use client';
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div>
      <div>
        <h1>All Messages</h1>
      </div>
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
    </div>
  );
}
