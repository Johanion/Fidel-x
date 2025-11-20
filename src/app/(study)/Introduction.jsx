// screens/OnboardingScreen.jsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

// ──────────────────────────────────────────────────────────────
// Slides – rich copy, FREE icons only
const Slides = [
  { 
    title: "Master EUEE with Confidence",
    text: "A study platform with notes from Grades 9–12, organized by related topics and chapters, with practice and EUEE exam questions.",
    icon: "graduation-cap",
    gradient: ["#E0F2ED", "#B2DFDB"],
    glow: "#239BA7",
  },
  {
    title: "Practice Like the Real Exam",
    text: "Take hundreds of EUEE & model exams. Instant answers + AI‑powered reports that show exactly where to improve.",
    icon: "clipboard-check",
    gradient: ["#E8F5E8", "#A5D6A7"], 
    glow: "#43A047",
  },
  {
    title: "Memorize with Active Recall",
    text: "Spaced‑repetition flashcards that adapt to you — proven to boost retention by 300%.",
    icon: "brain", // FREE & BEAUTIFUL
    gradient: ["#FFF8E1", "#FFCC80"], 
    glow: "#FFB300",
  },
  {
    title: "Study Smarter, Not Harder",
    text: "Pomodoro timer, daily to‑do lists, and planner to build habits that guarantee success.",
    icon: "hourglass-half",
    gradient: ["#E1F5FE", "#81D4FA"],
    glow: "#0288D1",
  },
];

// ──────────────────────────────────────────────────────────────
const OnboardingScreen = () => {
  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("../(auth)/login");
  };

  // ─────── Glass Orb (centered, animated) ───────
  const GlassOrb = ({ icon, color, delay = 0, size = 180 }) => {
    const float = new Animated.Value(0);

    useEffect(() => {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(float, {
            toValue: 1,
            duration: 2400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 2400,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }, [delay]);

    const y = float.interpolate({ inputRange: [0, 1], outputRange: [0, -24] });
    const scale = float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

    return (
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            shadowColor: color,
            transform: [{ translateY: y }, { scale }],
          },
        ]}
      >
        <LinearGradient
          colors={[color + "30", color + "05"]}
          style={styles.orbInner}
        >
          <FontAwesome5 name={icon} size={size === 180 ? 64 : 44} color={color} />
        </LinearGradient>
      </Animated.View>
    );
  };

  // ─────── Full‑Page Slide (centered icon + PERFECT text) ───────
  const FullPage = ({ title, text, icon, gradient, glow }) => (
    <View style={styles.page}>
      {/* Slide Gradient */}
      <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} />

      {/* Global Waves */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.waveA} />
        <View style={styles.waveB} />
      </View>

      {/* Centered Icon */}
      <View style={styles.iconCenter}>
        <GlassOrb icon={icon} color={glow} delay={0} size={190} />
        <GlassOrb icon={icon} color={glow} delay={800} size={120} />
      </View>

      {/* Perfectly Organized Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{text}</Text>
      </View>
    </View>
  );

  // ─────── Animated Progress Dots ───────
  const ProgressDot = ({ selected }) => {
    const w = new Animated.Value(selected ? 36 : 12);
    useEffect(() => {
      Animated.spring(w, { toValue: selected ? 36 : 12, useNativeDriver: false }).start();
    }, [selected]);

    return (
      <Animated.View
        style={[
          styles.dot,
          { width: w, backgroundColor: selected ? "#239BA7" : "#E0E0E0" },
        ]}
      />
    );
  };

  // ─────── Morphing Action Button ───────
  const ActionBtn = ({ isLast, ...props }) => (
    <TouchableOpacity
      style={[styles.actionBtn, isLast && styles.doneBtn]}
      activeOpacity={0.85}
      {...props}
    >
      <Text style={[styles.actionText, isLast && styles.doneText]}>
        {isLast ? "Get Started" : "Next"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2ED" />

      <View style={styles.container}>
        {/* Global Background Waves */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={["#E0F2ED", "#FFFFFF", "#F0FDF9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.waveGlobalA} />
          <View style={styles.waveGlobalB} />
        </View>

        <Onboarding
          pages={Slides.map((s) => ({
            backgroundColor: "transparent",
            image: <FullPage {...s} />,
          }))}
          onDone={handleDone}
          onSkip={handleDone}
          showSkip={false}
          bottomBarHighlight={false}
          containerStyles={{ paddingBottom: 110 }}
          DotComponent={ProgressDot}
          NextButtonComponent={(p) => <ActionBtn {...p} />}
          DoneButtonComponent={(p) => <ActionBtn isLast {...p} />}
        />
      </View>
    </>
  );
};

export default OnboardingScreen;

// ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // ─────── Global Waves ───────
  waveGlobalA: {
    position: "absolute",
    top: -180,
    left: -120,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: "rgba(35,155,167,0.07)",
    transform: [{ rotate: "22deg" }],
  },
  waveGlobalB: {
    position: "absolute",
    bottom: -200,
    right: -140,
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "rgba(3,169,244,0.05)",
    transform: [{ rotate: "-18deg" }],
  },

  // ─────── Full Page ───────
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  // ─────── Local Waves ───────
  waveA: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(255,255,255,0.12)",
    transform: [{ rotate: "15deg" }],
  },
  waveB: {
    position: "absolute",
    bottom: -120,
    right: -90,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "-12deg" }],
  },

  // ─────── Centered Icon ───────
  // ─────── Centered Icon (Orbs) ───────
iconCenter: {
  height: 300,
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: 50,
},
orb: {
  borderRadius: 999,
  justifyContent: "center",
  alignItems: "center",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.4,
  shadowRadius: 30,
  elevation: 24,
  position: "absolute",
  marginTop: 195
},
  orbInner: {
    width: "80%",
    height: "80%",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  // ─────── PERFECT TEXT LAYOUT ───────
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    maxWidth: width * 0.85,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: "Poppins-Regular",
    color: "#444",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 10,
  },

  // ─────── Action Button ───────
  actionBtn: {
    backgroundColor: "#239BA7",
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 34,
    minWidth: 120,
    alignItems: "center",
    shadowColor: "#239BA7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 14,
    margin:8,
  },
  doneBtn: {
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  actionText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
  },
  doneText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },

  // ─────── Progress Dots ───────
  dot: {
    height: 11,
    borderRadius: 6,
    marginHorizontal: 6,
  },
});