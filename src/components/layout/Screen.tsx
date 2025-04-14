import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import useColor from '@/src/hooks/useColor';

const Screen = ({
  children,
  style,
  backgroundColor,
  header,
  headerBackgroundColor,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  header?: () => React.JSX.Element;
  headerBackgroundColor?: string;
}) => {
  const { brandPrimaryDark, brandPrimaryTap } = useColor();

  return (
    <View
      style={StyleSheet.flatten([
        {
          flex: 1,
          backgroundColor: backgroundColor || brandPrimaryDark,
          paddingTop: header ? 0 : 30,
        },
        style,
      ])}
    >
      {header && <View style={{ ...styles.header, backgroundColor: headerBackgroundColor || brandPrimaryTap }}>{header()}</View>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
});

export default Screen;
