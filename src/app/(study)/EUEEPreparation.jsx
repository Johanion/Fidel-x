// screens/EUEEPreparation.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Svg, Circle } from "react-native-svg";
import * as FileSystem from "expo-file-system";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import { router, Stack } from "expo-router";

import { selectedSubjectSpecificContent } from "../../atoms";
import LoadingScreen from "../../services/LoadingScreen.jsx";
import ErrorScreen from "../../services/ErrorScreen.jsx";

const EUEEPreparation = () => {
  const [content] = useAtom(selectedSubjectSpecificContent);
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [finish, setFinish] = useState(false);

  // Load quiz from local JSON file (OFFLINE)
  useEffect(() => {
    const loadOfflineQuiz = async () => {
      try {
        if (!content?.preparationUri) {
          throw new Error("No offline data. Please download first.");
        }

        const fileContent = await FileSystem.readAsStringAsync(content.preparationUri);
        const data = JSON.parse(fileContent);

        // Support both array and { questions: [...] }
        const questions = Array.isArray(data) ? data : data.questions || [];
        setQuiz(questions);
        setIsLoading(false);
      } catch (err) {
        console.log("Load error:", err);
        setError("Failed to load exam. Try re-downloading.");
        setIsLoading(false);
      }
    };

    loadOfflineQuiz();
  }, [content?.preparationUri]);

  const toggleExpand = (i) => {
    setExpandedQuestions(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const handleOptionPress = (qIndex, optIndex) => {
    if (selectedOptions[qIndex] !== undefined) return;

    setSelectedOptions(prev => ({ ...prev, [qIndex]: optIndex }));
    const isCorrect = quiz[qIndex].correctAnswer === optIndex;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswersCorrect(prev => ({ ...prev, [qIndex]: isCorrect }));
  };

  // Prevent accidental exit
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit Exam?", "Your progress will be saved.", [
        { text: "Stay", style: "cancel" },
        { text: "Leave", onPress: () => router.back() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Score circle
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = quiz.length > 0 ? score / quiz.length : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const getOptionColor = (qIndex, optIndex) => {
    if (selectedOptions[qIndex] === undefined) return "rgba(35,155,167,0.08)";
    if (selectedOptions[qIndex] === optIndex) {
      return answersCorrect[qIndex] ? "#4CAF50" : "#FF5252";
    }
    if (optIndex === quiz[qIndex].correctAnswer) return "#4CAF50";
    return "rgba(35,155,167,0.08)";
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen errorMessage={error} onRetry={() => router.back()} />;
  if (!quiz || quiz.length === 0) return <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>No questions found.</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E0F2ED", "#FFFFFF"]} style={styles.background}>
        
        {/* Score Modal */}
        <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.circle}>
              <Svg width={size} height={size}>
                <Circle stroke="#e0e0e0" fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
                <Circle
                  stroke="#4CAF50"
                  fill="none"
                  cx={size/2} cy={size/2} r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  originX={size/2}
                  originY={size/2}
                />
              </Svg>
              <View style={styles.scoreText}>
                <Text style={styles.scoreNumber}>{score}</Text>
                <Text style={styles.totalText}>/ {quiz.length}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 20, marginTop: 30 }}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: "#666" }]} 
                onPress={() => { setVisible(false); setFinish(true); }}
              >
                <Text style={styles.btnText}>Review Answers</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: "#239BA7" }]} 
                onPress={() => router.back()}
              >
                <Text style={styles.btnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Header */}
        <LinearGradient
          colors={["#239BA7", "#1A7F8A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="scroll" size={28} color="#FFE100" />
            </View>
            <Text style={styles.headerTitle}>EUEE Past Exam</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Ionicons name="stats-chart" size={26} color="#FFE100" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Questions */}
        <FlatList
          data={quiz}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animatable.View animation="fadeInUp" duration={400} delay={index * 50}>
              <View style={styles.card}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>Q{index + 1}</Text>
                  <Text style={styles.questionText}>{item.question}</Text>
                </View>

                {item.options?.map((opt, optIdx) => (
                  <TouchableOpacity
                    key={optIdx}
                    style={[styles.option, { backgroundColor: getOptionColor(index, optIdx) }]}
                    onPress={() => handleOptionPress(index, optIdx)}
                    disabled={selectedOptions[index] !== undefined || finish}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedOptions[index] === optIdx && { color: "white" }
                    ]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}

                {selectedOptions[index] !== undefined && (
                  <View style={styles.explanation}>
                    <TouchableOpacity 
                      style={styles.expandBtn} 
                      onPress={() => toggleExpand(index)}
                    >
                      <Text style={styles.expandText}>Show Explanation</Text>
                      <Ionicons 
                        name={expandedQuestions[index] ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#239BA7" 
                      />
                    </TouchableOpacity>
                    {expandedQuestions[index] && (
                      <Animatable.View animation="fadeIn" duration={300}>
                        <Text style={styles.explanationText}>
                          {item.explanation || "No explanation provided."}
                        </Text>
                      </Animatable.View>
                    )}
                  </View>
                )}

                <View style={styles.cardAccent} />
              </View>
            </Animatable.View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color="#aaa" />
              <Text style={styles.emptyText}>No questions available</Text>
            </View>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EUEEPreparation;

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
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 18 },
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

  // Options
  option: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 6,
  },
  optionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#333",
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

  // Modal
  modal: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
    maxWidth: 320,
    alignSelf: "center",
  },
  circle: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    position: "absolute",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  totalText: {
    fontSize: 18,
    color: "#777",
    marginTop: -8,
  },
  modalBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  // Empty
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