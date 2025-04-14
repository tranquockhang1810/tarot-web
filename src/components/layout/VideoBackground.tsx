import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";
import useColor from "@/src/hooks/useColor";
import { LOGIN_BACKGROUND_VIDEO } from "@/src/consts/ImgPath";

export default function VideoBackground({ children }: { children?: React.ReactNode }) {
  const videoRef = useRef<Video>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const { brandPrimaryDark } = useColor();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync().catch(error => console.error(error));
    }

    // Nếu sau 10 giây video chưa load thì tự động hiển thị children
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Loading Indicator nếu video chưa load và chưa hết timeout */}
      {!isVideoLoaded && !isTimeout && (
        <View style={{ ...styles.loadingContainer, backgroundColor: brandPrimaryDark }}>
          <ActivityIndicator size="large" color={"white"} />
        </View>
      )}

      {/* 🔹 Video background */}
      <Video
        ref={videoRef}
        source={{ uri: LOGIN_BACKGROUND_VIDEO }}
        style={StyleSheet.absoluteFillObject}
        isMuted
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
        onLoad={() => {
          setIsVideoLoaded(true);
          setIsTimeout(false);
        }}
      />

      {(isVideoLoaded || isTimeout) && children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  },
});
