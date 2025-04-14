import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Screen from '@/src/components/layout/Screen'
import NotificationViewModel from '../viewModel/NotificationViewModel'
import useColor from '@/src/hooks/useColor'
import { Ionicons, Octicons } from '@expo/vector-icons'
import { useAuth } from '@/src/context/auth/useAuth'

const NotificationScreen = () => {
  const {
    notifications, seenNoti,
    loadMoreNotifications,
  } = NotificationViewModel();
  const { brandPrimary, redError } = useColor();
  const { localStrings } = useAuth();

  return (
    <Screen
      header={() => (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{localStrings.Tabbar.Notification}</Text>
          <TouchableOpacity
            onPress={() => seenNoti()}
          >
            <Ionicons name="checkmark-done-sharp" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      headerBackgroundColor='none'
    >
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlatList
          data={notifications}
          style={{ marginBottom: 60 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index}
              style={{
                padding: 15,
                backgroundColor: brandPrimary,
                borderRadius: 10,
                marginBottom: 20,
                opacity: item.status ? 0.6 : 1,
              }}
              onPress={() => !item?.status && seenNoti(item?._id)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
                {!item.status && (
                  <Octicons
                    name="dot-fill"
                    size={20}
                    color={redError}
                  />
                )}
              </View>
              <Text style={{ color: "white" }}>{item.description}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?._id || ""}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreNotifications}
        />
      </View>
    </Screen>
  )
}

export default NotificationScreen