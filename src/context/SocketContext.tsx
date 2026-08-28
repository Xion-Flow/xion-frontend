import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Connect to Socket.io server (proxied by Vite or direct fallback)
    const serverUrl = window.location.port === '3000' ? 'http://localhost:5000' : window.location.origin;

    const socketInstance = io(serverUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ WebSockets connected live to backend server.');
      setIsConnected(true);

      // Re-join active project room if present
      if (activeProjectIdRef.current) {
        socketInstance.emit('join:project', { projectId: activeProjectIdRef.current });
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('⚡ WebSockets disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('⚡ WebSockets connection error:', err.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user]);

  const joinProject = (projectId: string) => {
    activeProjectIdRef.current = projectId;
    if (socket && socket.connected && projectId) {
      socket.emit('join:project', { projectId });
    }
  };

  const leaveProject = (projectId: string) => {
    if (activeProjectIdRef.current === projectId) {
      activeProjectIdRef.current = null;
    }
    if (socket && socket.connected && projectId) {
      socket.emit('leave:project', { projectId });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinProject, leaveProject }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
