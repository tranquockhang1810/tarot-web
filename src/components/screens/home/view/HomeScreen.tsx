import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/src/context/auth/useAuth';
import { Button } from '@ant-design/react-native';
import Screen from '@/src/components/layout/Screen';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { Image, ImageBackground } from 'expo-image';
import { BANNER_CARDS, BANNER_HOMEPAGE, BANNER_HOROSCOPE } from '@/src/consts/ImgPath';
import useColor from '@/src/hooks/useColor';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const HomeScreen = () => {
  const { localStrings } = useAuth();
  const { brandPrimary } = useColor();
  const bounceValue = useSharedValue(0);

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 300 }),
        withTiming(2, { duration: 300 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }]
  }));

  return (
    <Screen>
      <View style={{ flex: 1, padding: 20 }}>
        <Image
          source={{ uri: BANNER_HOMEPAGE }}
          style={{
            width: '100%',
            aspectRatio: 3 / 2,
            borderRadius: 10,
            marginTop: 20,
            borderWidth: 3,
            borderColor: brandPrimary,
          }}
          contentFit="cover"
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 20,
          }}
        >
          <TouchableOpacity style={{ width: '48%' }}
            onPress={() => router.push({
              pathname: `/(routes)/horoscope/details`,
              params: {
                date: dayjs().format('YYYY-MM-DD')
              }
            })}
          >
            <ImageBackground
              source={{ uri: BANNER_HOROSCOPE }}
              style={{
                width: '100%',
                aspectRatio: 1 / 1,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: brandPrimary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Animated.View style={animatedStyle}>
                  <Text style={{
                    color: 'white',
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    {localStrings.Horoscope.Today}
                  </Text>
                </Animated.View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '48%' }} onPress={() => router.push('/(tabs)/create')}>
            <ImageBackground
              source={{ uri: BANNER_CARDS }}
              style={{
                width: '100%',
                aspectRatio: 1 / 1,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: brandPrimary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Animated.View style={animatedStyle}>
                  <Text style={{
                    color: 'white',
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    {"Tarot AI"}
                  </Text>
                </Animated.View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

export default HomeScreen