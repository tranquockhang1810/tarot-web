"use client";
import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { useAuth } from "@/context/auth/useAuth";
import React, { useEffect } from "react";
import { defaultLoginRepository } from "@/api/features/login/LoginRepository";
import { convertToInternational } from "@/utils/helper/PhoneConvert";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import { auth } from "@/api/firebase";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const LoginViewModel = () => {
  const router = useRouter();
  const [resultObject, setResultObject] = React.useState<ResultObject | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const { localStrings, onLogin } = useAuth();
  const [phoneLoading, setPhoneLoading] = React.useState(false);
  const [loginStep, setLoginStep] = React.useState<"phone" | "otp">("phone");
  const [form] = Form.useForm();
  const [recaptchaVerifier, setRecaptchaVerifier] = React.useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = React.useState<string | null>(null);
  const [facebookLoading, setFacebookLoading] = React.useState(false);

  const handlePhoneInput = async (phone: string) => {
    try {
      setPhoneLoading(true);
      const intlPhone = convertToInternational(phone);

      if (!recaptchaVerifier) {
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, intlPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setResultObject({
        type: 'success',
        content: localStrings.Login.SentOTPSuccess
      });
      setPhone(phone);
      setLoginStep("otp");
    } catch (error: any) {
      console.error('Error:', error.code, error.message);
      setResultObject({
        type: 'error',
        content: error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setPhoneLoading(false);
    }
  }

  const handleOtp = async (otp: string) => {
    try {
      setPhoneLoading(true);
      if (!confirmationResult)
        return;

      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      const res = await defaultLoginRepository.loginByOtp({ idToken });
      if (res?.code === 200) {
        if (res?.data) {
          onLogin(res?.data);
          closeModal();
        } else {
          closeModal();
          router.push(`/register?phone=${phone}&type=phone`);
        }
      } else {
        setResultObject({
          type: 'error',
          content: `${localStrings.Login.LoginFailed}: ${res?.message}`,
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setPhoneLoading(false);
    }
  }

  const closeModal = () => {
    setShowModal(false);
    setLoginStep("phone");
    setPhone(null);
    form.resetFields();
  }

  const onFacebookButtonPress = async (accessToken: string) => {
    setFacebookLoading(true);
    await handleFacebookLogin(accessToken);
  };

  const handleFacebookLogin = async (accessToken: string) => {
    if (!accessToken) return
    try {
      const res = await defaultLoginRepository.loginFacebook({ accessToken });
      if (res?.code === 200 && res?.data) {
        if (res?.data?.user) {
          onLogin(res?.data);
        } else if (res?.data?.registerInfo) {
          router.push(`/register?facebookId=${res?.data?.registerInfo?.id}&name=${res?.data?.registerInfo?.name}&type=facebook`);
        }
      } else {
        setResultObject({
          type: 'error',
          content: localStrings.Login.LoginFailed + ': ' + res?.message,
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setFacebookLoading(false);
    }
  }

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      { size: 'invisible' }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    }
  }, [auth]);

  return {
    handlePhoneInput,
    resultObject,
    phoneLoading,
    showModal,
    setShowModal,
    loginStep,
    setLoginStep,
    form,
    closeModal,
    handleOtp,
    onFacebookButtonPress,
    facebookLoading
  }
}

export default LoginViewModel