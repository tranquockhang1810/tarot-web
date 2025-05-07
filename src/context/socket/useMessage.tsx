"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import { MessageContextType } from "./MessageContextType";
import { MessageResponseModel } from "@/api/features/history/models/MessageModel";
import { message as AntdMessage } from "antd";

// ⚡ URL socket server
const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

// Tạo Context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageResponseModel[] | undefined>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [haveUnreadMessages, setHaveUnreadMessages] = useState(false);
  const [unreadNotification, setUnreadNotification] = useState<number>(0);
  const [seenDoneTrigger, setSeenDoneTrigger] = useState(0);

  useEffect(() => {
    if (!user?._id) return;
    const connectSocket = async () => {

      const newSocket = io(SOCKET_URL, { transports: ["websocket"] });

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket");
        setIsConnected(true);
        newSocket.emit("registerUser", { userId: user?._id });
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from socket");
        setIsConnected(false);
      });

      newSocket.on("newMessage", (message: MessageResponseModel) => {
        setIsNewMessage((prev) => !prev);
        setMessages((prev) => [message, ...prev || []]);
      });

      newSocket.on("replaceMessage", ({ oldId, newMessage }) => {
        setIsNewMessage((prev) => !prev);
        setHaveUnreadMessages(true);
        setMessages((prev) =>
          prev && prev.map((msg) => (msg._id === oldId ? newMessage : msg))
        );
      });

      newSocket.on("errorMessage", (error: { message: string }) => {
        console.error("🚨 Socket Error:", error);
        AntdMessage.error(`Socket Error: ${error.message}`);
      });

      newSocket.on("unreadNotification", (count: number) => {
        console.log("Unread notifications:", count);
        setUnreadNotification(count);
      });

      newSocket.on("seenNotificationDone", () => {
        setSeenDoneTrigger((prev) => prev + 1);
      });

      setSocket(newSocket);
    }

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user?._id]);

  const sendMessage = useCallback(
    (chatID: string, message: string) => {
      if (!socket || !isConnected) {
        AntdMessage.error("Not connected to chat server.");
        return;
      }
      socket.emit("sendMessage", { userID: user?._id, chatID, message });
    },
    [socket, isConnected, user?._id]
  );

  const updateMessageSeen = useCallback(
    (chatId: string) => {
      if (!socket || !isConnected) {
        console.error("Not connected to chat server.");
        AntdMessage.error("Not connected to chat server.");
        return;
      }
      socket.emit("seenMessages", { chatId });
    },
    [socket, isConnected]
  );

  const seenNotification = useCallback((id?: string) => {
    if (!socket || !isConnected) {
      AntdMessage.error("Not connected to chat server.");
      return;
    }
    socket.emit("seenNotification", { userId: id ? undefined : user?._id, id });
  }, [socket, isConnected, user])

  const checkUnreadNotification = () => {
    socket?.emit("checkUnreadNotification", { userId: user?._id });
  };

  useEffect(() => {
    if (socket && isConnected) {
      checkUnreadNotification();
    }
  }, [socket, isConnected, seenDoneTrigger, user]);

  return (
    <MessageContext.Provider
      value={{
        messages, setMessages,
        sendMessage,
        isConnected,
        updateMessageSeen,
        isNewMessage,
        haveUnreadMessages,
        setHaveUnreadMessages,
        seenNotification,
        checkUnreadNotification,
        unreadNotification,
        seenDoneTrigger
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Hook để dùng MessageContext
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
