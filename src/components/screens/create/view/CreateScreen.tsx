import Screen from "@/src/components/layout/Screen";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard, KeyboardAvoidingView, Platform,
  ScrollView, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View
} from "react-native";
import CreateViewModel from "../viewModel/CreateViewModel";
import { Image } from "expo-image";
import { useAuth } from "@/src/context/auth/useAuth";
import { TopicsType } from "@/src/api/features/topic/models/TopicModel";
import useColor from "@/src/hooks/useColor";
import { showToast } from "@/src/utils/helper/SendMessage";
import Toast from "react-native-toast-message";
import { Button } from "@ant-design/react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const CreateScreen = () => {
  const { topics, resultObject, selectedTopic, setSelectedTopic, questionRef, handleCreateChat, createLoading } = CreateViewModel();
  const { localStrings } = useAuth();
  const { brandPrimary } = useColor();
  const scrollViewRef = useRef<ScrollView>(null);

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
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Chủ đề */}
            <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
              {localStrings.Create.ChooseTopic}
            </Text>
            <View style={{
              width: "100%", flexDirection: 'row', flexWrap: 'wrap',
              justifyContent: 'center', alignItems: 'center',
            }}>
              {topics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    height: 160,
                    width: "46%",
                    borderRadius: 20,
                    backgroundColor: topic?._id === selectedTopic?._id ? brandPrimary : undefined,
                    justifyContent: 'center',
                    marginBottom: "8%",
                    marginLeft: index % 2 !== 0 ? "8%" : 0
                  }}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT! + topic?.image}` }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    <Text style={{ color: 'white', marginTop: 5 }}>
                      {(localStrings.Topics as TopicsType)[topic?.code || ""]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Câu hỏi */}
            <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
              {localStrings.Create.Question}
            </Text>
            <TextInput
              style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
                minHeight: 50,
                backgroundColor: brandPrimary,
                color: "white",
                padding: 10,
                borderRadius: 5,
              }}
              placeholder={localStrings.Create.QuestionPlaceholder}
              placeholderTextColor="#ccc"
              multiline
              numberOfLines={2}
              onFocus={() => setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }, 200)}
              onChangeText={(value: string) => questionRef.current = value}
            />
            <Button
              type="primary"
              style={{ marginBottom: 100 }}
              onPress={handleCreateChat}
              loading={createLoading}
              disabled={createLoading}
            >
              {!createLoading && <View
                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: "white", marginRight: 5, fontSize: 16, fontWeight: "semibold" }}>{localStrings.Create.Now} {selectedTopic?.price || 0}</Text>
                <FontAwesome6 name="coins" size={20} color="yellow" />
              </View>}
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
        <Toast />
      </KeyboardAvoidingView>
    </Screen>
  );
}

export default CreateScreen;
