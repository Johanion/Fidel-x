import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, Platform, Dimensions } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { themeAtom } from "../atoms.jsx";
import { useAtom, useSetAtom } from "jotai";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const TAB_BAR_HEIGHT = SCREEN_HEIGHT * 0.09; // 9% of screen height
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#43a047",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            position: "absolute", // Lift above the bottom
            paddingTop: 5,
            bottom: insets.bottom + 12, // Space from bottom
            marginHorizontal: 10,
            height: TAB_BAR_HEIGHT, // Taller for pill effect
            borderRadius: TAB_BAR_HEIGHT / 3, // Rounded corners
            backgroundColor: theme == "light" ? "#fff" : "#1E293B",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
              },
              android: {
                elevation: 10,
              },
            }),
          },
        }}
      >
        {/* home tabs */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="home"
                size={TAB_BAR_HEIGHT * 0.35}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} activeOpacity={1} />
            ),
          }}
        />
        {/* quiz tabs */}
        <Tabs.Screen
          name="exam"
          options={{
            tabBarLabel: "Exams",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="document-text-outline"
                size={TAB_BAR_HEIGHT * 0.35}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} activeOpacity={1} />
            ),
          }}
        />
        {/* tool kit */}
        <Tabs.Screen
          name="toolKit"
          options={{
            tabBarLabel: "Tool Kit",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="briefcase"
                size={TAB_BAR_HEIGHT * 0.35}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} activeOpacity={1} />
            ),
          }}
        />
        {/* profile */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "profile",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="person-circle-outline"
                size={TAB_BAR_HEIGHT * 0.35}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} activeOpacity={1} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
};

export default TabsLayout;
