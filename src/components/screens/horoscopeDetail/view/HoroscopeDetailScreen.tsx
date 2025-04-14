import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Screen from '@/src/components/layout/Screen'
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/auth/useAuth';
import dayjs from 'dayjs';
import HoroscopeDetailViewModel from '../viewModel/HoroscopeDetailViewModel';
import { showToast } from '@/src/utils/helper/SendMessage';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image'
import useColor from '@/src/hooks/useColor';

const HoroscopeDetailScreen = () => {
  const { localStrings } = useAuth();
  const { brandPrimaryTap, redError, brandPrimary, blue } = useColor();
  const { date } = useLocalSearchParams<{ date: string }>();
  const {
    resultObject,
    horoscope,
    loading
  } = HoroscopeDetailViewModel(date);

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
      headerBackgroundColor='none'
      header={() => (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 30 }}>
          <TouchableOpacity
            style={{ height: 30 }}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </TouchableOpacity>
          {horoscope && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", height: 30 }}>{`${horoscope?.zodiac} - ${dayjs(date).format('DD/MM/YYYY')}`}</Text>
            </View>
          )}
          <View style={{ width: 30 }} />
        </View>
      )}
    >
      {loading || !horoscope ? (
        <ActivityIndicator size={"large"} color={"white"} />
      ) : (
        <>
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center", justifyContent: "center", flexWrap: "wrap", flexDirection: "row", zIndex: 3 }}>
              <View style={{
                width: 180, height: 180,
                borderRadius: 120,
                alignItems: "center", justifyContent: "center",
                backgroundColor: brandPrimaryTap,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5
              }}
              >
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/card/zodiac/${horoscope?.icon}.png` }}
                  style={{ width: 150, height: 150 }} contentFit='contain'
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: brandPrimary,
                marginTop: -90,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View style={{ marginTop: 90, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialCommunityIcons name="star-four-points" size={24} color={blue} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 10 }}>
                  {localStrings?.Horoscope?.InterpretingDestiny}
                </Text>
                <MaterialCommunityIcons name="star-four-points" size={24} color={blue} />
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {horoscope?.summary}
              </Text>

              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialCommunityIcons name="heart-multiple" size={24} color={redError} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 10 }}>
                  {localStrings?.Horoscope?.Love}
                </Text>
                <MaterialCommunityIcons name="heart-multiple" size={24} color={redError} />
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {horoscope?.love}
              </Text>

              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialCommunityIcons name="bag-personal" size={24} color={"#F0E68C"} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 10 }}>
                  {localStrings?.Horoscope?.Career}
                </Text>
                <MaterialCommunityIcons name="bag-personal" size={24} color={"#F0E68C"} />
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {horoscope?.career}
              </Text>

              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialIcons name="attach-money" size={24} color={"palegreen"} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 5 }}>
                  {localStrings?.Horoscope?.Finance}
                </Text>
                <MaterialIcons name="attach-money" size={24} color={"palegreen"} />
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {horoscope?.finance}
              </Text>

              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialCommunityIcons name="medical-bag" size={24} color={redError} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 10 }}>
                  {localStrings?.Horoscope?.Health}
                </Text>
                <MaterialCommunityIcons name="medical-bag" size={24} color={redError} />
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>
                {horoscope?.health}
              </Text>

              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <MaterialCommunityIcons name="clover" size={24} color={"palegreen"} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginHorizontal: 10 }}>
                  {localStrings?.Horoscope?.Luck}
                </Text>
                <MaterialCommunityIcons name="clover" size={24} color={"palegreen"} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  {`${localStrings?.Horoscope?.LuckyColor}: `}
                </Text>
                <View style={{
                  width: 16, height: 16,
                  borderRadius: 8,
                  backgroundColor: horoscope?.luckyColor?.code,
                  borderColor: "white",
                  borderWidth: 2
                }}/>
                <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>
                  {horoscope?.luckyColor?.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  {`${localStrings?.Horoscope?.LuckyNumber}: `}
                </Text>
                <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>
                  {horoscope?.luckyNumber}
                </Text>
              </View>
            </View>
            <View style={{ height: 30 }} />
          </ScrollView>
        </>
      )}
      <Toast />
    </Screen>
  )
}

export default HoroscopeDetailScreen