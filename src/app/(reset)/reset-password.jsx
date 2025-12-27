// In a dedicated screen: app/reset-password-form.js
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Alert, StyleSheet, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GridBackground from "../../services/GridBackground";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [logLoading, setLogLoading] = useState(false);

  const router = useRouter();
  // const url = Linking.getInitialURL();
  // console.log("URL", url);
  // if (url) {
  //   const { hostname, path, queryParams } = Linking.parse(url);
  //   console.log(
  //     `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
  //       queryParams
  //     )}`
  //   );
  // }

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // Call updateUser() - this works because the user is currently
    // authenticated via the password recovery session token.
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert("Update Failed", error.message);
    } else {
      Alert.alert(
        "Success!",
        "Your password has been updated. Please sign in with your new password."
      );
      // Log out the user from the temporary recovery session and redirect to login
      await supabase.auth.signOut();
      router.replace("/(auth)/log-in.jsx");
    }
  };

  const inputFields = [
    {
      label: "new password",
      value: newPassword,
      setValue: setNewPassword,
      icon: "lock-closed-outline",
      key: "password",
      secure: true,
    },
    {
      label: "confirm new password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      icon: "lock-closed-outline",
      key: "password",
      secure: true,
    },
  ];

  useEffect(() => {
    async function checkAndSetSession() {
      // ... (rest of your logic to handle loading state) ...

      console.log("CORRECT WAY: Use await inside the async function to get the string value");
      const initialUrl = await Linking.getInitialURL(); // <-- Use await here
      console.log("Captured URL STRING:", initialUrl);
  
    }
    checkAndSetSession();
  }, []);

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

              <Text style={styles.title}>change your password</Text>
              <Text style={styles.subtitle}>
                sign in and start learning smarter
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
                  onPress={handleUpdatePassword}
                  disabled={logLoading}
                >
                  {logLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>change password</Text>
                  )}
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
