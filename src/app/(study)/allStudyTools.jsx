import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom } from "jotai";
import { selectedSubject, selectedSubjectSpecificContent } from "../../atoms";

const AllStudyTools = () => {
  // ← Hooks called FIRST, unconditionally
  const [selectedSubjectValue] = useAtom(selectedSubject);
  const [selectedContent] = useAtom(selectedSubjectSpecificContent);

  // ← Early return AFTER hooks
  if (!selectedSubjectValue?.length) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#E0F2ED", "#FFFFFF"]} style={styles.gradient}>
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="book-open" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No subject selected</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const subject = selectedSubjectValue[0]?.subjectCode || "Unknown";
  const topicTitle = selectedContent?.title || "Topic";

  const studyTools = useMemo(
    () => [
      { title: "Introduction", icon: "info-circle", color: "#6d4c41", route: "./Introduction" },
      { title: "Read PDF", icon: "book-open", color: "#1976d2", route: "./readingPDF" },
      { title: "EUEE Past Exams", icon: "clipboard-check", color: "#388e3c", route: "./EUEE" },
      { title: "EUEE Practice Questions", icon: "pencil-alt", color: "#f57c00", route: "./EUEEPreparation" },
      { title: "Active Recall", icon: "brain", color: "#8e24aa", route: "./activeRecall" },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#E0F2ED", "#FFFFFF", "#F5FFFB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <FontAwesome5 name="graduation-cap" size={38} color="#239BA7" />
          </View>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <Text style={styles.headerSubtitle}>{subject} • {topicTitle}</Text>
          <View style={styles.headerUnderline} />
        </View>

        {/* Tools */}
        <View style={styles.listContainer}>
          {studyTools.map((tool) => (
            <TouchableOpacity
              key={tool.title}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push(tool.route)}
            >
              <LinearGradient
                colors={["#ffffff", "#f8fcfb"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: tool.color + "18" }]}>
                  <FontAwesome5 name={tool.icon} size={26} color={tool.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{tool.title}</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AllStudyTools;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  // Header
  header: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 10 },
    }),
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "#014421",
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#239BA7",
    marginTop: 4,
  },
  headerUnderline: {
    height: 3,
    width: 70,
    backgroundColor: "#239BA7",
    borderRadius: 2,
    marginTop: 10,
  },

  // List
  listContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
  },

  // Card
  card: {
    marginVertical: 11,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 14 },
      android: { elevation: 7 },
    }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#1a1a1a",
    lineHeight: 24,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#6b7280",
    marginTop: 16,
  },
});