"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from './authContextType';
import { VnLocalizedStrings } from "@/utils/localizedStrings/vietnam";
import { ENGLocalizedStrings } from "@/utils/localizedStrings/english";
import translateLanguage from '../../utils/i18n/translateLanguage';
import { UserModel } from '../../api/features/profile/models/UserModel';
import { LoginResponseModel } from '@/api/features/login/models/LoginModel';
import { defaultProfileRepo } from '@/api/features/profile/ProfileRepo';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [localStrings, setLocalStrings] = useState(VnLocalizedStrings);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [user, setUser] = useState<UserModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkAuthLoading, setCheckAuthLoading] = useState(true);
  const [newChatId, setNewChatId] = useState<string | null>(null);

  const checkLanguage = async () => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage === "en") {
      setLanguage("en");
      setLocalStrings(ENGLocalizedStrings);
    } else {
      setLanguage("vi");
      setLocalStrings(VnLocalizedStrings);
    }
  }

  const changeLanguage = async () => {
    const lng = language === "vi" ? "en" : "vi";
    translateLanguage(lng).then(() => {
      localStorage.setItem('language', lng);
      setLanguage(lng);
      setLocalStrings(lng === "vi" ? VnLocalizedStrings : ENGLocalizedStrings);
    });
  };

  const onLogin = async (user: LoginResponseModel) => {
    localStorage.setItem('accesstoken', user?.accessToken || '');
    setIsAuthenticated(true);
    setUser(user?.user || null);
    router.replace('/home');
  }

  const onUpdateProfile = async (user: UserModel) => {
    setUser(user);
  }

  const onLogout = () => {
    //Xóa dữ liệu trong storage và trong biến
    localStorage.removeItem('user');
    localStorage.removeItem('accesstoken');
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/login');
  }

  const isLoginUser = (userId: string) => {
    return user?.id === userId;
  }

  const getUser = async () => {
    try {
      const res = await defaultProfileRepo.getProfile();
      if (res?.code === 200 && res?.data) {
        setUser(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkLanguage();
  }, [language]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAccessToken = localStorage.getItem('accesstoken');
        if (storedAccessToken) {
          setIsAuthenticated(true);
          getUser();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCheckAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      onLogin,
      onLogout,
      localStrings,
      changeLanguage,
      language,
      setLanguage,
      isAuthenticated,
      user,
      onUpdateProfile,
      isLoginUser,
      checkAuthLoading,
      getUser,
      newChatId, setNewChatId
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
