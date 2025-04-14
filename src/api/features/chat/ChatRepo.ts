import { ChatRequestModel, ChatResponseModel, CreateChatRequestModel } from "./models/ChatModel";
import { BaseApiResponseModel } from '../../baseApiResponseModel/baseApiResponseModel';
import client from "../../client";
import { ApiPath } from "../../ApiPath";

interface ChatRepo {
  getChatMessages: (params: ChatRequestModel) => Promise<BaseApiResponseModel<ChatResponseModel>>;
  createChat: (params: CreateChatRequestModel) => Promise<BaseApiResponseModel<ChatResponseModel>>;
  deleteChat: (params: { id: string }) => Promise<BaseApiResponseModel<any>>;
  updateCard: (params: { id: string, cards: string[] }) => Promise<BaseApiResponseModel<ChatResponseModel>>
}

class ChatRepoImpl implements ChatRepo {
  async getChatMessages(params: ChatRequestModel): Promise<BaseApiResponseModel<ChatResponseModel>> {
    return await client.get(ApiPath.CHAT, params);
  }

  async createChat(params: CreateChatRequestModel): Promise<BaseApiResponseModel<ChatResponseModel>> {
    return await client.post(ApiPath.CREATE_CHAT, params)
  }

  async deleteChat(params: { id: string }): Promise<BaseApiResponseModel<any>> {
    return await client.delete(ApiPath.DELETE_CHAT, params);
  }

  async updateCard(params: { id: string, cards: string[] }): Promise<BaseApiResponseModel<ChatResponseModel>> {
    return await client.patch(ApiPath.UPDATE_CARDS, params);
  }
}

export const defaultChatRepo = new ChatRepoImpl();