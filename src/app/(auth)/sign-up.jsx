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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

import GridBackground from "../../services/GridBackground";
import * as Application from 'expo-application';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [stream, setStream] = useState("");
  const [grade, setGrade] = useState("");
  const [logLoading, setLogLoading] = useState(false);

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
      // filling device uuid table
      try {
        if (Platform.OS ==='android'){
          const uniquedId = Application.getAndroidId()
        } else if (Platform.OS ==='ios'){
          const uniqueId = await Application.getIosIdForVendorAsync();
        }
        const { error: deviceIdError } = await supabase
          .from("deviceUUID")
          .insert({
            id: authData.user.id,
            deviceID: uniqueId,
          });

        if (deviceIdError) {
          throw deviceIdError;
        }
      } catch (e) {
        const uniqueId = null; // iOS IDFV / Android ANDROID_ID
        const { error: deviceIdError } = await supabase
          .from("deviceUUID")
          .insert({
            id: authData.user.id,
            deviceID: uniqueId,
          });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Sign-up failed", err.message ?? "Something went wrong.");
    } finally {
      setLogLoading(false);
    }
  };

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
 console.log("sign uppppppppppppppppppppppppppppppppppp")
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

const styles = StyleSheet.create({
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
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#014421",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },

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
