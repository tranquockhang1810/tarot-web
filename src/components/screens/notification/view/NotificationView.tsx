"use client"
import InfiniteScroll from "react-infinite-scroll-component"
import NotificationViewModel from "../viewModel/NotificationViewModel";
import useColor from "@/hooks/useColor";
import { useAuth } from "@/context/auth/useAuth";
import { Spin, List } from "antd";
import { FaCheckDouble } from "react-icons/fa6";
import dayjs from "dayjs";

const NotificationView = () => {
  const { notifications, seenNoti, loadMoreNotifications, hasMoreNotifications } = NotificationViewModel();
  const { localStrings } = useAuth();
  const { brandPrimaryTap, redError } = useColor();
  return (
    <div className="flex flex-col max-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-transparent">
        <h1 className="text-2xl font-bold">{localStrings?.Tabbar?.Notification}</h1>
        <button
          onClick={() => seenNoti()}
          className="text-white hover:cursor-pointer"
        >
          <FaCheckDouble style={{ fontSize: 24 }} />
        </button>
      </div>

      {/* Notification List */}
      <div id="scrollableDiv" className="flex-1 px-4 overflow-auto"
        style={{
          scrollbarWidth: "none"
        }}
      >
        <InfiniteScroll
          dataLength={notifications.length}
          next={loadMoreNotifications}
          hasMore={hasMoreNotifications}
          loader={
            <div className="flex justify-center my-4">
              <Spin />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                onClick={() => !item?.status && seenNoti(item._id)}
                className="cursor-pointer"
                style={{
                  backgroundColor: brandPrimaryTap,
                  borderRadius: 10,
                  marginBottom: 20,
                  opacity: item.status ? 0.6 : 1,
                  padding: 20,
                }}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                        {item.title}
                      </span>
                      {!item.status && (
                        <span
                          className="rounded-full"
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: redError,
                            display: "inline-block",
                          }}
                        />
                      )}
                    </div>
                  }
                  description={
                    <div style={{ color: "white" }} className="flex flex-row justify-between">
                      <span>{item.description}</span>
                      <span className="text-xs mt-1">{dayjs(item?.createdAt).format("HH:mm DD/MM/YYYY")}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default NotificationView