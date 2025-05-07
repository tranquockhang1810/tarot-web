import { defaultCardRepo } from "@/api/features/card/CardRepo";
import { CardModel } from "@/api/features/card/models/CardModel";
import { defaultChatRepo } from "@/api/features/chat/ChatRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

const CardViewModel = (id: string) => {
  const { setNewChatId } = useAuth();
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [placedCards, setPlacedCards] = useState<(CardModel | null)[]>([null, null, null]);
  const [remainingCards, setRemainingCards] = useState<CardModel[]>([]);
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

  const updateCards = async () => {
    try {
      const res = await defaultChatRepo.updateCard({
        id: id as string,
        cards: placedCards.map((card) => card?.name || ""),
      })
      if (res?.code === 200) {
        setNewChatId(id as string);
        router.push("/chat");
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
            image: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}${card?.image}`
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
    updateCards,
    selectedCard, setSelectedCard,
    placedCards, setPlacedCards,
    remainingCards, setRemainingCards,
    cardsLoading
  }
}

export default CardViewModel