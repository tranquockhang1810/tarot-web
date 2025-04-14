import { MessageResponseModel } from "../../history/models/MessageModel";

export interface ChatRequestModel {
  id: string;
  page: number;
  limit: number;
}

export interface CreateChatRequestModel {
  topic?: string
  question?: string
}

export interface ChatResponseModel {
  _id?: string
  topic?: {
    _id?: string
    name?: string
    image?: string
  },
  cards?: string[]
  question?: string
  status?: boolean
  createdAt?: string
  messages?: MessageResponseModel[]
}