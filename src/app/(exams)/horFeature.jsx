// (exams)/horFeature.jsx
import React from "react";
import { FlatList, StyleSheet, Text, View, Platform, TouchableOpacity} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { selectedExamsSubject } from "../../atoms.jsx";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import * as FileSystem from "expo-file-system";

const HorFeature = ({ data }) => {
  const router = useRouter();
  const setSelectedExam = useSetAtom(selectedExamsSubject);
  const handleSelection = (item) => {
    setSelectedExam({
      name: item.name,
      exams: item.exams,
    });
    router.push("/listOfExams");
  };

  const HorFeatureItem = ({ item }) => {
    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity onPress={() => handleSelection(item)} activeOpacity={1}>
          <LinearGradient
            colors={["#FFFFFF", "#F8FCFB", "#E8F5F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Icon Circle */}
            <View style={styles.iconCircle}>
              <FontAwesome5
                name={item.icon || "book"}
                size={38}
                color="#239BA7"
              />
            </View>

            {/* Text Content */}
            <Text style={styles.typeText}>{item.type}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.$id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <HorFeatureItem item={item} />}
    />
  );
};

export default HorFeature;

// STYLES — CLEAN, MINIMAL, PROFESSIONAL, AESTHETIC
const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 3,
    paddingVertical: 2,
  },

  cardWrapper: {
    marginHorizontal: 10,
  },

  card: {
    width: 236,
    height: 170,
    borderRadius: 28,
    paddingVertical: 34,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6,
    borderColor: "rgba(35,155,167,0.12)",
    backgroundColor: "#fff",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 14,
      },
    }),
  },

  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#E0F2ED",

    ...Platform.select({
      ios: {
        shadowColor: "#239BA7",
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  badgeText: {
    fontFamily: "Poppins-Black",
    fontSize: 11,
    color: "#000",
    letterSpacing: 0.5,
  },

  typeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#239BA7",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#014421",
    textAlign: "center",
    lineHeight: 20,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#FFE100",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});
