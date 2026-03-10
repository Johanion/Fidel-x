import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { router } from "expo-router";
import { themeAtom } from "../atoms.jsx";
import { useAtom } from "jotai";

const TrendingItem = ({ item }) => {
  const TELEGRAM_LINK = "https://t.me/fidelx1";
  const [theme, setTheme] = useAtom(themeAtom);
  
  return (
    <View style={{ marginHorizontal: 8, backgroundColor: "transparent" }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={() => {item.id !== "telegram"
            ? router.push(`/${item.id}`)
            : Linking.openURL(TELEGRAM_LINK).catch(() =>
                alert("Telegram not installed")
              );
        }}
      >
        <LinearGradient
          colors={theme === "dark" ? ["#1E243B", "#1E243B"] : [item.colors[0], item.colors[1], item.colors[2], item.colors[3], item.colors[4],]}
          style={styles.contents}
        >
          <Image
            source={item.image}
            style={{
              width: 100,
              height: 100,
              marginBottom: 30,
              alignSelf: "center",
            }}
            resizeMode="cover"
          />

          <Text style={{ fontFamily: "Poppins-Bold" }}>{item.text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const RenderingFeaturesCategories = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.$id} // ✅ now works because $id exists
      showsHorizontalScrollIndicator={false}
      horizontal
      renderItem={({ item }) => <TrendingItem item={item} />}
    />
  );
};

export default RenderingFeaturesCategories;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contents: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 30 },
    }),
  },
});
