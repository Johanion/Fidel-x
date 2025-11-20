import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute", // Lift above the bottom
          bottom: insets.bottom+12, // Space from bottom
          marginHorizontal:10,  
          height: 70, // Taller for pill effect
          borderRadius: 25, // Rounded corners
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarActiveTintColor: "#43a047",
        tabBarInactiveTintColor: "gray",
      }}
    >
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
        name="exam"
        options={{
          tabBarLabel: "Exams",
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
