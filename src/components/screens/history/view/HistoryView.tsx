import { ChatListResponseModel } from "@/api/features/history/models/ChatListModel";
import ChatItem from "@/components/foundation/ChatItem";
import HistoryViewModel from "../viewModel/HistoryViewModel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Spin, Tooltip } from "antd";
import useColor from "@/hooks/useColor";
import { IoFilterSharp } from "react-icons/io5";
import FilterForm from "@/components/foundation/ListChatFilter";
import { showToast } from "@/utils/helper/SendMessage";
import { FaPlus, FaSquarePlus } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";

const HistoryView = ({
  selectedChat,
  setSelectedChat
}: {
  selectedChat?: ChatListResponseModel,
  setSelectedChat?: Dispatch<SetStateAction<ChatListResponseModel | undefined>>
}) => {
  const {
    listChats,
    getMoreChats,
    hasMore,
    listLoading,
    topics,
    statusList,
    handleApply,
    dateFilterType,
    setDateFilterType,
    resetFilter,
    resultObject,
    resetFlag, setResetFlag
  } = HistoryViewModel();
  const { brandPrimaryDark } = useColor();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const router = useRouter();
  const { newChatId } = useAuth();

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  useEffect(() => {
    if (newChatId) {
      console.log("newChatId", newChatId);
      
      setSelectedChat && setSelectedChat({ _id: newChatId });
    } else if (isFirstRender && listChats && listChats?.length > 0) {
      setIsFirstRender(false);
      setSelectedChat && setSelectedChat(listChats[0]);
    }
  }, [listChats, newChatId]);

  return (
    <>
      <div id="scrollableDiv" className="h-full overflow-y-auto" style={{
        scrollbarWidth: "none",
        borderLeftWidth: 8,
        borderColor: brandPrimaryDark
      }}>
        <div className="flex justify-end p-2">
          <Button icon={<FaSquarePlus size={24} color="white" />} type="text" onClick={() => router.push("/create")} />
          <Tooltip
            placement="bottomRight"
            arrow={false}
            trigger={["click"]}
            color={brandPrimaryDark}
            title={
              <FilterForm
                topics={topics}
                statusList={statusList}
                onApply={handleApply}
                onReset={resetFilter}
                dateFilterType={dateFilterType}
                setDateFilterType={setDateFilterType}
              />
            }
          >
            <Button icon={<IoFilterSharp size={24} color="white" />} type="text" />
          </Tooltip>
        </div>
        <InfiniteScroll
          dataLength={listChats?.length || 0}
          next={getMoreChats}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <Spin spinning={listLoading} />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {listChats?.map((item: ChatListResponseModel) => (
            <ChatItem
              key={item?._id}
              item={item}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              resetFlag={resetFlag}
              setResetFlag={setResetFlag}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default HistoryView;
