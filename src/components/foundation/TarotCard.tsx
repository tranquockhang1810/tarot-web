"use client";
import { Image } from "antd";

const CARD_WIDTH = 170;
const CARD_HEIGHT = 100;
const SPREAD_ANGLE = 15; // tổng góc xòe (cả trái và phải)
const SPREAD_DISTANCE = 60; // khoảng cách giữa các lá bài

interface TarotCardProps {
  index: number;
  uri: string;
  totalCards: number;
  selectedCard: number | null;
  setSelectedCard: (index: number | null) => void;
}

const TarotCard: React.FC<TarotCardProps> = ({
  index,
  uri,
  totalCards,
  selectedCard,
  setSelectedCard,
}) => {
  const isSelected = selectedCard === index;

  // Tính toán góc nghiêng và vị trí lệch
  const centerIndex = (totalCards - 1) / 2;
  const offsetIndex = index - centerIndex;
  const rotateAngle = (offsetIndex * SPREAD_ANGLE) / totalCards;
  const leftOffset = offsetIndex * SPREAD_DISTANCE;

  return (
    <div
      onClick={() => setSelectedCard(isSelected ? null : index)}
      className="absolute cursor-pointer transition-transform duration-300 hover:-translate-y-4"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        left: `50%`,
        transform: `translateX(${leftOffset}px)`,
        transformOrigin: "bottom center",
        zIndex: index, // đảm bảo lá sau đè lên lá trước
      }}
    >
      <Image
        src={uri}
        alt="tarot card"
        preview={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 10,
          border: isSelected ? "2px solid white" : "none",
        }}
      />
    </div>
  );
};

export default TarotCard;
