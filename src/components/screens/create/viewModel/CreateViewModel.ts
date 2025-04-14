import { ResultObject } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { defaultChatRepo } from "@/src/api/features/chat/ChatRepo";
import { TopicResponseModel } from "@/src/api/features/topic/models/TopicModel";
import { defaultTopicRepo } from "@/src/api/features/topic/TopicRepo";
import { useAuth } from "@/src/context/auth/useAuth";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react"

const CreateViewModel = () => {
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
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
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
        router.replace({
          pathname: `/(routes)/card/${res?.data?._id}` as any,
          params: { previous: "/(tabs)/history" }
        });
      } else {
        setResultObject({
          type: "error",
          title: res?.error?.message
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