"use client";
import { LOGIN_BACKGROUND_VIDEO } from "@/consts/ImgPath"
import { useAuth } from "@/context/auth/useAuth";
import { Row, Col, Form, Input, Button, DatePicker, Select } from "antd";
import RegisterViewModel from "../viewModel/RegisterViewModel";
import logo from "@/app/icon.png";
import { useEffect } from "react";
import { showToast } from "@/utils/helper/SendMessage";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { log } from 'console';

const RegisterView = () => {
  const { localStrings } = useAuth();
  const {
    form,
    resultObject,
    loading,
    handleRegister
  } = RegisterViewModel();
  const search = useSearchParams();
  const type = search.get('type');
  const phone = search.get('phone');
  const facebookId = search.get('id');
  const name = search.get('name');

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  useEffect(() => {
    form.setFieldValue('type', type);
    switch (type) {
      case 'phone':
        if (phone) form.setFieldValue('phone', phone);
        break;
      case 'facebook':
        if (facebookId) form.setFieldValue('id', facebookId);
        if (name) form.setFieldValue('name', name);
        break;
    }
  }, [phone, type, facebookId, name]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Video background */}
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
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col z-10 overflow-auto">
        <Row justify={"center"} className="w-full">
          <Col xs={12} sm={8} md={6} lg={3}>
            <Image
              src={logo}
              alt="Logo"
              className="w-full"
            />
          </Col>
        </Row>
        <Row justify={"center"} className="w-full">
          <Col xs={20} sm={8} md={6} lg={4}>
            <div className="text-3xl font-bold text-center">
              {localStrings.Register.Title.toUpperCase()}
            </div>
          </Col>
        </Row>
        <Form
          className="w-full"
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
        >
          {type === 'phone' && (
            <Row justify={"center"} className="w-full mt-4">
              <Col xs={20} sm={16} md={12} lg={10}>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: localStrings.Login.PhoneInvalid },
                    { min: 10, message: localStrings.Login.PhoneLengthInvalid },
                  ]}
                  initialValue={phone}
                  label={<span className="text-white font-bold text-lg">{localStrings.Login.Phone}</span>}
                >
                  <Input
                    placeholder={localStrings.Login.PhoneInvalid}
                    size="large"
                    variant="outlined"
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row justify={"center"} className="w-full mt-4">
            <Col xs={20} sm={16} md={12} lg={10}>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: localStrings.Register.Messages.FullnameRequired },
                  { min: 3, message: localStrings.Register.Messages.FullnameRequired },
                ]}
                label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Fullname}</span>}
                initialValue={name}
              >
                <Input
                  placeholder={localStrings.Register.Placeholder.Fullname}
                  size="large"
                  variant="outlined"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} className="w-full mt-4">
            <Col xs={20} sm={16} md={12} lg={10}>
              <Form.Item
                name="birthDate"
                rules={[
                  { required: true, message: localStrings.Register.Messages.BirthdayRequired },
                ]}
                label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Birthday}</span>}
              >
                <DatePicker
                  size="large"
                  placeholder={localStrings.Register.Placeholder.Birthday}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} className="w-full mt-4">
            <Col xs={20} sm={16} md={12} lg={10}>
              <Form.Item
                name="gender"
                rules={[
                  { required: true, message: localStrings.Register.Messages.GenderRequired },
                ]}
                label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Gender}</span>}
              >
                <Select
                  placeholder={localStrings.Register.Placeholder.Gender}
                  size="large"
                  variant="outlined"
                  className="w-full"
                  options={[
                    { value: "male", label: localStrings.Register.Label.Male },
                    { value: "female", label: localStrings.Register.Label.Female },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"} className="w-full">
            <Col xs={20} sm={16} md={12} lg={10}>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full mt-4"
                  loading={loading}
                >
                  {localStrings.GLobals.Confirm}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default RegisterView