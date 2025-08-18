import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* home tabs */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={1} />
          ),
        }}
      />
      {/* quiz tabs */}
      <Tabs.Screen
        name="quiz"
        options={{
          tabBarLabel: "Quiz",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={24} color={color} />
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
            <Ionicons name="briefcase" size={24} color={color} />
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
            <Ionicons name="person-circle-outline" size={30} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={1} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
