import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { NotificationRequestModel, NotificationResponseModel } from "./models/NotificationModel";

interface INotificationRepo {
  getNotifications: (params: NotificationRequestModel) => Promise<BaseApiResponseModel<NotificationResponseModel[]>>;
}

class NotificationRepo implements INotificationRepo {
  async getNotifications(params: NotificationRequestModel): Promise<BaseApiResponseModel<NotificationResponseModel[]>> {
    return await client.get(ApiPath.NOTIFICATION, params);
  }
}

export const defaultNotificationRepo = new NotificationRepo();