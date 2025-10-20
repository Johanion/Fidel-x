import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

import { useAtom, useSetAtom } from "jotai";
import { selectedSubject, selectedSubjectSpecificContent } from "../../atoms";

import topics from "../../constants/topics";
import studyTools from "../../constants/allStudyTools";

const allStudyTools = () => {
  const [selectedSubjectValue] = useAtom(selectedSubject);
  const [selectedSubjectSpecificContentValue] = useAtom(
    selectedSubjectSpecificContent
  );

  const data = ["", " ", "", "", ""];

  console.log("selected", selectedSubjectSpecificContentValue);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#444852ff", "#3b5998", "#192f6a"]}
        style={{ flex: 1 }}
      >
        {/* option 1 */}
        <TouchableOpacity style={styles.card} onPress={() =>router.push("./Introduction")}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name="book" size={24} color="#007bff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Introuduction</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* option 2 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("./readingPDF")}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name="book" size={24} color="#007bff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>read</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* option 3  */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("./EUEE")}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name="book" size={24} color="#007bff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>EUEE exams</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* option 4 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("./EUEEPreparations")}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name="book" size={24} color="#007bff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>EUEE practice questions</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* option 5 */}
        <TouchableOpacity style={styles.card} onPress={() => router.push("./activeRecall")}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon name="book" size={24} color="#007bff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>active recall</Text>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default allStudyTools;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
});
