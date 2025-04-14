import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "@/src/components/layout/Screen";
import { useAuth } from "@/src/context/auth/useAuth";
import useColor from "@/src/hooks/useColor";
import MyInput from "@/src/components/foundation/MyInput";
import ChatViewModel from "../viewModel/ChatViewModel";
import { showToast } from "@/src/utils/helper/SendMessage";
import { Image } from "expo-image";
import { GetRemainingDay } from "@/src/utils/helper/DateTransfer";
import Toast from "react-native-toast-message";
import { renderFormattedMessage } from "@/src/utils/helper/MessageFormat";
import ChatDetail from "./detail/ChatDetail";

const ChatScreen = ({ id }: { id: string | string[] }) => {
  const { localStrings, language } = useAuth();
  const { violet, brandPrimaryTap, brandPrimary } = useColor();
  const chatID = Array.isArray(id) ? id[0] : id;
  const {
    resultObject,
    messages, isConnected,
    input, setInput,
    handleSend,
    loadOlderMessages,
    chatInfo,
    updateMessageSeen,
    backAction,
    detailShow, setDetailShow,
    deleteLoading, deleteChat
  } = ChatViewModel(chatID);

  const header = () => {
    const { createdDate, remaining } = GetRemainingDay(chatInfo?.createdAt, localStrings, language);
    return (
      <View style={{ flexDirection: "row", alignItems: "center", minHeight: 40 }}>
        <TouchableOpacity
          style={{ height: 30 }}
          onPress={() => {
            if (detailShow) setDetailShow(false);
            else {
              backAction();
              updateMessageSeen(chatID);
            }
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
        {detailShow ? (
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", height: 30 }}>{localStrings.GLobals.Options}</Text>
          </View>
        ) : (
          <>
            {!chatInfo ? null : (
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT! + chatInfo?.topic?.image}` }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                  <View style={{ flexDirection: "column", justifyContent: "space-between", marginLeft: 10 }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{createdDate}</Text>
                    {chatInfo?.status ? (
                      <Text style={{ color: "white", opacity: 0.6, fontSize: 12 }}>
                        {remaining}
                      </Text>
                    ) : (
                      <Text style={{ color: "white", opacity: 0.6, fontSize: 12 }}>
                        {localStrings?.GLobals?.Closed}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={{ height: 30 }} onPress={() => setDetailShow(true)}>
                  <MaterialIcons name="menu" size={30} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    )
  };

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
    <Screen header={header}>
      <>
        {detailShow ? (
          <ChatDetail chatInfo={chatInfo} deleteChat={deleteChat} deleteLoading={deleteLoading}/>
        ) : (
          <>
            <FlatList
              data={messages}
              style={{ marginBottom: chatInfo && chatInfo?.status ? 80 : 20, paddingHorizontal: 10 }}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <Text style={[
                    styles.message,
                    item.senderType === "user" ? styles.userMessage : styles.aiMessage,
                    { backgroundColor: item.senderType === "user" ? violet : brandPrimary }
                  ]}
                  >
                    {renderFormattedMessage(item.message)}
                  </Text>
                )
              }}
              inverted
              onEndReached={loadOlderMessages}
              onEndReachedThreshold={0.1}
            />
            {chatInfo && chatInfo?.status && (
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ ...styles.inputContainer, backgroundColor: brandPrimaryTap }}
              >
                <View style={{ ...styles.inputWrapper, backgroundColor: brandPrimaryTap }}>
                  <MyInput
                    style={styles.textInput}
                    value={input}
                    onChangeText={setInput}
                    placeholder={localStrings.Chat.EnterMessage}
                    placeholderTextColor={"#fff"}
                    inputStyle={{ color: "white" }}
                    multiline
                    variant="borderless"
                  />
                  {isConnected && input.trim() !== "" && (
                    <TouchableOpacity
                      style={{ ...styles.sendButton }}
                      onPress={handleSend}
                    >
                      <MaterialIcons
                        name="send"
                        size={20}
                        color={"white"}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <Toast />
              </KeyboardAvoidingView>
            )}
          </>
        )}
      </>
    </Screen>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 2,
    color: "white"
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  aiMessage: {
    alignSelf: "flex-start",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
