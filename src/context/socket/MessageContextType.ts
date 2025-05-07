import { MessageResponseModel } from "@/api/features/history/models/MessageModel";

export interface MessageContextType {
  messages: MessageResponseModel[] | undefined;
  setMessages: React.Dispatch<React.SetStateAction<MessageResponseModel[] | undefined>>;
  sendMessage: (chatID: string, message: string) => void;
  isConnected: boolean;
  updateMessageSeen: (chatId: string) => void;
  isNewMessage: boolean;
  haveUnreadMessages: boolean;
  setHaveUnreadMessages: React.Dispatch<React.SetStateAction<boolean>>;
  seenNotification: (id?: string) => void;
  unreadNotification: number;
  checkUnreadNotification: () => void;
  seenDoneTrigger: number;
}