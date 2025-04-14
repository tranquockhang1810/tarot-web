import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import { MessageContextType } from "./MessageContextType";
import { MessageResponseModel } from "@/src/api/features/history/models/MessageModel";
import messaging from '@react-native-firebase/messaging';

// ⚡ URL socket server
const SOCKET_URL = process.env.EXPO_PUBLIC_SERVER_ENDPOINT;

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
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      const fcmToken = await getFcmToken();
      if (!fcmToken) return;

      const newSocket = io(SOCKET_URL, { transports: ["websocket"] });

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket");
        setIsConnected(true);
        newSocket.emit("registerUser", { userId: user?._id, fcmToken });
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
        Alert.alert("Error", error.message);
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
        Alert.alert("Error", "Not connected to chat server.");
        return;
      }
      socket.emit("sendMessage", { userID: user?._id, chatID, message });
    },
    [socket, isConnected, user?._id]
  );

  const updateMessageSeen = useCallback(
    (chatId: string) => {
      if (!socket || !isConnected) {
        Alert.alert("Error", "Not connected to chat server.");
        return;
      }
      socket.emit("seenMessages", { chatId });
    },
    [socket, isConnected]
  );

  const seenNotification = useCallback((id?: string) => {
    if (!socket || !isConnected) {
      Alert.alert("Error", "Not connected to chat server.");
      return;
    }
    socket.emit("seenNotification", { userId: id ? undefined : user?._id, id });
  }, [socket, isConnected, user])

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  };

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert("Thông báo", "Bạn cần bật quyền thông báo để nhận tin nhắn.");
      return false;
    }

    // Android 13+ cần thêm POST_NOTIFICATIONS
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Thông báo", "Bạn cần cho phép thông báo để nhận tin nhắn.");
        return false;
      }
    }

    return true;
  };

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
