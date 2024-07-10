'use client';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: string[];
}

const socketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(socketContext);
    if (!state) {
        throw new Error(`State is undefined`);
    }
    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | undefined>();
    const [messages, setMessages] = useState<string[]>([]); // Initialize as an empty array

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
        console.log('Send Message: ', msg);
        if (socket) {
            socket.emit('event:message', { message: msg });
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        console.log(`Message from server: ${msg}`);
        const { message } = JSON.parse(msg) as { message: string; };
        setMessages(prev => [...prev, message]);
    }, []);

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        _socket.on('message', onMessageReceived);
        setSocket(_socket);
        return () => {
            _socket.disconnect();
            _socket.off('message', onMessageReceived);
            setSocket(undefined);
        };
    }, [onMessageReceived]);

    return (
        <socketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </socketContext.Provider>
    );
};