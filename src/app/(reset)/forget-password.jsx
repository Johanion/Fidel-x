import React, { useState } from "react";
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
import GridBackground from "../../services/GridBackground";

export default function ResetPassword() {
  const [step, setStep] = useState("email"); // email | otp | password | success
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const router = useRouter();

  // Step 1: Send code
  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;

      Alert.alert(
        "Code Sent!",
        "Check your email (including your spam folder). It may take 2 to 10 minutes to arrive.",
      );

      setStep("otp");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "recovery",
      });

      if (error) throw error;
      setStep("password");
    } catch (err) {
      Alert.alert("Invalid Code", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update password
  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setStep("success");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === "otp") setStep("email");
    if (step === "password") setStep("otp");
  };

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
          {/* FIXED BACKGROUND - moved outside ScrollView */}
          <View style={StyleSheet.absoluteFill}>
            <GridBackground />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60} // ← Smooth keyboard on Android
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Logo & Title */}
              <View style={styles.header}>
                <Text style={styles.logoText}>Fidel </Text>
                <Text style={styles.logoSubText}>x</Text>
              </View>

              <Text style={styles.title}>
                {step === "email" && "Reset your Password"}
                {step === "otp" && "Enter 6-Digit Code"}
                {step === "password" && "Set New Password"}
                {step === "success" && "Password Updated!"}
              </Text>

              <Text style={styles.subtitle}>
                {step === "email" && "sign in and start learning smarter"}
                {step === "otp" && `We sent a code to ${email}`}
                {step === "password" && "Choose a strong new password"}
                {step === "success" &&
                  "You can now login with your new password"}
              </Text>

              <View style={styles.formCard}>
                {/* EMAIL STEP */}
                {step === "email" && (
                  <View>
                    <View
                      style={[
                        styles.inputContainer,
                        focusedInput === "email" &&
                          styles.inputContainerFocused,
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={focusedInput === "email" ? "#239BA7" : "#666"}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        loading && styles.submitButtonDisabled,
                      ]}
                      onPress={handleSendCode}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.submitButtonText}>Send Code</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* OTP STEP */}
                {step === "otp" && (
                  <View>
                    <TouchableOpacity
                      onPress={goBack}
                      style={styles.backButton}
                    >
                      <Ionicons name="arrow-back" size={24} color="#014421" />
                    </TouchableOpacity>

                    <View style={styles.otpContainer}>
                      <TextInput
                        style={styles.otpInput} // ← now smaller & balanced
                        placeholder="123456"
                        value={otpCode}
                        onChangeText={setOtpCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="center"
                        autoFocus
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        loading && styles.submitButtonDisabled,
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.submitButtonText}>Verify Code</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* PASSWORD STEP */}
                {step === "password" && (
                  <View>
                    <TouchableOpacity
                      onPress={goBack}
                      style={styles.backButton}
                    >
                      <Ionicons name="arrow-back" size={24} color="#014421" />
                    </TouchableOpacity>

                    {/* New Password */}
                    <View
                      style={[
                        styles.inputContainer,
                        focusedInput === "new" && styles.inputContainerFocused,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={focusedInput === "new" ? "#239BA7" : "#666"}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        onFocus={() => setFocusedInput("new")}
                        onBlur={() => setFocusedInput(null)}
                        secureTextEntry={!showNewPass}
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPass(!showNewPass)}
                        style={{ padding: 8 }}
                      >
                        <Ionicons
                          name={showNewPass ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View
                      style={[
                        styles.inputContainer,
                        focusedInput === "confirm" &&
                          styles.inputContainerFocused,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={focusedInput === "confirm" ? "#239BA7" : "#666"}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setFocusedInput("confirm")}
                        onBlur={() => setFocusedInput(null)}
                        secureTextEntry={!showConfirmPass}
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPass(!showConfirmPass)}
                        style={{ padding: 8 }}
                      >
                        <Ionicons
                          name={
                            showConfirmPass ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        loading && styles.submitButtonDisabled,
                      ]}
                      onPress={handleUpdatePassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.submitButtonText}>
                          Update Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* SUCCESS STEP */}
                {step === "success" && (
                  <View style={styles.successContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={80}
                      color="#239BA7"
                    />
                    <Text style={styles.successTitle}>Password Updated!</Text>
                    <Text style={styles.successText}>
                      You can now login with your new password.
                    </Text>

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={async () => {
                        try {
                          // 1️⃣ Sign the user out from Supabase
                          await supabase.auth.signOut();

                          // 2️⃣ Redirect to login page
                          router.replace("/log-in");
                        } catch (err) {
                          console.error("Sign out failed:", err);
                          Alert.alert(
                            "Error",
                            "Failed to sign out. Try again.",
                          );
                        }
                      }}
                    >
                      <Text style={styles.submitButtonText}>Go to Login</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
    paddingBottom: 60, // extra space for keyboard
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoText: { fontSize: 38, fontFamily: "Poppins-Bold", color: "#014421" },
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
  inputContainerFocused: { borderColor: "#239BA7", backgroundColor: "#fff" },
  inputIcon: { marginRight: 12 },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#1a1a1a",
    paddingVertical: 14,
  },

  submitButton: {
    backgroundColor: "#239BA7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    padding: 12,
  },
  submitButtonDisabled: { backgroundColor: "#aaa" },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    padding: 8,
  },

  // OTP - now perfectly sized
  backButton: { alignSelf: "flex-start", marginBottom: 20 },
  otpContainer: { marginBottom: 24 },
  otpInput: {
    fontSize: 32, // ← reduced from 42
    fontFamily: "Poppins-Bold",
    letterSpacing: 10,
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: "#239BA7",
  },

  resendButton: { marginTop: 20, alignItems: "center" },
  resendText: { color: "#239BA7", fontFamily: "Poppins-Medium", fontSize: 15 },

  successContainer: { alignItems: "center", paddingVertical: 20 },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#014421",
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
});
