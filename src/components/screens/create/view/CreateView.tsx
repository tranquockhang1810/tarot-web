"use client";
import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "@/context/auth/useAuth";
import { TopicsType } from "@/api/features/topic/models/TopicModel";
import CreateViewModel from "../viewModel/CreateViewModel";
import { Image } from "antd";
import { FaCoins } from "react-icons/fa";
import useColor from "@/hooks/useColor";
import { showToast } from "@/utils/helper/SendMessage";

const CreateView = () => {
  const [form] = Form.useForm();
  const {
    topics,
    resultObject,
    selectedTopic,
    setSelectedTopic,
    questionRef,
    handleCreateChat,
    createLoading,
  } = CreateViewModel();
  const { localStrings } = useAuth();
  const { brandPrimary, brandPrimaryDark, brandPrimaryTap } = useColor();

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <div className="max-h-screen px-6 py-10 text-white overflow-auto">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Chủ đề */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{localStrings.Create.ChooseTopic}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {topics.map((topic, index) => (
              <div
                key={index}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2`}
                style={{
                  backgroundColor: topic?._id === selectedTopic?._id ? brandPrimary : brandPrimaryDark,
                  borderColor: topic?._id === selectedTopic?._id ? brandPrimaryTap : brandPrimary,
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}${topic?.image}`}
                  alt={topic?.code}
                  preview={false}
                  className="w-full h-8 object-cover rounded-lg mb-3"
                />
                <div className="text-center text-white font-medium text-lg">
                  {(localStrings.Topics as TopicsType)[topic?.code || ""]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form nhập câu hỏi */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{localStrings.Create.Question}</h2>
          <Form
            form={form}
            onFinish={() => {
              const values = form.getFieldsValue();
              questionRef.current = values.question;
              handleCreateChat();
            }}
            layout="vertical"
          >
            <Form.Item
              name="question"
              rules={[{ required: true, message: localStrings.Create.QuestionPlaceholder }]}
            >
              <Input.TextArea
                placeholder={localStrings.Create.QuestionPlaceholder}
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="bg-gray-800 text-white"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                loading={createLoading}
                // disabled={createLoading}
                className="w-full flex items-center justify-center gap-2 text-white"
              >
                {localStrings.Create.Now} {selectedTopic?.price || 0}
                <FaCoins className="text-yellow-400" />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateView;
