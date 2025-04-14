import { UserModel } from "../../profile/models/UserModel";
import { TopicResponseModel } from "../../topic/models/TopicModel";
import { PackageResponseModel } from "./PackageModel";

export interface CreateBillRequestModel {
  packageId?: string;
  returnUrl?: string;
}

export interface PayedResultRequestModel {
  orderId?: string;
  resultCode?: number;
}

export interface BillModel {
  _id: string,
  user?: UserModel,
  type?: "point" | "package",
  point?: number,
  action?: boolean,
  topic?: TopicResponseModel,
  package?: PackageResponseModel
  totalPrice?: number,
  status?: boolean,
  createdAt?: string,
  updatedAt?: string
}