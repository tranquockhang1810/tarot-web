import React, { useEffect, useRef } from "react";
import { Input, Button, message as antdMessage, Image } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { SendOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth/useAuth";
import ChatViewModel from "../viewModel/ChatViewModel";
import { renderFormattedMessage } from "@/utils/helper/MessageFormat";
import useColor from "@/hooks/useColor";
import dayjs from 'dayjs';
import ChatDetailModal from "./detail/ChatDetail";
import { FaCircleInfo } from "react-icons/fa6";
import { showToast } from "@/utils/helper/SendMessage";

const ChatScreen = ({ chatId }: { chatId: string }) => {
  const { localStrings } = useAuth();
  const { brandPrimary, violet, brandPrimaryTap } = useColor();
  const endRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input,
    setInput,
    handleSend,
    loadOlderMessages,
    hasMore,
    chatInfo,
    resultObject,
    isConnected,
    deleteChat,
    deleteLoading,
    detailShow,
    setDetailShow
  } = ChatViewModel(chatId);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div
        className="p-4 text-white text-lg font-semibold shadow flex items-center justify-between flex-row"
        style={{ backgroundColor: violet }}
      >
        <div className="flex items-center">
          <Image
            preview={false}
            src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT! + chatInfo?.topic?.image}`}
            alt="topic"
            width={48}
            height={48}
            className="rounded-full mr-2"
          />
          <div className="flex items-start flex-col ml-2">
            {chatInfo?.topic?.name || "Chat"}
            <span className="text-xs opacity-60">{dayjs(chatInfo?.createdAt).format("DD/MM/YYYY")}</span>
          </div>

        </div>
        <FaCircleInfo size={20} color="white" className="ml-2 cursor-pointer" onClick={() => setDetailShow(true)} />
      </div>

      {/* Chat messages */}
      <div
        id="scrollable-chat"
        className="flex-1 overflow-auto px-4 py-2"
        style={{ height: "calc(100vh - 140px)", scrollbarWidth: "none" }}
      >
        <InfiniteScroll
          dataLength={messages?.length || 0}
          next={loadOlderMessages}
          hasMore={hasMore}
          loader={<p className="text-center text-sm text-gray-500">Loading...</p>}
          scrollableTarget="scrollable-chat"
          inverse={true}
          className="flex flex-col-reverse"
        >
          {messages?.map((item) => {
            const isUser = item.senderType === "user";
            return (
              <div
                key={item._id}
                className={`my-2 px-4 py-2 rounded-2xl max-w-[70%] whitespace-pre-wrap break-words ${isUser ? "self-end" : "self-start"
                  }`}
                style={{
                  backgroundColor: isUser ? violet : brandPrimary,
                  color: "white",
                }}
              >
                {renderFormattedMessage(item.message)}
              </div>
            );
          })}
        </InfiniteScroll>
        <div ref={endRef}></div>
      </div>

      {/* Chat input */}
      {chatInfo?.status && (
        <div className="p-3" style={{ backgroundColor: violet }}>
          <div className="flex gap-2">
            <Input.TextArea
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={localStrings.Chat.EnterMessage}
              autoSize={{ minRows: 1, maxRows: 4 }}
              styles={{
                textarea: {
                  backgroundColor: brandPrimaryTap,
                  borderColor: brandPrimary,
                  color: "white",
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={!isConnected || input.trim() === ""}
              onClick={handleSend}
            />
          </div>
        </div>
      )}

      {detailShow && <ChatDetailModal
        open={detailShow}
        onClose={() => setDetailShow(false)}
        chatInfo={chatInfo}
        deleteChat={deleteChat}
        deleteLoading={deleteLoading}
      />}
    </div>
  );
};

export default ChatScreen;
