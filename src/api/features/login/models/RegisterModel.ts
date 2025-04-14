export interface RegisterModel {
  id?: string;
  name?: string,
  phone?: string,
  birthDate?: string,
  gender?: "male" | "female",
  type?: "phone" | "facebook"
}