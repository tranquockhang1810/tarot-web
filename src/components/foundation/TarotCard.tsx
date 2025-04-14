import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { TapGestureHandler } from "react-native-gesture-handler";

const CARD_WIDTH = 127;
const CARD_HEIGHT = 225;
const ARC_HEIGHT = 0;
const LIFT_HEIGHT = 30;

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
  const arcFactor = useSharedValue(
    -Math.sin((index / (totalCards - 1)) * Math.PI) * ARC_HEIGHT
  );

  // Kiểm tra xem lá bài có được chọn hay không
  const isLifted = selectedCard === index;

  // Khi nhấn vào lá bài
  const handlePress = () => {
    setSelectedCard(isLifted ? null : index);
  };

  // Cập nhật hiệu ứng động
  const animatedStyle = useAnimatedStyle(() => ({
    marginTop: arcFactor.value,
    transform: [{ translateY: withSpring(isLifted ? -LIFT_HEIGHT : 0) }],
  }));

  return (
    <TapGestureHandler onActivated={handlePress}>
      <Animated.View style={[styles.card, animatedStyle, { marginLeft: index === 0 ? 0 : -30 }]}>
        <Pressable onPress={handlePress}>
          <Image source={{ uri }} style={styles.image} />
        </Pressable>
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

export default TarotCard;
