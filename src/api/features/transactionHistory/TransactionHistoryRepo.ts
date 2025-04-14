import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { BillModel } from "../topUp/models/BillModel";
import { TransactionListRequestModel } from "./models/TransactionListModel";

interface ITransactionHistoryRepo {
  getTransactionHistory: (params: TransactionListRequestModel) => Promise<BaseApiResponseModel<BillModel[]>>;
}

class TransactionHistoryRepo implements ITransactionHistoryRepo {
  async getTransactionHistory(params: TransactionListRequestModel): Promise<BaseApiResponseModel<BillModel[]>> {
    return await client.get(ApiPath.TRANSACTION_HISTORY, params);
  }
}

export const defaultTransactionHistoryRepo = new TransactionHistoryRepo();