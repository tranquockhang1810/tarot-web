import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { PostRequestModel } from "./models/PostRequestModel";
import { PostResponseModel } from "./models/PostResponseModel";

interface IPostRepo {
  getPosts(params: PostRequestModel): Promise<BaseApiResponseModel<PostResponseModel[]>>
}

class PostRepo implements IPostRepo {
  async getPosts(params: PostRequestModel): Promise<BaseApiResponseModel<PostResponseModel[]>> {
    return await client.get(ApiPath.GET_POSTS, params);
  }
}

export const defaultPostRepo = new PostRepo();