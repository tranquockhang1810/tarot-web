import { useAuth } from '@/src/context/auth/useAuth';
import { useMessage } from '@/src/context/socket/useMessage';
import useColor from '@/src/hooks/useColor';
import { Badge } from '@ant-design/react-native';
import { MaterialCommunityIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const TabBar = () => {
  const { brandPrimaryTap, brandPrimaryDark, redError } = useColor();
  const { localStrings } = useAuth();
  const { haveUnreadMessages, unreadNotification } = useMessage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: brandPrimaryDark,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: brandPrimaryTap,
          borderColor: brandPrimaryDark,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: localStrings.Tabbar.Home,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <FontAwesome size={30} name="home" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: localStrings.Tabbar.History,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Badge dot={haveUnreadMessages} styles={{ dot: { backgroundColor: redError } }}>
                <Entypo size={30} name="chat" color={color} />
              </Badge>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <View style={{ ...styles.createButton, backgroundColor: brandPrimaryTap }}>
              <MaterialCommunityIcons size={45} name="cards-playing-outline" color={color} />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props as any} style={styles.createButtonWrapper}>
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: localStrings.Tabbar.Notification,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Badge dot={unreadNotification > 0} styles={{ dot: { backgroundColor: redError } }}>
                <FontAwesome size={28} name="bell" color={color} />
              </Badge>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: localStrings.Tabbar.Profile,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <FontAwesome size={30} name="user" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    borderWidth: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    top: -5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  createButtonWrapper: {
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default TabBar;
