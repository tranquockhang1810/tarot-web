import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { defaultLoginRepository } from "@/api/features/login/LoginRepository";
import { RegisterModel } from "@/api/features/login/models/RegisterModel";
import { useAuth } from "@/context/auth/useAuth";
import { Form } from "antd";
import { useState } from "react";

const RegisterViewModel = () => {
  const [form] = Form.useForm();
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, onLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const params: RegisterModel = {
        id: form.getFieldValue('id') || undefined,
        name: form.getFieldValue('name') || undefined,
        phone: form.getFieldValue('phone') || undefined,
        birthDate: form.getFieldValue('birthDate') || undefined,
        gender: form.getFieldValue('gender') || undefined,
        type: form.getFieldValue('type') || undefined,
      }
      const res = await defaultLoginRepository.register(params);
      if (res?.data) {
        onLogin(res?.data);
      } else {
        setResultObject({
          type: 'error',
          content: localStrings.Register.RegisterFailed + ': ' + res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage,
      })
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    resultObject,
    loading,
    handleRegister
  }
}

export default RegisterViewModel