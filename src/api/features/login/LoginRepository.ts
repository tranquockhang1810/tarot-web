import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { LoginResponseModel } from "./models/LoginModel";
import { RegisterModel } from "./models/RegisterModel";

interface ILoginRepository {
  loginByOtp(params: { idToken: string }): Promise<BaseApiResponseModel<LoginResponseModel>>;
  register(params: RegisterModel): Promise<BaseApiResponseModel<LoginResponseModel>>;
  loginFacebook(params: { accessToken ?: string }): Promise<BaseApiResponseModel<LoginResponseModel>>;
}

class LoginRepository implements ILoginRepository {
  async loginByOtp(params: { idToken: string }): Promise<BaseApiResponseModel<LoginResponseModel>> {
    return await client.post(ApiPath.LOGIN_BY_OTP, params);
  }

  async register(params: RegisterModel): Promise<BaseApiResponseModel<LoginResponseModel>> {
    return await client.post(ApiPath.REGISTER, params);
  }

  async loginFacebook(params: { accessToken?: string }): Promise<BaseApiResponseModel<LoginResponseModel>> {
    return await client.post(ApiPath.LOGIN_FACEBOOK, params);
  }
}

export const defaultLoginRepository = new LoginRepository();