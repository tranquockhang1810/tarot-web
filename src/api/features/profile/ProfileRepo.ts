import { TransferToFormData } from "@/utils/helper/TransferToFormData";
import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { UpdateUserRequestModel } from "./models/UpdateUserModel";
import { UserModel } from "./models/UserModel";

interface IProfileRepo {
  getProfile(): Promise<BaseApiResponseModel<UserModel>>;
  updateProfile(params: UpdateUserRequestModel): Promise<BaseApiResponseModel<UserModel>>;
}

class ProfileRepo implements IProfileRepo {
  async getProfile(): Promise<BaseApiResponseModel<UserModel>> {
    return await client.get(ApiPath.GET_PROFILE);
  }
  updateProfile(params: UpdateUserRequestModel): Promise<BaseApiResponseModel<UserModel>> {
    const formData = TransferToFormData(params);
    return client.patch(ApiPath.UPDATE_PROFILE, formData, { headers: { "Content-Type": "multipart/form-data" } });
  }
}

export const defaultProfileRepo = new ProfileRepo();