import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const StydyLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="topics" options={{ headerShown: false }} />
      <Stack.Screen name="Introduction" options={{ headerShown: false }} />
      <Stack.Screen name="readingPDF" options={{ headerShown: false }} />
      <Stack.Screen name="EUEE" options={{ headerShown: false }} />
      <Stack.Screen name="EUEEPreparation" options={{ headerShown: false }} />
      <Stack.Screen name="studyTools" options={{ headerShown: false }} />
      <Stack.Screen name="activeRecall" options={{ headerShown: false }} />
      <Stack.Screen name="allStudyTools" options={{ headerShown: false }} />
    </Stack>
  );
};

export default StydyLayout;

const styles = StyleSheet.create({});
