import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";

export const showToast = ({
  type,
  content,
  time
}: {
  type?: NoticeType,
  content?: string,
  time?: number
}) => {
  message.open({
    type: type as NoticeType,
    content: content,
    duration: time || 3
  });
}