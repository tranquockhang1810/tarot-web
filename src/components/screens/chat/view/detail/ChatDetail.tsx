import { Modal, Button, Typography, Image, Row, Col } from "antd";
import { ChatResponseModel } from "@/api/features/chat/models/ChatModel";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { AiOutlineClose } from "react-icons/ai";

const { Title, Text } = Typography;

interface ChatDetailModalProps {
  open: boolean;
  onClose: () => void;
  chatInfo: ChatResponseModel | null;
  deleteChat: (id: string) => void;
  deleteLoading: boolean;
}

const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
  open,
  onClose,
  chatInfo,
  deleteChat,
  deleteLoading,
}) => {
  const { localStrings } = useAuth();
  const { brandPrimaryDark, brandPrimaryTap } = useColor();

  const handleDelete = () => {
    Modal.confirm({
      title: localStrings?.GLobals?.Delete,
      content: localStrings?.GLobals?.DeleteChat,
      okText: localStrings?.GLobals?.Delete,
      okButtonProps: { danger: true },
      cancelText: localStrings?.GLobals?.Cancel,
      onOk: () => chatInfo?._id && deleteChat(chatInfo._id),
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Title level={4} className="!mb-0 !text-white">
          {localStrings?.Create.Question}: "
          {chatInfo?.question?.toUpperCase()}"
        </Title>
      }
      width={800}
      className="custom-modal"
      styles={{
        header: { backgroundColor: brandPrimaryDark },
        content: { backgroundColor: brandPrimaryDark }
      }}
      maskClosable={false}
      closeIcon={<AiOutlineClose className="text-white" />}
    >
      <div className="max-h-[70vh] overflow-y-auto px-2">
        <div className="mt-4">
          <span className="text-white text-lg font-bold">
            {localStrings?.GLobals.Cards}:
          </span>
        </div>

        <Row gutter={[16, 16]} className="mt-4">
          {chatInfo?.cards?.map((card, index) => {
            const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/card/${card?.toLowerCase().replaceAll(" ", "-")}.png`;

            return (
              <Col key={index} xs={24} sm={12} md={8} lg={8} className="text-center">
                <div
                  className="rounded-xl border-2 border-white overflow-hidden mx-auto"
                  style={{
                    width: 127,
                    height: 225,
                    backgroundColor: brandPrimaryTap,
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={card}
                    width={127}
                    height={225}
                    className="object-cover w-full h-full rounded"
                    preview={false}
                  />
                </div>
                <span className="text-white mt-2 block">{card}</span>
              </Col>
            );
          })}
        </Row>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            onClick={handleDelete}
            className="text-white font-bold rounded-lg px-6 py-2"
          >
            {localStrings?.GLobals?.Delete}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatDetailModal;
