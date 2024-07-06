'use client';
import React, { useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISockectContext {
    sendMessage: (msg: string) => any;
}

const socketContext = React.createContext<ISockectContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const sendMessage: ISockectContext["sendMessage"] = useCallback((msg) => {
        console.log('Send Message: ', msg);
    }, []);

    useEffect(() => {
        const _socket = io("http://localhost:8000");

        return () => {
            _socket.disconnect();
        };
    }, []);

    return (
        <socketContext.Provider value={{ sendMessage }}>
            {children}
        </socketContext.Provider>
    );
};