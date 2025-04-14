import { UserModel } from "../../profile/models/UserModel"

export interface LoginResponseModel {
  accessToken?: string
  user?: UserModel
  registerInfo?: {
    id?: string,
    name?: string
  }
}