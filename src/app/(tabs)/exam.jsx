// screens/exam.jsx
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import HorFeature from "../(exams)/horFeature.jsx";
import specificExam from "../../constants/specificExams";
import { useSetAtom } from "jotai";
import { selectedExamsSubject } from "../../atoms.jsx";
import GridBackground from "../../services/GridBackground.jsx";
import Exam from "../../constants/quizMetaData.js"

// YOUR ICONS + DATA
const examIcons = {
  Physics: {
    id: "1",
    name: "Physics",
    icon: "atom",
    color: "#f57c00",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.Physics,
  },
  Chemistry: {
    id: "2",
    name: "Chemistry",
    icon: "flask",
    color: "#1e88e5",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.Chemistry,
  },
  Biology: {
    id: "3",
    name: "Biology",
    icon: "leaf",
    color: "#43a047",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.Biology,
  },
  NaturalMathematics: {
    id: "4",
    name: "N.Maths",
    icon: "square-root-alt",
    color: "#8e24aa",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.NaturalMathematics,
  },
  English: {
    id: "5",
    name: "English",
    icon: "book",
    color: "#1565c0",
    gradient: ["#e0f2ed", "#b2e4e0"],
    exams: Exam.English,
  },
  Aptitude: {
    id: "6",
    name: "Aptitude",
    icon: "brain",
    color: "#239BA7",
    gradient: ["#e0f2ed", "#b2e4e0"],
    exams: Exam.Aptitude,
  },
  Geography: {
    id: "7",
    name: "Geography",
    icon: "globe-africa",
    color: "#00695C",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.Geography,
  },
  History: {
    id: "8",
    name: "History",
    icon: "landmark",
    color: "#5d4037",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.History,
  },
  SocialMathematics: {
    id: "9",
    name: "S.Maths",
    icon: "calculator",
    color: "#827717",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.SocialMathematics,
  },
  Economics: {
    id: "10",
    name: "Economics",
    icon: "chart-line",
    color: "#33691E",
    gradient: ["#e8f5e9", "#c8e6c9"],
    exams: Exam.Economics,
  },
};

// getting values of keys in examIcons
const examList = Object.values(examIcons);

const ExamScreen = () => {
  const setSelectedExam = useSetAtom(selectedExamsSubject);

  const handleSelection = (item) => {
    setSelectedExam({
      name: item.name,
      icon: item.icon,
      exams: item.exams,
    });
    router.push("../listOfExams");
  };
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

        {/* MAIN GRADIENT + CONTENT */}
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <FlatList
            data={examList}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={<HeaderSection />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleSelection(item)}
                style={styles.cardWrapper}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name={item.icon} size={40} color={item.color} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// HeaderSection — now with Animations
const HeaderSection = () => (
  <View style={styles.header}>
    {/* GRID BACKGROUND — FIRST = TRUE BACKGROUND */}
    <GridBackground size={40} color="rgba(255,255,255,0.05)" />
    {/* Hero Card */}

    {/* Section Title */}
    <Animatable.View animation="fadeInLeft" duration={600} delay={400}>
      <View style={styles.sectionTitle}>
        <View style={styles.titleBar} />
        <Text style={styles.sectionText}> English & Aptitude Tests</Text>
      </View>
    </Animatable.View>

    {/* Features */}
    <View style={styles.featuresWrapper}>
      <HorFeature data={specificExam} />
    </View>

    {/* Section Title */}
    <Animatable.View animation="fadeInLeft" duration={600} delay={400}>
      <View style={styles.sectionTitle}>
        <View style={styles.titleBar} />
        <Text style={styles.sectionText}>EUEE & Model Exams</Text>
      </View>
    </Animatable.View>
  </View>
);

export default ExamScreen;

// STYLES — CLEAN & PERFECT
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 120 },

  // Header
  header: { marginBottom: 24 },

  // Hero Card
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    height: 168,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: { elevation: 18 },
    }),
  },
  heroGradient: { flex: 1, flexDirection: "row", padding: 20 },
  iconSection: {
    width: 88,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.24)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,225,0,0.48)",
  },
  aiBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFE100",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.8,
    borderColor: "#fff",
  },
  aiBadgeText: { fontFamily: "Poppins-Black", fontSize: 10.5, color: "#000" },
  textSection: { flex: 1, marginLeft: 12, justifyContent: "center" },
  heroTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 19,
    color: "#fff",
    lineHeight: 26,
  },
  gold: { color: "#FFE100", fontFamily: "Poppins-Black" },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#FFE100",
  },

  // Features & Title
  featuresWrapper: { marginTop: 8, marginBottom: 12 },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  titleBar: {
    width: 6,
    height: 28,
    backgroundColor: "#FFE100",
    borderRadius: 4,
    marginRight: 12,
  },
  sectionText: { fontFamily: "Poppins-Black", fontSize: 22, color: "#014421" },

  // Cards
  cardWrapper: { flex: 1, padding: 8 },
  card: {
    width: 160,
    height: 160,
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
  cardTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
});
