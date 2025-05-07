"use client"
import { ChatListResponseModel } from "@/api/features/history/models/ChatListModel";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import HistoryView from "../history/view/HistoryView";
import { useMediaQuery } from "react-responsive";
import ChatView from "../chat/view/ChatView";

const ChatAndHistoryView = () => {
  const [listCollapsed, setListCollapsed] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatListResponseModel | undefined>(undefined);
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={400}
        collapsible
        onCollapse={collapsed => setListCollapsed(collapsed)}
        collapsed={listCollapsed}
        breakpoint="md"
        onBreakpoint={collapsed => setListCollapsed(collapsed)}
        collapsedWidth={0}
        // trigger={null}
        className="overflow-y-scroll overflow-x-hidden"
        style={{ scrollbarWidth: "none", height: "100vh" }}
      >
        <HistoryView
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </Sider>

      {(!isMobile || (isMobile && listCollapsed)) && selectedChat &&
        <Layout>
          <Content>
            <ChatView chatId={selectedChat?._id || ""} />
          </Content>
        </Layout>}
    </Layout>
  )
}

export default ChatAndHistoryView