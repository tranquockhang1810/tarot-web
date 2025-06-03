import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { defaultChatRepo } from "@/api/features/chat/ChatRepo";
import { ChatRequestModel, ChatResponseModel } from "@/api/features/chat/models/ChatModel";
import { useAuth } from "@/context/auth/useAuth";
import { useMessage } from "@/context/socket/useMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ChatViewModel = (chatID: string) => {
  const router = useRouter();
  const { localStrings, newChatId } = useAuth();
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const [chatsLoading, setChatsLoading] = useState<boolean>(false);
  const [chatInfo, setChatInfo] = useState<ChatResponseModel | null>(null);
  const { messages, setMessages, sendMessage, isConnected, updateMessageSeen, isNewMessage } = useMessage();
  const [input, setInput] = useState<string>("");
  const [isSendQuestion, setIsSendQuestion] = useState(false);
  const [query, setQuery] = useState<ChatRequestModel>({
    id: chatID,
    page: 1,
    limit: 20,
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [detailShow, setDetailShow] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(chatID, input);
      setInput("");
      setHasMore(true);
      setPage(1);
    }
  };

  const getChatMessages = async (query: ChatRequestModel) => {
    try {
      setChatsLoading(true);
      const res = await defaultChatRepo.getChatMessages(query);
      if (res?.data) {
        setMessages((prev) => {
          if (query?.page === 1) return res.data?.messages || [];
          const newMessages = res.data?.messages?.filter(
            (message) => !prev?.some((existingMessage) => existingMessage._id === message._id)
          );
          return prev ? [...prev, ...newMessages || []] : res.data?.messages;
        });
        setChatInfo(res.data);
        setPage(res?.paging?.page);
        setHasMore(res?.paging?.page < res?.paging?.totalPages);
      } else {
        setMessages([]);
        setPage(0);
        setHasMore(false);
        setChatInfo(null);
        setResultObject({
          type: "error",
          content: localStrings.Chat.GetListMessageFailed + " " + res?.message,
        });
      }
    } catch (error: any) {
      console.error("🚨 Error:", error);
      setResultObject({
        type: "error",
        content: error?.message || localStrings.GLobals.ErrorMessage,
      });
    } finally {
      setChatsLoading(false);
    }
  };

  const loadOlderMessages = () => {
    if (hasMore && !chatsLoading && page > 0) {
      getChatMessages({ ...query, page: page + 1 });
    }
    else return;
  };

  const deleteChat = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await defaultChatRepo.deleteChat({ id });
      if (res?.code === 200) {
        setResultObject({
          type: "success",
          content: localStrings.Chat.DeleteChatSuccess,
        });
        setDetailShow(false);
      } else {
        setResultObject({
          type: "error",
          content: localStrings.Chat.DeleteChatFailed + " " + res?.message,
        });
      }
    } catch (error: any) {
      console.error("🚨 Error:", error);
      setResultObject({
        type: "error",
        content: error?.message || localStrings.GLobals.ErrorMessage,
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    getChatMessages(query);
  }, [query, isNewMessage]);

  useEffect(() => {
    if (chatID) {
      setQuery({ id: chatID, page: 1, limit: 20 });
    }
  }, [chatID]);

  useEffect(() => {
    if (isConnected)
      updateMessageSeen(chatID);
  }, [chatID, isConnected]);

  useEffect(() => {
    if (newChatId && chatInfo && !isSendQuestion) {
      sendMessage(chatID, chatInfo?.question || "");
      setIsSendQuestion(true)
      setHasMore(true);
      setPage(1);
    }
  }, [newChatId, chatID, chatInfo])

  useEffect(() => {
    if (chatInfo && chatInfo?.status && chatInfo?.cards && chatInfo?.cards?.length < 3) {
      router.replace(`/create/${chatID}`);
    }
  }, [chatID, chatInfo])

  return {
    resultObject,
    messages,
    isConnected,
    input,
    setInput,
    handleSend, hasMore,
    chatsLoading,
    loadOlderMessages,
    chatInfo,
    setMessages,
    updateMessageSeen,
    // backAction,
    detailShow, setDetailShow,
    deleteChat, deleteLoading
  };
};

export default ChatViewModel