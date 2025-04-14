import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import Screen from '@/src/components/layout/Screen'
import { router } from 'expo-router'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/src/context/auth/useAuth'
import TopUpViewModel from '../viewModel/TopUpViewModel'
import Toast from 'react-native-toast-message'
import { showToast } from '@/src/utils/helper/SendMessage'
import useColor from '@/src/hooks/useColor'
import { CurrencyFormat } from '../../../../utils/helper/CurrencyFormat';
import { Image } from 'expo-image'
import { MOMO_IMAGE } from '@/src/consts/ImgPath'

const TopUpScreen = () => {
  const { localStrings, user } = useAuth();
  const { brandPrimaryDark, brandPrimary } = useColor();
  const {
    resultObject,
    packageLoading,
    packages,
    selectedPackage, setSelectedPackage,
    paymentLoading, createBill
  } = TopUpViewModel();

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
    <Screen
      header={() => (
        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <TouchableOpacity
              style={{ height: 40 }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", height: 40 }}>{localStrings.Topup.Title}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", height: 40, justifyContent: "center" }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>{user?.point}</Text>
            <FontAwesome6 name="coins" size={20} color="yellow" />
          </View>
        </View>
      )}
      headerBackgroundColor='none'
    >
      {packageLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color='white' size='large' />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingBottom: 20
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              flexDirection: 'row'
            }}
          >
            {packages?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "48%",
                  height: 180,
                  backgroundColor: selectedPackage?._id === item?._id ? brandPrimary : brandPrimaryDark,
                  borderColor: brandPrimary,
                  borderWidth: 2,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: "column",
                  marginBottom: 20
                }}
                onPress={() => setSelectedPackage(item)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginRight: 10 }}>{item?.point}</Text>
                  <FontAwesome6 name="coins" size={36} color="yellow" />
                </View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{CurrencyFormat(Number(item?.price))}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: "row",
              opacity: selectedPackage ? 1 : 0.5
            }}
          >
            <TouchableOpacity
              style={{
                width: 300,
                height: 60,
                backgroundColor: brandPrimary,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: "row",
                pointerEvents: selectedPackage ? 'auto' : 'none'
              }}
              onPress={() => createBill(selectedPackage?._id || "")}
            >
              {paymentLoading ? (
                <ActivityIndicator color='white' size='small' />
              ) : (
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>
                  {localStrings.Topup.Pay}
                </Text>
              )}
            </TouchableOpacity>
            <Image
              source={{ uri: MOMO_IMAGE }}
              style={{ width: 60, height: 60, borderRadius: 10, borderColor: "white", borderWidth: 2 }}
              contentFit='contain'
            />
          </View>
        </View>
      )}
      <Toast topOffset={80}/>
    </Screen>
  )
}

export default TopUpScreen