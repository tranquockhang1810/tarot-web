import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { HoroscopeRequestModel, HoroscopeResponseModel } from "./models/HoroscopeModel";

interface IHoroscopeRepo {
  getHoroscopeList(params: HoroscopeRequestModel): Promise<BaseApiResponseModel<HoroscopeResponseModel[]>>;
  getHoroscopeDetail(params: HoroscopeRequestModel): Promise<BaseApiResponseModel<HoroscopeResponseModel>>;
}

class HoroscopeRepo implements IHoroscopeRepo {
  async getHoroscopeList(params: HoroscopeRequestModel): Promise<BaseApiResponseModel<HoroscopeResponseModel[]>> {
    return await client.get(ApiPath.GET_HOROSCOPE, params)
  }

  async getHoroscopeDetail(params: HoroscopeRequestModel): Promise<BaseApiResponseModel<HoroscopeResponseModel>> {
    return await client.get(ApiPath.GET_HOROSCOPE_DETAIL, params)
  }
}

export const defaultHoroscopeRepo = new HoroscopeRepo();