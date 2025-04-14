import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { CardModel } from "./models/CardModel";

interface ICardRepo {
  getRandomCards(): Promise<BaseApiResponseModel<CardModel[]>>
}

class CardRepo implements ICardRepo {
  async getRandomCards(): Promise<BaseApiResponseModel<CardModel[]>> {
    return await client.get(ApiPath.GET_RANDOM_CARDS);
  }
}

export const defaultCardRepo = new CardRepo();