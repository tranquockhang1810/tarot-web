import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { ChatListRequestModel, ChatListResponseModel } from "./models/ChatListModel";

interface IHistoryRepo {
  getChatList(params: ChatListRequestModel): Promise<BaseApiResponseModel<ChatListResponseModel[]>>
}

class HistoryRepo implements IHistoryRepo {
  async getChatList(params: ChatListRequestModel): Promise<BaseApiResponseModel<ChatListResponseModel[]>> {
    return await client.get(ApiPath.GET_CHAT_LIST, params);
  }
}

export const defaultHistoryRepo = new HistoryRepo();