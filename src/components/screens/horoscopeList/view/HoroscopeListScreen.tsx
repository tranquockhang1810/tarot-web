import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import Screen from '@/src/components/layout/Screen'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/src/context/auth/useAuth'
import useColor from '@/src/hooks/useColor'
import { router } from 'expo-router'
import VideoBackground from '@/src/components/layout/VideoBackground'
import { Image } from 'expo-image'
import HoroscopeListViewModel from '../viewModel/HoroscopeListViewModel'
import { showToast } from '@/src/utils/helper/SendMessage'
import Toast from 'react-native-toast-message'
import dayjs from 'dayjs'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const HoroscopeListScreen = () => {
  const { localStrings } = useAuth();
  const { brandPrimaryRGB, blue } = useColor();
  const {
    list,
    loading,
    resultObject
  } = HoroscopeListViewModel();
  const bounceValue = useSharedValue(0);

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 300 }),
        withTiming(2, { duration: 300 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }]
  }));

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
    <VideoBackground>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 35, paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{ height: 30 }}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", height: 30 }}>{localStrings.Horoscope.Title}</Text>
          </View>
          <View style={{ width: 30 }} />
        </View>
        {/* Body */}
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          {loading ? (
            <ActivityIndicator size={"large"} color={"white"} />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ alignItems: "center", justifyContent: "center", flexWrap: "wrap", flexDirection: "row" }}>
                <View style={{
                  width: 180, height: 180,
                  marginTop: 10,
                  borderRadius: 120,
                  alignItems: "center", justifyContent: "center"
                }}
                >
                  <Image source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/card/zodiac/${list?.[0]?.icon}.png` }} style={{ width: 220, height: 160 }} contentFit='contain' />
                </View>
              </View>
              {list?.map((item, index) => (
                <TouchableOpacity
                  key={item?._id}
                  style={{
                    borderRadius: 10,
                    padding: 20,
                    marginBottom: 20,
                    backgroundColor: brandPrimaryRGB(0.8)
                  }}
                  onPress={() => router.push({
                    pathname: `/(routes)/horoscope/details`,
                    params: { date: item?.date }
                  })}
                >
                  <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                      {`${item?.zodiac} - ${dayjs(item?.date).format("DD/MM/YYYY")}`}
                    </Text>
                    {index === 0 && (
                      <Animated.View style={animatedStyle}>
                        <MaterialCommunityIcons name="star-four-points" size={24} color={blue} />
                      </Animated.View>
                    )}
                  </View>
                  <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: "semibold", fontStyle: "italic" }}
                  >
                    {`${item?.summary}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <Toast />
        </View>
      </View>
    </VideoBackground>
  )
}

export default HoroscopeListScreen