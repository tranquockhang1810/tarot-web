export interface UpdateUserRequestModel {
  name?: string
  avatar?: {
    uri?: string,
    name?: string,
    type?: string
  }
  birthDate?: string
  gender?: "male" | "female"
}