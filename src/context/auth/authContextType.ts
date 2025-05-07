import { VnLocalizedStrings } from "@/utils/localizedStrings/vietnam";
import { ENGLocalizedStrings } from "@/utils/localizedStrings/english";
import { UserModel } from "@/api/features/profile/models/UserModel";
import { LoginResponseModel } from "@/api/features/login/models/LoginModel";
import { Dispatch } from "react";

export interface AuthContextType {
  onLogin: (user: LoginResponseModel) => void;
  onUpdateProfile: (user: UserModel) => void;
  onLogout: () => void;
  localStrings: typeof VnLocalizedStrings | typeof ENGLocalizedStrings; 
  changeLanguage: () => void;
  language: "vi" | "en";
  setLanguage: (lng: "vi" | "en") => void;
  user: UserModel | null;
  isAuthenticated: boolean;
  isLoginUser: (userId: string) => boolean;
  checkAuthLoading: boolean;
  getUser: () => Promise<void>;
  newChatId: string | null;
  setNewChatId: Dispatch<React.SetStateAction<string | null>>;
}