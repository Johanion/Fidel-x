import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

import GridBackground from "../../services/GridBackground";

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

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [stream, setStream] = useState("");
  const [grade, setGrade] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Focus states for inputs
  const [focusedInput, setFocusedInput] = useState(null);

  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  // if user has already login redirect to the main page
  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session, router]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
      if (hasSeen === "true") {
        setShowOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // if session is loading showing loading or activity indicator
  if (authLoading || session) {
    return (
      <LinearGradient
        colors={["#E0F2ED", "#FFFFFF"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#239BA7" />
      </LinearGradient>
    );
  }

  const signUpWithEmail = async () => {
    if (!email || !password || !fullName || !schoolName || !stream || !grade) {
      Alert.alert("Error", "make sure to insert all fields");
      return;
    }

    setLogLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) throw signUpError;
      if (!authData?.user) throw new Error("No user returned after sign-up.");

      // filling profile table automatically after signup
      const { error: profileError } = await supabase.from("profile").insert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        school_name: schoolName,
        stream,
        grade,
      });
    } catch (err) {
      Alert.alert("Sign-up failed", err.message ?? "Something went wrong.");
    } finally {
      setLogLoading(false);
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
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

  const inputFields = [
    {
      label: "Full Name",
      value: fullName,
      setValue: setFullName,
      icon: "person-outline",
      key: "name",
    },
    {
      label: "Email Address",
      value: email,
      setValue: setEmail,
      icon: "mail-outline",
      key: "email",
      keyboardType: "email-address",
    },
    {
      label: "Password",
      value: password,
      setValue: setPassword,
      icon: "lock-closed-outline",
      key: "password",
      secure: true,
    },
    {
      label: "School Name",
      value: schoolName,
      setValue: setSchoolName,
      icon: "school-outline",
      key: "school",
    },
    {
      label: "Stream (e.g., Social ,Natural)",
      value: stream,
      setValue: setStream,
      icon: "git-branch-outline",
      key: "stream",
    },
    {
      label: "Grade / Year",
      value: grade,
      setValue: setGrade,
      icon: "calendar-outline",
      key: "grade",
      keyboardType: "numeric",
    },
  ];

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

          <LinearGradient
            colors={["#E0F2ED", "#FFFFFF"]}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={styles.gradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Full-screen Grid Background */}
                <View style={StyleSheet.absoluteFill}>
                  <GridBackground />
                </View>

                {/* Logo & Title */}
                <View style={styles.header}>
                  <Text style={styles.logoText}>Fidel </Text>
                  <Text style={styles.logoSubText}>x</Text>
                </View>

                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join us and start learning smarter
                </Text>

                {/* Form Card */}
                <View style={styles.formCard}>
                  {inputFields.map((field) => (
                    <View
                      key={field.key}
                      style={[
                        styles.inputContainer,
                        focusedInput === field.key &&
                          styles.inputContainerFocused,
                      ]}
                    >
                      <Ionicons
                        name={field.icon}
                        size={20}
                        color={focusedInput === field.key ? "#239BA7" : "#666"}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder={field.label}
                        value={field.value}
                        onChangeText={field.setValue}
                        onFocus={() => setFocusedInput(field.key)}
                        onBlur={() => setFocusedInput(null)}
                        keyboardType={field.keyboardType || "default"}
                        secureTextEntry={field.secure}
                        autoCapitalize={field.key === "email" ? "none" : "words"}
                        placeholderTextColor="#999"
                      />
                    </View>
                  ))}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      logLoading && styles.submitButtonDisabled,
                    ]}
                    onPress={signUpWithEmail}
                    disabled={logLoading}
                  >
                    {logLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.loginLink}
                    onPress={() => router.push("/log-in")}
                  >
                    <Text style={styles.loginText}>
                      Already have an account?{" "}
                      <Text style={styles.loginHighlight}>Log in</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  // Onboarding styles
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

  // Signup styles
  gradient: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header & Logo
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 38,
    fontFamily: "Poppins-Bold",
    color: "#014421",
  },
  logoSubText: {
    fontSize: 38,
    fontFamily: "Poppins-Bold",
    color: "#FFE100",
    marginLeft: 4,
  },
  // Note: title and subtitle are overridden from onboarding, but since signup uses different sizes, it's fine as is (signup title is 28, onboarding 32)

  // Form Card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },

  // Input Group
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: "#239BA7",
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#1a1a1a",
    paddingVertical: 14,
  },

  // Submit Button
  submitButton: {
    backgroundColor: "#239BA7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  // Login Link
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#666",
  },
  loginHighlight: {
    color: "#239BA7",
    textDecorationLine: "underline",
  },
});