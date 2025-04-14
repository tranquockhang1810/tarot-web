import { defaultCardRepo } from "@/src/api/features/card/CardRepo";
import { CardModel } from "@/src/api/features/card/models/CardModel";
import { defaultChatRepo } from "@/src/api/features/chat/ChatRepo";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useState, useCallback, useEffect } from "react";

const CardViewModel = (id: string) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [placedCards, setPlacedCards] = useState<(CardModel | null)[]>([null, null, null]);
  const [remainingCards, setRemainingCards] = useState<CardModel[]>([]);
  const { previous } = useLocalSearchParams();
  const [cardsLoading, setCardsLoading] = useState<boolean>(false);

  const handlePlaceCard = (slotIndex: number) => {
    if (selectedCard === null) return;
    if (placedCards.every((card) => card !== null)) return;

    const selectedCardObj = remainingCards[selectedCard];
    setRemainingCards((prev) => prev.filter((_, i) => i !== selectedCard));

    setPlacedCards((prev) => {
      const newPlacedCards = [...prev];
      newPlacedCards[slotIndex] = selectedCardObj;
      return newPlacedCards;
    });

    setSelectedCard(null);
  };

  const backAction = useCallback(() => {
    if (previous) {
      router.replace(previous as Href);
    } else {
      router.back();
    }
    return true;
  }, [previous]);

  const updateCards = async () => {
    try {
      console.log("placedCards", placedCards);
      
      const res = await defaultChatRepo.updateCard({
        id: id as string,
        cards: placedCards.map((card) => card?.name || ""),
      })
      if (res?.code === 200) {
        router.replace({
          pathname: `/(routes)/chat/${id}` as any,
          params: { previous: "/(tabs)/history" }
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  const getRandomCard = async () => {
    try {
      setCardsLoading(true);
      const res = await defaultCardRepo.getRandomCards();
      if (res?.data) {
        setRemainingCards(res?.data?.map((card: CardModel) => {
          return {
            ...card,
            image: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}${card?.image}`
          }
        }));
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setCardsLoading(false);
    }
  }

  useEffect(() => {
    getRandomCard();
  }, [id]);

  return {
    handlePlaceCard,
    backAction,
    updateCards,
    selectedCard, setSelectedCard,
    placedCards, setPlacedCards,
    remainingCards, setRemainingCards,
    cardsLoading
  }
}

export default CardViewModel