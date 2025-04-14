import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ProfileViewModel from '../viewModel/ProfileViewModel'
import { useAuth } from '@/src/context/auth/useAuth';
import Screen from '@/src/components/layout/Screen';
import useColor from '@/src/hooks/useColor';
import dayjs from 'dayjs';
import { Ionicons, MaterialIcons, FontAwesome, Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { AVARTAR_IMAGE } from '@/src/consts/ImgPath';
import { Modal } from '@ant-design/react-native';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const { localStrings, changeLanguage, user, onLogout } = useAuth();
  const { brandPrimaryDark, brandPrimaryTap, brandPrimary, redError, orange, blue } = useColor();
  const { } = ProfileViewModel();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: brandPrimaryDark }} showsVerticalScrollIndicator={false}>
      <Screen
        headerBackgroundColor='none'
        header={() => (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", flex: 1 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{localStrings.Profile.Title}</Text>
          </View>
        )}
      >
        <View
          style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}
        >
          {/* user info */}
          <View
            style={{
              alignItems: "center",
              flexWrap: "wrap", flexDirection: "column",
              padding: 20,
              backgroundColor: brandPrimary,
              borderRadius: 10,
              width: "100%"
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap", flexDirection: "row" }}>
                <Image source={{ uri: `${user?.avatar}` || AVARTAR_IMAGE }} style={{ width: 60, height: 60, borderRadius: 50, marginRight: 10 }} />
                <View>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
                  <Text style={{ color: "white", fontSize: 14, opacity: 0.6 }}>{dayjs(user?.birthDate).format("DD/MM/YYYY")}</Text>
                </View>
              </View>
              <TouchableOpacity style={{ alignItems: "flex-start" }} onPress={() => router.push("/(routes)/update-profile")}>
                <MaterialIcons name="settings" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", height: 1, marginVertical: 20, borderStyle: "dashed", borderWidth: 1, borderColor: brandPrimaryDark }} />

            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexDirection: "row", width: "100%" }}>
                <View
                  style={{ alignItems: "center", justifyContent: "center", width: 100, height: 60, borderRadius: 10, backgroundColor: brandPrimaryDark }}
                >
                  <Ionicons name={user?.gender} size={35} color="white" />
                </View>

                <View
                  style={{ alignItems: "center", justifyContent: "center", width: 100, height: 60, borderRadius: 10, backgroundColor: brandPrimaryDark }}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/card/zodiac/zodiac-${user?.zodiac}.png` }}
                    style={{ width: 50, height: 50 }}
                    contentFit="contain"
                  />
                </View>

                <View
                  style={{ alignItems: "center", justifyContent: "center", width: 100, height: 60, borderRadius: 10, backgroundColor: brandPrimaryDark }}
                >
                  <FontAwesome name={user?.type} size={35} color="white" />
                </View>
              </View>
            </View>
          </View>

          {/* wallet */}
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              flexWrap: "wrap", flexDirection: "column",
              marginTop: 20,
              padding: 20,
              borderColor: brandPrimary,
              borderWidth: 2,
              borderRadius: 10
            }}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => router.push("/(routes)/top-up")}
            >
              <View style={{ alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap", flexDirection: "row" }}>
                <FontAwesome6 name="coins" size={40} color="yellow" />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{`${localStrings.Profile.Point}: ${user?.point}`}</Text>
                  <Text style={{ color: "white", fontSize: 11, opacity: 0.6 }}>{localStrings.Profile.PointNote}</Text>
                </View>
              </View>
              <Feather name="plus-circle" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ width: "100%", height: 1, marginVertical: 20, borderWidth: 1, borderColor: brandPrimaryTap, opacity: 0.2 }} />
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between"
              }}
              onPress={() => router.push("/(routes)/transaction-history")}
            >
              <View style={{ alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap", flexDirection: "row" }}>
                <MaterialIcons name="history" size={40} color={orange} />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{localStrings.Profile.TransHistory}</Text>
                  <Text style={{ color: "white", fontSize: 11, opacity: 0.6 }}>{localStrings.Profile.TransHistoryNote}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ width: "100%", height: 1, marginVertical: 20, borderWidth: 1, borderColor: brandPrimaryTap, opacity: 0.2 }} />
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap", flexDirection: "row",
                justifyContent: "space-between"
              }}
              onPress={() => router.push(`/(routes)/horoscope`)}
            >
              <View style={{ alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap", flexDirection: "row" }}>
                <MaterialCommunityIcons name="star-four-points" size={40} color={blue} />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{localStrings.Profile.Horoscope}</Text>
                  <Text style={{ color: "white", fontSize: 11, opacity: 0.6 }}>{localStrings.Profile.HoroscopeNote}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Language & Logout */}
          <View
            style={{
              alignItems: "center",
              flexWrap: "wrap", flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 20
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center", justifyContent: "center",
                flexDirection: "row",
                width: "100%", height: 60,
                borderRadius: 10,
                borderColor: brandPrimary,
                borderWidth: 2,
              }}
              onPress={changeLanguage}
            >
              <MaterialIcons name="language" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 14, marginLeft: 10 }}>{localStrings?.GLobals?.Language}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center", justifyContent: "center",
                flexDirection: "row",
                width: "100%", height: 60,
                borderRadius: 10,
                borderColor: redError,
                borderWidth: 2,
                marginTop: 20
              }}
              onPress={() => {
                Modal.alert(
                  localStrings?.GLobals?.Logout,
                  localStrings?.GLobals?.LogoutMessage,
                  [
                    { text: localStrings?.GLobals?.Cancel, style: 'cancel' },
                    { text: localStrings?.GLobals?.Logout, onPress: () => onLogout() },
                  ]
                )
              }}
            >
              <MaterialIcons name="logout" size={24} color={redError} />
              <Text style={{ color: redError, fontSize: 14, marginLeft: 10 }}>{localStrings?.GLobals?.Logout}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </ScrollView>
  )
}

export default ProfileScreen