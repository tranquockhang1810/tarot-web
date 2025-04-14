import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { CreateBillRequestModel, PayedResultRequestModel, BillModel } from "./models/BillModel";
import { PackageRequestModel, PackageResponseModel } from "./models/PackageModel";

interface ITopUpRepo {
  getPackageList(params: PackageRequestModel): Promise<BaseApiResponseModel<PackageResponseModel[]>>;
  createBill(params: any): Promise<BaseApiResponseModel<any>>;
  payedResult(params: any): Promise<BaseApiResponseModel<any>>;
}

class TopUpRepo implements ITopUpRepo {
  async getPackageList(params: PackageRequestModel): Promise<BaseApiResponseModel<PackageResponseModel[]>> {
    return await client.get(ApiPath.GET_PACKAGE_LIST, params);
  }
  async createBill(params: CreateBillRequestModel): Promise<BaseApiResponseModel<string>> {
    return await client.post(ApiPath.CREATE_BILL, params);
  }
  async payedResult(params: PayedResultRequestModel): Promise<BaseApiResponseModel<BillModel>> {
    return await client.post(ApiPath.PAYED_RESULT, params);
  }
}

export const defaultTopUpRepo = new TopUpRepo();