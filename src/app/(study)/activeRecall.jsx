// screens/ActiveRecallScreen.jsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as FileSystem from "expo-file-system";
import { useAtom } from "jotai";
import { selectedSubjectSpecificContent } from "../../atoms";

export default function ActiveRecallScreen() {
  const [quiz, setQuiz] = useState([]);
  const [content] = useAtom(selectedSubjectSpecificContent);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add useCallback to imports
  const loadOfflineQuiz = useCallback(async () => {
    if (!content?.flashcardsUri) {
      setError("No flashcards found.");
      setIsLoading(false);
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(content.flashcardsUri);
      if (!fileInfo.exists) {
        setError("File missing. Please re-download.");
        setIsLoading(false);
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(
        content.flashcardsUri,
      );

      // SAFE PARSING
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (e) {
        setError("Data corrupted. Please re-download.");
        setIsLoading(false);
        return;
      }

      const questions = Array.isArray(data) ? data : data.questions || [];
      setQuiz(questions);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load.");
      setIsLoading(false);
    }
  }, [content?.flashcardsUri]);

  useEffect(() => {
    loadOfflineQuiz();
  }, [content?.flashcardsUri]);

  const toggleExpand = (index) => {
    setExpandedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          style={styles.background}
        >
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#239BA7" />
            <Text style={styles.loadingText}>Loading flashcards...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          style={styles.background}
        >
          <View style={styles.error}>
            <Ionicons name="alert-circle" size={48} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setIsLoading(true);
                setError(null);
                loadOfflineQuiz();
              }}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E0F2ED", "#FFFFFF"]} style={styles.background}>
        {/* Header */}
        <LinearGradient
          colors={["#239BA7", "#1A7F8A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="brain" size={28} color="#FFE100" />
            </View>
            <Text style={styles.headerTitle}>Flashcards</Text>
          </View>
          <Text style={styles.questionCount}>{quiz.length} Questions</Text>
        </LinearGradient>

        {/* Quiz List */}
        <FlatList
          data={quiz}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Q{index + 1}</Text>
                <Text style={styles.questionText}>{item.question}</Text>
              </View>

              <View style={styles.explanation}>
                <TouchableOpacity
                  style={styles.expandBtn}
                  onPress={() => toggleExpand(index)}
                >
                  <Text style={styles.expandText}>
                    {expandedQuestions[index] ? "Hide Answer" : "Show answer"}
                  </Text>
                  <Ionicons
                    name={
                      expandedQuestions[index] ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color="#239BA7"
                  />
                </TouchableOpacity>

                {expandedQuestions[index] && (
                  <Text style={styles.explanationText}>
                    {item.explanation || item.answer || "No answer provided."}
                  </Text>
                )}
              </View>

              <View style={styles.cardAccent} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color="#aaa" />
              <Text style={styles.emptyText}>No flashcards available</Text>
            </View>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

/* -------------------------------------------------
   STYLES – CLEAN & PROFESSIONAL
   ------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },

  // Header
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2.5,
    borderColor: "rgba(255,225,0,0.45)",
  },
  headerTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 22,
    color: "#fff",
  },
  questionCount: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#FFE100",
  },

  list: { padding: 16 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "rgba(35,155,167,0.15)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: { elevation: 14 },
    }),
  },
  questionHeader: { marginBottom: 12 },
  questionNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#239BA7",
    marginBottom: 6,
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#014421",
    lineHeight: 24,
  },

  // Explanation
  explanation: { marginTop: 12 },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(35,155,167,0.08)",
    padding: 12,
    borderRadius: 16,
  },
  expandText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#239BA7",
  },
  explanationText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14.5,
    color: "#333",
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 4,
  },

  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#239BA7",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // States
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#239BA7",
    marginTop: 16,
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#239BA7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#aaa",
    marginTop: 16,
  },
});
