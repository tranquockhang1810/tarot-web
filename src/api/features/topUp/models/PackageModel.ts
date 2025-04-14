export interface PackageRequestModel {
  page?: number;
  limit?: number;
}

export interface PackageResponseModel {
  _id?: string;
  price?: number;
  point?: number;
  description?: string;
}