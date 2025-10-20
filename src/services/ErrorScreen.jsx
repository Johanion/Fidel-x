import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ErrorScreen = ({
  errorMessage = "Something went wrong",
  onRetry,
  retryText = "Try Again",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="alert-circle-outline"
          size={60}
          color="red"
          style={styles.icon}
        />
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>{errorMessage}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,

    maxWidth: 400,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    fontFamily: "System", // Replace with custom font if available
  },
  message: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  retryButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "System",
  },
});

export default ErrorScreen;
