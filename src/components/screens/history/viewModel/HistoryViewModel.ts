import { ResultObject } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { defaultChatRepo } from "@/src/api/features/chat/ChatRepo";
import { defaultHistoryRepo } from "@/src/api/features/history/HistoryRepo";
import { ChatListRequestModel, ChatListResponseModel } from "@/src/api/features/history/models/ChatListModel";
import { TopicResponseModel } from "@/src/api/features/topic/models/TopicModel";
import { defaultTopicRepo } from "@/src/api/features/topic/TopicRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { useMessage } from "@/src/context/socket/useMessage";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const HistoryViewModel = () => {
  const { isNewMessage, setMessages, setHaveUnreadMessages } = useMessage();
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listChats, setListChats] = useState<ChatListResponseModel[] | undefined>([]);
  const [query, setQuery] = useState<ChatListRequestModel>({ page: 1, limit: 12 });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { localStrings } = useAuth();
  const [topics, setTopics] = useState<TopicResponseModel[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const topicRefs = useRef<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const statusRefs = useRef<string>("");
  const [resetFlag, setResetFlag] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<string>("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatListResponseModel | null>(null)

  const statusList = [
    { label: localStrings.GLobals.Opened, value: "true" },
    { label: localStrings.GLobals.Closed, value: "false" },
  ];

  const getListChats = async (query: ChatListRequestModel) => {
    try {
      setListLoading(true);
      const res = await defaultHistoryRepo.getChatList(query);
      if (res?.code === 200 && res?.data) {
        setListChats((prev) => {
          if (query?.page === 1) return res.data;
          const newChats = res.data.filter(
            (chat) => !prev?.some((existingChat) => existingChat._id === chat._id)
          );
          return prev ? [...prev, ...newChats] : res.data;
        });
        setPage(res?.paging?.page);
        setHasMore(res?.paging?.page < res?.paging?.totalPages);
      } else {
        setListChats([]);
        setPage(0);
        setHasMore(false);
        setResultObject({
          type: 'error',
          title: localStrings.History.GetListChatFailed,
          content: res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setListLoading(false);
    }
  }

  const getMoreChats = () => {
    if (hasMore && !listLoading && page > 0) {
      getListChats({ ...query, page: page + 1 });
    }
    else return;
  }

  const refreshListChats = async () => {
    try {
      setRefreshing(true);
      await getListChats(query);
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setRefreshing(false);
    }
  };

  const getTopicList = async () => {
    try {
      const res = await defaultTopicRepo.getTopics();
      if (res?.code === 200 && res?.data) {
        setTopics(res?.data);
      } else {
        setTopics([]);
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    }
  }

  const handleApply = () => {
    const topic = Object.keys(topicRefs.current).filter((key) => topicRefs.current[key]);
    const status = statusRefs.current === "true" ? true : statusRefs.current === "false" ? false : undefined;
    setListChats([]);
    setQuery({
      page: 1,
      limit: 12,
      topic,
      fromDate: dateFilterType === "all" ? undefined : dayjs(fromDate).format('YYYY-MM-DD'),
      toDate: dateFilterType === "all" ? undefined : dayjs(toDate).format('YYYY-MM-DD'),
      status,
    });
    setShowFilter(false);
  };

  const resetFilter = () => {
    topicRefs.current = {};
    statusRefs.current = "";
    setFromDate(new Date());
    setToDate(new Date());
    setQuery({ page: 1, limit: 12 });
    setShowFilter(false);
    setResetFlag(prev => !prev);
  };

  const deleteChat = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await defaultChatRepo.deleteChat({ id });
      if (res?.code === 200) {
        setResultObject({
          type: "success",
          title: localStrings.Chat.DeleteChatSuccess,
        });
        getListChats(query)
      } else {
        setResultObject({
          type: "error",
          title: localStrings.Chat.DeleteChatFailed,
          content: res?.message,
        });
      }
    } catch (error: any) {
      console.error("🚨 Error:", error);
      setResultObject({
        type: "error",
        title: localStrings.GLobals.ErrorMessage,
        content: error?.message,
      })
    } finally {
      setDeleteLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setMessages([]);
      setPage(0);
      getListChats(query);
    }, [query, isNewMessage])
  )

  useEffect(() => {
    getTopicList();
  }, [])

  useEffect(() => {
    if (listChats?.some((chat) => chat.latestMessage?.status === false)) {
      setHaveUnreadMessages(true);
    } else {
      setHaveUnreadMessages(false);
    }
  }, [listChats])

  return {
    resultObject,
    listLoading,
    listChats,
    query,
    setQuery,
    page,
    hasMore,
    getListChats,
    getMoreChats,
    topics,
    showFilter,
    setShowFilter,
    topicRefs,
    handleApply,
    refreshListChats,
    refreshing,
    fromDate, setFromDate,
    toDate, setToDate,
    openFrom, setOpenFrom,
    openTo, setOpenTo,
    statusRefs,
    statusList,
    resetFilter,
    resetFlag,
    dateFilterType, setDateFilterType,
    deleteLoading,
    deleteChat,
    selectedChat, setSelectedChat
  }
}

export default HistoryViewModel