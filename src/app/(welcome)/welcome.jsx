// screens/OnboardingScreen.jsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const Slides = [
  {
    key: "1",
    title: "Master EUEE with Confidence",
    text: "Study Grade 9–12 chapters, practice real EUEE questions, and ace your exam.",
    icon: "graduation-cap",
    color: "#239BA7",
  },
  {
    key: "2",
    title: "Smart Practice & AI Feedback",
    text: "Take model exams, see answers instantly, and get AI-powered performance analysis.",
    icon: "brain",
    color: "#7c3aed",
  },
  {
    key: "3",
    title: "Active Recall Flashcards",
    text: "Memorize key concepts with spaced repetition — proven to boost retention.",
    icon: "clone",
    color: "#f59e0b",
  },
  {
    key: "4",
    title: "Stay Productive Every Day",
    text: "Use Pomodoro, To-Do lists, and schedule planner to study smarter, not harder.",
    icon: "clock",
    color: "#10b981",
  },
];

const OnboardingScreen = () => {
  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("../(auth)/login"); // or your login screen
  };

  const SkipNextButton = ({ ...props }) => (
    <TouchableOpacity style={styles.skipBtn} {...props}>
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );

  const NextButton = ({ ...props }) => (
    <TouchableOpacity style={styles.nextBtn} {...props}>
      <Text style={styles.nextText}>Next</Text>
    </TouchableOpacity>
  );

  const DoneButton = ({ ...props }) => (
    <TouchableOpacity style={styles.doneBtn} {...props} onPress={handleDone}>
      <Text style={styles.doneText}>Get Started</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E0F2ED", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Onboarding
        pages={Slides.map((slide) => ({
          backgroundColor: "transparent",
          image: (
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[slide.color + "20", slide.color + "10"]}
                style={styles.iconGradient}
              >
                <FontAwesome5 name={slide.icon} size={80} color={slide.color} />
              </LinearGradient>
            </View>
          ),
          title: (
            <Text style={styles.title}>{slide.title}</Text>
          ),
          subtitle: (
            <Text style={styles.subtitle}>{slide.text}</Text>
          ),
        }))}
        onDone={handleDone}
        onSkip={handleDone}
        SkipButtonComponent={SkipNextButton}
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        DotComponent={({ selected }) => (
          <View
            style={[
              styles.dot,
              selected ? styles.dotActive : styles.dotInactive,
            ]}
          />
        )}
        controlStatusBar={true}
        showSkip={true}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginHorizontal: 30,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    textAlign: "center",
    marginHorizontal: 40,
    marginTop: 16,
    lineHeight: 24,
  },

  // Buttons
  skipBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#666",
  },
  nextBtn: {
    backgroundColor: "#239BA7",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    marginRight: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  doneBtn: {
    backgroundColor: "#239BA7",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginRight: 20,
  },
  doneText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },

  // Dots
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: "#239BA7",
  },
  dotInactive: {
    backgroundColor: "#ddd",
  },
});