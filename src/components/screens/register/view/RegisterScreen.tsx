import { View, Text, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import useColor from '@/src/hooks/useColor';
import { Button, Form, Modal } from '@ant-design/react-native';
import { AntDesign, Ionicons, Foundation } from '@expo/vector-icons';
import RegisterViewModel from '../viewModel/RegisterViewModel';
import { Image } from 'expo-image';
import MyInput from '@/src/components/foundation/MyInput';
import { router, useLocalSearchParams } from 'expo-router';
import DatePicker from 'react-native-date-picker'
import { useAuth } from '@/src/context/auth/useAuth';
import dayjs from 'dayjs';
import { showToast } from '@/src/utils/helper/SendMessage';
import Toast from 'react-native-toast-message';

const RegisterScreen = () => {
  const { brandPrimaryDark, brandPrimary } = useColor();
  const { localStrings } = useAuth();
  const {
    step,
    setStep,
    form,
    steps,
    date,
    setDate,
    gender,
    setGender,
    loading,
    resultObject,
    validateInfo
  } = RegisterViewModel();
  const { phone, type, facebookId, name } = useLocalSearchParams<{ phone?: string, type: string, facebookId?: string, name?: string }>();

  const getDots = () => {
    const dots = []
    for (let index = 1; index <= steps; index++) {
      if (index === step) {
        dots.push(<View style={{ width: 15, height: 15, backgroundColor: brandPrimary, borderRadius: 10, marginRight: index === steps ? 0 : 10 }} />)
      } else {
        dots.push(<View style={{ width: 10, height: 10, backgroundColor: 'white', borderRadius: 5, marginRight: index === steps ? 0 : 10 }} />)
      }
    }
    return dots
  }

  const renderDots = () => {
    const dots = getDots();
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        {dots.map((dot, index) => (
          <View key={index}>
            {dot}
          </View>
        ))}
      </View>
    )
  }

  const fields = {
    label: [
      localStrings.Register.Label.Fullname,
      localStrings.Register.Label.Birthday,
      localStrings.Register.Label.Gender,
    ],
    item: [
      <MyInput
        placeholder={localStrings.Register.Placeholder.Fullname}
        variant='filled'
        defaultValue={name}
        onChange={(e: any) => form.setFieldValue('name', e?.target?.value)}
        autoFocus
      />,
      <DatePicker
        date={date}
        onDateChange={(date) => {
          setDate(date)
          form.setFieldValue('birthDate', dayjs(date).format('YYYY-MM-DD'))
        }}
        mode='date'
        maximumDate={new Date()}
        theme='dark'
      />,
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button type={gender === 'male' ? 'primary' : 'ghost'} style={{ width: '48%', height: 100 }} onPress={() => {
          setGender('male')
          form.setFieldValue('gender', 'male')
        }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Ionicons name="male" size={30} color="white" />
            <Text style={{ color: 'white', marginTop: 5 }}>{localStrings.Register.Label.Male}</Text>
          </View>
        </Button>
        <Button type={gender === 'female' ? 'primary' : 'ghost'} style={{ width: '48%', height: 100, marginLeft: '4%' }} onPress={() => {
          setGender('female')
          form.setFieldValue('gender', 'female')
        }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Ionicons name="female" size={30} color="white" />
            <Text style={{ color: 'white', marginTop: 5 }}>{localStrings.Register.Label.Female}</Text>
          </View>
        </Button>
      </View>
    ]
  }

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

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        title: resultObject?.title,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <View style={{ flex: 1, backgroundColor: brandPrimaryDark }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={'padding'}
        >
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 40,
              paddingBottom: 20
            }}
          >
            {/* Header */}
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {step > 1 ? (
                <TouchableOpacity style={{ borderWidth: 0 }} onPress={() => setStep(step - 1)}>
                  <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 30 }}></View>
              )}
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
                {fields.label[step - 1]}
              </Text>
              <TouchableOpacity style={{ borderWidth: 0 }} onPress={() => {
                Modal.alert(localStrings.GLobals.Exit, localStrings.GLobals.ExitConfirm, [
                  {
                    text: localStrings.GLobals.Cancel,
                    style: 'cancel',
                  },
                  {
                    text: localStrings.GLobals.Exit,
                    onPress: () => {
                      router.replace('/(anonymous)/login');
                    },
                  },
                ])
              }}>
                <AntDesign name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Image */}
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{
                    width: 250,
                    height: 250,
                  }}
                />
              </View>

              {/* Textbox */}
              <Form form={form} style={{ display: 'none' }} />
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                {fields.item[step - 1]}
              </View>
            </View>

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              {/* Page dots and button */}
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {renderDots()}
                </View>
              </View>

              {/* Button */}
              <Button
                type='primary'
                style={{
                  width: '100%',
                  marginTop: 20,
                  height: 60,
                  borderWidth: 0,
                }}
                disabled={loading}
                loading={loading}
                onPress={() => {
                  validateInfo(
                    form.getFieldValue('name'),
                    form.getFieldValue('birthDate'),
                    form.getFieldValue('gender')
                  );
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Ionicons style={{ color: 'white' }} size={26} name="arrow-forward-outline" />
                </View>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Toast />
    </View>
  )
}

export default RegisterScreen