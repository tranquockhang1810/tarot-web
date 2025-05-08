import { ChatListResponseModel } from "@/api/features/history/models/ChatListModel";
import { useAuth } from "@/context/auth/useAuth";
import { useMessage } from "@/context/socket/useMessage";
import useColor from "@/hooks/useColor";
import { GetRemainingDay } from "@/utils/helper/DateTransfer";
import { Image } from "antd";
import { Dispatch, SetStateAction } from "react";
import { GoDotFill } from "react-icons/go";
import { useMediaQuery } from "react-responsive";

const ChatItem = ({
  item,
  selectedChat,
  setSelectedChat,
  resetFlag,
  setResetFlag,
  setListCollapsed
}: {
  item?: ChatListResponseModel,
  selectedChat?: ChatListResponseModel,
  setSelectedChat?: Dispatch<SetStateAction<ChatListResponseModel | undefined>>,
  resetFlag?: boolean,
  setResetFlag?: Dispatch<SetStateAction<boolean>>,
  setListCollapsed?: Dispatch<SetStateAction<boolean>>
}) => {
  const { localStrings, language, setNewChatId } = useAuth();
  const { redError, violet, brandPrimaryTap } = useColor();
  const { createdDate, remaining } = GetRemainingDay(item?.createdAt, localStrings, language);
  const { updateMessageSeen } = useMessage();
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })

  return (
    <div className="flex flex-row items-center px-2 py-2"
      onClick={() => {
        setSelectedChat && setSelectedChat(item);
        setNewChatId("");
        setResetFlag && setResetFlag(!resetFlag);
        updateMessageSeen(item?._id || '');
        setListCollapsed && isMobile && setListCollapsed(true);
      }}
      style={{ cursor: 'pointer', backgroundColor: selectedChat?._id === item?._id ? brandPrimaryTap : '' }}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT! + item?.topic?.image}`}
        width={60}
        height={60}
        style={{ borderRadius: '50%' }}
        preview={false}
      />
      <div
        className="flex-1 ml-2 p-2 rounded-lg w-full overflow-hidden"
        style={{ backgroundColor: violet }}
      >
        <div className="flex flex-row justify-between">
          <span className="text-white text-xs opacity-60">{createdDate}</span>
          <div className="flex flex-row items-center">
            <span className="text-white text-xs opacity-60 mr-2">{remaining}</span>
            {item?.latestMessage?.status === false && (
              <GoDotFill
                color={redError}
                size={14}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-1">
          <span
            className={`text-white text-sm truncate ${item?.latestMessage?.status === false
              ? 'opacity-80 font-bold'
              : 'opacity-50 font-normal'
              }`}
          >
            {item?.latestMessage?.message || item?.question}
          </span>

        </div>
      </div>
    </div>
  );
};

export default ChatItem;