export interface MessageResponseModel {
  _id: string;
  chat?: string
  sender?: string
  senderType?: "user" | "ai"
  message?: string
  status?: boolean
  createdAt?: string
  updatedAt?: string
}