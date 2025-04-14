export interface UserModel {
  id?: string;
  _id?: string;
  name?: string;
  phone?: string;
  status?: boolean;
  birthDate?: Date
  gender?: "male" | "female";
  type?: "phone" | "facebook";
  avatar?: string;
  point?: number;
  zodiac?: string;
}