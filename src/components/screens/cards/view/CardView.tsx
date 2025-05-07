"use client";
import { Button, Image, Spin } from "antd";
import CardViewModel from "../viewModel/CardViewModel";
import TarotCard from "@/components/foundation/TarotCard";
import { CARD_BACKGROUND } from "@/consts/ImgPath";
import { useAuth } from "@/context/auth/useAuth";
import { TbCards } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import useColor from "@/hooks/useColor";

const CardView = ({ id }: { id: string }) => {
  const { localStrings } = useAuth();
  const { brandPrimaryTap } = useColor();
  const {
    handlePlaceCard,
    placedCards,
    selectedCard,
    setSelectedCard,
    remainingCards,
    updateCards,
    cardsLoading,
  } = CardViewModel(id);

  return (
    <div className="h-screen text-white flex flex-col">
      {/* Nội dung chính */}
      {cardsLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-10 justify-between">
          <div className="flex flex-col flex-1 flex-wrap">
            {/* Khu vực 3 lá bài đã chọn */}
            <div className="flex flex-wrap justify-center gap-6 pt-10 h-1/2 md:h-2/3">
              {placedCards.map((card, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    onClick={() => handlePlaceCard(index)}
                    style={{ backgroundColor: brandPrimaryTap }}
                    className={`w-24 h-40 md:w-48 md:h-80 rounded-xl flex items-center justify-center cursor-pointer transition border-2 ${card ? "border-white" : "border-transparent"
                      }`}
                  >
                    {card ? (
                      <Image
                        src={card?.image}
                        alt={card?.name}
                        preview={false}
                        className="w-full h-full object-fit rounded-lg"
                      />
                    ) : (
                      <FaPlus size={30} color="white" />
                    )}
                  </div>
                  <p className="text-center text-sm">{card?.name}</p>
                </div>
              ))}

              {/* Nút Submit hoặc hướng dẫn */}
              <div className="text-center w-full">
                {placedCards.length === 3 && placedCards.every((card) => card !== null) ? (
                  <Button
                    type="primary"
                    size="large"
                    className="w-full max-w-md mx-auto flex items-baseline md:items-center justify-center gap-2"
                    onClick={updateCards}
                  >
                    {localStrings.GLobals.Submit}
                    <TbCards size={24} color="white" />
                  </Button>
                ) : (
                  <p className="text-gray-400 text-base">{localStrings?.Cards?.PickingNote}</p>
                )}
              </div>
            </div>
          </div>

          {/* Danh sách các lá bài chưa chọn */}
          {placedCards.some((card) => card === null) && (
            <div className="relative flex h-full overflow-x-auto overflow-y-hidden items-center">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CardView