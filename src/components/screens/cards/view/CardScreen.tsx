import React, { } from "react";
import { Image } from "expo-image";
import { View, Text, ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import TarotCard from "@/src/components/foundation/TarotCard";
import Screen from "@/src/components/layout/Screen";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useColor from "@/src/hooks/useColor";
import { Button } from "@ant-design/react-native";
import { useAuth } from "@/src/context/auth/useAuth";
import CardViewModel from "../viewModel/CardViewModel";
import { CARD_BACKGROUND } from "@/src/consts/ImgPath";

const CardScreen = ({ id }: { id: string | string[] }) => {
  const { localStrings } = useAuth();
  const { brandPrimaryTap } = useColor();
  const chatID = Array.isArray(id) ? id[0] : id;
  const {
    backAction,
    handlePlaceCard,
    placedCards,
    selectedCard, setSelectedCard,
    remainingCards,
    updateCards,
    cardsLoading
  } = CardViewModel(chatID);

  return (
    <Screen
      header={() => (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{ height: 30 }}
            onPress={() => {
              backAction();
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ height: 30, alignItems: "center" }}>
            <Text style={{ color: "white", lineHeight: 30, fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
              {localStrings?.Cards?.PickingCards}
            </Text>
          </View>
          <View style={{ height: 30, width: 30 }}></View>
        </View>
      )}
    >
      <>
        {cardsLoading ? (
          <ActivityIndicator size="large" color="white" style={{ marginVertical: 30 }} />
        ) : (
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
            {/* Các ô chứa bài được chọn */}
            <View style={{ paddingHorizontal: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap", paddingTop: 20 }}>
                {placedCards.map((card, index) => (
                  <View
                    key={index}
                    style={{ alignItems: "center", justifyContent: "center", margin: 5 }}
                  >
                    <Pressable
                      onPress={() => handlePlaceCard(index)}
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
                      {card ? (
                        <Image source={{ uri: card.image }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 5,
                          }}
                        />
                      ) : (
                        <Feather name="plus" color="white" size={30} />
                      )}
                    </Pressable>
                    <Text style={{ color: "white", fontSize: 14, marginTop: 5 }}>{card?.name}</Text>
                  </View>
                ))}
              </View>

              {/* Hướng dẫn */}
              <View>
                {placedCards.length === 3 && placedCards.every((card) => card !== null) ? (
                  <Button
                    type="primary"
                    style={{
                      width: "100%",
                      marginTop: 10,
                    }}
                    onPress={updateCards}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ color: "white", marginRight: 5, fontSize: 16, fontWeight: "semibold" }}>{localStrings.GLobals.Submit}</Text>
                      <MaterialCommunityIcons size={28} name="cards-playing-outline" color={"white"} />
                    </View>
                  </Button>
                ) : (
                  <Text style={{ color: "white", marginTop: 10, textAlign: "center", fontSize: 14 }}>
                    {localStrings?.Cards?.PickingNote}
                  </Text>
                )}
              </View>
            </View>

            {/* Danh sách bài */}
            {placedCards.some((card) => card === null) && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginBottom: 0
                }}
              >
                {remainingCards.map((_, index) => (
                  <TarotCard
                    key={index}
                    index={index}
                    uri={CARD_BACKGROUND}
                    totalCards={remainingCards.length}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </>
    </Screen>
  );
};

export default CardScreen;
