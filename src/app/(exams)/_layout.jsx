import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="listOfExams" options={{ headerShown: false }} />
      <Stack.Screen name="rightAway" options={{ headerTitle: "" }} />
      <Stack.Screen name="onceFinished" options={{ headerTitle: "" }} />
      <Stack.Screen name="rightAwayLatex" options={{ headerTitle: "" }} />
      <Stack.Screen name="onceFinishedLatex" options={{ headerTitle: "" }} />
    </Stack>
  );
};

export default _layout;
