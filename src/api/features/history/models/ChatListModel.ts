import { MessageResponseModel } from "./MessageModel"

export interface ChatListRequestModel {
  status?: boolean
  topic?: string[]
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}

export interface ChatListResponseModel {
  _id?: string
  topic?: {
    _id?: string
    name?: string
    image?: string
  },
  question?: string
  status?: boolean
  createdAt?: string
  latestMessage?: MessageResponseModel
}