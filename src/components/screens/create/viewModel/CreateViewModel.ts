import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { defaultChatRepo } from "@/api/features/chat/ChatRepo";
import { TopicResponseModel } from "@/api/features/topic/models/TopicModel";
import { defaultTopicRepo } from "@/api/features/topic/TopicRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

const CreateViewModel = () => {
  const router = useRouter();
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, getUser } = useAuth();
  const [topics, setTopics] = useState<TopicResponseModel[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicResponseModel | null>(null)
  const questionRef = useRef<string>("")
  const [createLoading, setCreateLoading] = useState(false)

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
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage,
      })
    }
  }

  const handleCreateChat = async () => {
    try {
      setCreateLoading(true)
      const res = await defaultChatRepo.createChat({
        topic: selectedTopic?._id,
        question: questionRef?.current
      })
      if (res?.code === 200 && res?.data) {
        await getUser();
        setSelectedTopic(null)
        questionRef.current = ""
        router.replace(`/create/${res?.data?._id}`);
      } else {
        setResultObject({
          type: "error",
          content: res?.error?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage,
      })
    } finally {
      setCreateLoading(false);
    }
  }

  useEffect(() => {
    getTopicList();
  }, [])

  return {
    resultObject,
    topics,
    selectedTopic, setSelectedTopic,
    questionRef,
    handleCreateChat,
    createLoading
  }
}

export default CreateViewModel