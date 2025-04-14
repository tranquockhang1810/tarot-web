import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { ChatResponseModel } from '@/src/api/features/chat/models/ChatModel'
import { useAuth } from '@/src/context/auth/useAuth';
import useColor from '@/src/hooks/useColor';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal } from '@ant-design/react-native';

const ChatDetail = ({
  chatInfo,
  deleteChat,
  deleteLoading
}: {
  chatInfo: ChatResponseModel | null,
  deleteChat: (id: string) => void,
  deleteLoading: boolean
}) => {
  const { localStrings } = useAuth();
  const { brandPrimaryTap, orange, redError } = useColor();
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", paddingTop: 20 }}>{`${localStrings?.Create.Question}: "` + chatInfo?.question?.toUpperCase()}"</Text>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", paddingTop: 20 }}>
        {`${localStrings?.GLobals.Cards}: `}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap", paddingTop: 20 }}>
        {chatInfo && chatInfo?.cards?.map((card, index) => {
          return (
            <View
              key={index}
              style={{ alignItems: "center", justifyContent: "center", margin: 5 }}
            >
              <View
                style={{
                  width: 127,
                  height: 225,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: brandPrimaryTap,
                  borderRadius: 10,
                  borderWidth: card ? 3 : 0,
                  borderColor: "#fff",
                }}
              >
                <Image source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/card/${card?.toLowerCase().replaceAll(" ", "-")}.png` }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                />
              </View>
              <Text style={{ color: "white", fontSize: 14, marginTop: 5 }}>{card}</Text>
            </View>
          )
        })}
      </View>
      <TouchableOpacity
        style={{
          width: "100%",
          marginTop: 10,
          backgroundColor: redError,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          pointerEvents: deleteLoading ? 'none' : 'auto'
        }}
        onPress={() =>
          Modal.alert(
            localStrings?.GLobals?.Delete,
            localStrings?.GLobals?.DeleteChat,
            [
              { text: localStrings?.GLobals?.Cancel, style: 'cancel' },
              { text: localStrings?.GLobals?.Delete, onPress: () => { chatInfo?._id && deleteChat(chatInfo?._id) } },
            ]
          )
        }
      >
        {deleteLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, marginRight: 10, fontWeight: 'bold' }}>{localStrings?.GLobals?.Delete}</Text>
            <MaterialIcons name="delete" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ChatDetail