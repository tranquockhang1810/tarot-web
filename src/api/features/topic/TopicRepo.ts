import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { TopicResponseModel } from "./models/TopicModel";

interface ITopicRepo {
  getTopics(): Promise<BaseApiResponseModel<TopicResponseModel[]>>;
}

class TopicRepo implements ITopicRepo {
  async getTopics(): Promise<BaseApiResponseModel<TopicResponseModel[]>> {
    return await client.get(ApiPath.GET_TOPICS);
  }
}

export const defaultTopicRepo = new TopicRepo();