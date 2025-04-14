"use client";
import { useAuth } from "@/context/auth/useAuth";
import LoginViewModel from "../viewModel/LoginViewModel";
import { useEffect } from "react";
import { showToast } from "@/utils/helper/SendMessage";
import { Button, Col, Form, Input, Row } from "antd";
import { LOGIN_BACKGROUND_VIDEO } from "@/consts/ImgPath";
import logo from "@/app/icon.png";
import Image from "next/image";
import { FaSquareFacebook } from "react-icons/fa6";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const LoginView = () => {
  const { localStrings } = useAuth();
  const {
    showModal,
    setShowModal,
    handlePhoneInput,
    phoneLoading,
    // validatedMessage,
    // setValidatedMessage,
    resultObject,
    loginStep,
    setLoginStep,
    form,
    closeModal,
    handleOtp,
    onFacebookButtonPress,
    facebookLoading
  } = LoginViewModel();

  const FacebookButton = ({ onSuccess }: { onSuccess: (accessToken: string) => void }) => {
    return (
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
        callback={(response: any) => {
          if (response?.accessToken) {
            onSuccess(response.accessToken);
          } else {
            console.error('Facebook login failed:', response);
          }
        }}
        render={renderProps => (
          <Button
            type="default"
            size="large"
            className="w-full"
            loading={facebookLoading}
            onClick={renderProps.onClick}
            icon={<FaSquareFacebook />}
          >
            {localStrings.Login.LoginByFacebook}
          </Button>
        )}
      />
    );
  };

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Video background */}
      <div id="recaptcha-container" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={LOGIN_BACKGROUND_VIDEO} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay & content */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col z-10">
        <Row justify={"center"} className="w-full">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Image
              src={logo}
              alt="Logo"
              className="w-full"
            />
          </Col>
        </Row>
        <Row justify={"center"} className="w-full">
          <Col xs={20} sm={8} md={6} lg={3}>
            <div className="text-3xl font-bold text-center">
              {localStrings.GLobals.AppName}
            </div>
          </Col>
        </Row>
        <Form
          className="w-full"
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (loginStep === "phone")
              handlePhoneInput(values?.phone);
            else
              handleOtp(values?.otp);
          }}
        >
          <Row justify={"center"} className="w-full mt-4">
            <Col xs={20} sm={16} md={12} lg={10}>
              {loginStep === "phone" ? (
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: localStrings.Login.PhoneInvalid },
                    { min: 10, message: localStrings.Login.PhoneLengthInvalid },
                  ]}
                >
                  <Input
                    placeholder={localStrings.Login.PhoneInvalid}
                    size="large"
                    variant="outlined"
                    max={10}
                    type="phone"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="otp"
                  rules={[
                    { required: true, message: localStrings.Login.OTPInvalid },
                    { min: 6, message: localStrings.Login.OTPLengthInvalid },
                  ]}
                >
                  <Input.OTP
                    length={6}
                    size="large"
                    style={{ width: "100%" }}
                    autoFocus
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row justify={"center"} className="w-full">
            <Col xs={20} sm={16} md={12} lg={10}>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full"
                  loading={phoneLoading}
                >
                  {loginStep === "phone" ? localStrings.Login.LoginByPhone : localStrings.GLobals.Next}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row justify={"center"} className="w-full">
          <Col xs={20} sm={16} md={12} lg={10}>
            <FacebookButton onSuccess={onFacebookButtonPress} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default LoginView;
