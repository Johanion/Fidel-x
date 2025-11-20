import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useSetAtom } from "jotai";
import { selectedSubject } from "../../src/atoms.jsx";
import { router } from "expo-router";

const subjectIcons = {
  Biology: { name: "dna", color: "#43a047", gradient: ["#e8f5e9", "#c8e6c9"] },
  Chemistry: {
    name: "flask",
    color: "#1e88e5",
    gradient: ["#e3f2fd", "#bbdefb"],
  },
  Physics: { name: "atom", color: "#f57c00", gradient: ["#fff3e0", "#ffe0b2"] },
  Mathematics: {
    name: "square-root-alt",
    color: "#8e24aa",
    gradient: ["#f3e5f5", "#e1bee7"],
  },
  Geography: {
    name: "globe-africa",
    color: "#2e7d32",
    gradient: ["#e8f5e9", "#c5e1a5"],
  },
  English: { name: "book", color: "#1565c0", gradient: ["#e3f2fd", "#bbdefb"] },
  History: {
    name: "landmark",
    color: "#795548",
    gradient: ["#efebe9", "#d7ccc8"],
  },
};

const RenderSubjects = ({ data }) => {
  const setSubject = useSetAtom(selectedSubject);

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={({ item, index }) => {
        const icon = subjectIcons[item.name] || {
          name: "book",
          color: "#555",
          gradient: ["#f5f5f5", "#e0e0e0"],
        };

        return (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setSubject(item.topic);
                router.push("../../(study)/topics");
              }}
            >
              <LinearGradient
                colors={icon.gradient}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name={icon.name} size={40} color={icon.color} />
                <Text style={styles.subjectText}>{item.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        );
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default RenderSubjects;

const styles = StyleSheet.create({
  card: {
    width: 130,
    height: 140,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  subjectText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
});
