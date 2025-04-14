export interface NotificationRequestModel {
  page?: number;
  limit?: number;
}

export interface NotificationResponseModel {
  _id?: string;
  user?: string;
  title?: string;
  description?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}