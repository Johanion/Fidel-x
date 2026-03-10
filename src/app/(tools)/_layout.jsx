import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const ToolsLayout = () => {
  return (
    <Stack>pomodro
      <Stack.Screen name="Pomodro" options={{ headerShown: false }} />
      <Stack.Screen name="StudyGuide" options={{ headerShown: false }} />
      <Stack.Screen name="ToDoList" options={{ headerShown: false }} />
      <Stack.Screen name="PerfomanceRadar" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ToolsLayout;

const styles = StyleSheet.create({});
