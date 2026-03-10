import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BackHandler, Alert } from "react-native";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import Svg, { Circle } from "react-native-svg";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectedExamsSubject, selectedSpecificTime } from "../../atoms";
import { selectedExamSpecifc } from "../../atoms";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { router, Stack } from "expo-router";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system";

import LoadingScreen from "../../services/LoadingScreen.jsx";
import ErrorScreen from "../../services/ErrorScreen.jsx";
import {generateGeminiResponse} from "../../API/SupabaseGeminiConfig.js"
import MathRenderer from "../../services/MathRenderer.jsx";
import { selectedSubjectSpecificContent } from "../../atoms";

// ====================== MEMOIZED QUESTION ITEM ======================
const QuestionItem = memo(
  ({
    item,
    index,
    selectedOptions,
    answersCorrect,
    expandedQuestions,
    result, // true = review mode
    onOptionPress,
    onToggleExpand,
    getOptionColor,
  }) => {
    return (
      <View style={styles.quizBox}>
        <View style={styles.question}>
          <Text style={{ fontFamily: "Poppins-Medium" }}>
            {index + 1}. <MathRenderer latexContent={item.question} />
          </Text>
        </View>
        {item.options.map((option, optionIndex) => (
          <View
            key={optionIndex}
            style={[
              styles.option,
              { backgroundColor: getOptionColor(item.id, optionIndex, item) },
            ]}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                onOptionPress(item.id, optionIndex, item.correctAnswer)
              }
              disabled={result} // ← no more changes after finish
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  selectedOptions[item.id] === optionIndex
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={24}
                color="#1E88E5"
              />
              <Text style={{ fontFamily: "Poppins-Medium", marginLeft: 8 }}>
                {option}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Explanation - only in review mode */}
        {result && selectedOptions[item.id] !== undefined && (
          <>
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => onToggleExpand(item.id)}>
                <Text style={{ fontFamily: "Poppins-Black" }}>Explanation</Text>
              </TouchableOpacity>
              <Ionicons
                name={
                  expandedQuestions[item.id] ? "chevron-up" : "chevron-down"
                }
                size={20}
                color="#333"
              />
            </View>
            {expandedQuestions[item.id] && (
              <Text style={{ fontFamily: "Poppins-Light", marginTop: 8 }}>
                {item.explanation}
              </Text>
            )}
          </>
        )}
      </View>
    );
  },
);

// ====================== MAIN COMPONENT ======================
const OnceFinishedLatex = () => {
  const queryClient = useQueryClient();
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [selectedSpecifc] = useAtom(selectedExamSpecifc);
  const [selectedTime] = useAtom(selectedSpecificTime);

  const tableName = selectedSpecifc;
  const totalTime = 10; // for testing

  // ────── All state ──────
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [missedQuestions, setMissedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState(false); // true = review mode

  // AI states
  const [AiVisible, setAiVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");

 // downloaded file path states
  const [content] = useAtom(selectedSubjectSpecificContent);
  const [isContentLoading, setIsContentLoading] = useState(true)
  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState(null);

    const loadOfflineQuiz = async () => {
      if (!content) {
        setError("No exams found. Please download content first.");
        setIsContentLoading(false);
        return;
      }
  
      try {
        // FIXED: DO NOT ADD ".json" AGAIN — IT'S ALREADY THERE!
        const fileInfo = await FileSystem.getInfoAsync(content);
        if (!fileInfo.exists) {
          console.log("File does NOT exist at path:");
          setError("Exam file missing. Please re-download the topic.");
          setIsContentLoading(false);
          return;
        }

        setIsContentLoading(true);
        const fileContent = await FileSystem.readAsStringAsync(
          content
        );
        const data = JSON.parse(fileContent);
        
        // Support both formats: { questions: [...] } or direct array
        const questions = Array.isArray(data)
          ? data
          : data.questions || data.items || [];

        if (questions.length === 0) {
          setError("No questions in file. Try re-downloading.");
        } else {
          setQuiz(questions);
        }
        setIsContentLoading(false);
      } catch (err) {
        console.log("Read error:", err);
        setError("Failed to load exam. Try re-downloading content.");
        setIsContentLoading(false);
      }
    };
  
    useEffect(() => {
      loadOfflineQuiz();
    }, [content]);


  // ────── Stable handlers ──────
  const handleOptionPress = useCallback(
    (questionID, optionIndex, correctAnswer) => {
      setSelectedOptions((prev) => ({ ...prev, [questionID]: optionIndex }));

      const isCorrect = correctAnswer === optionIndex;

      if (isCorrect) setScore((prev) => prev + 1);

      if (!isCorrect) {
        setMissedQuestions((prev) => ({ ...prev, [questionID]: optionIndex }));
      }

      setAnswersCorrect((prev) => ({ ...prev, [questionID]: isCorrect }));
    },
    [],
  );

  const toggleExpand = useCallback((questionID) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionID]: !prev[questionID],
    }));
  }, []);

  const getOptionColor = useCallback(
    (questionID, optionIndex, item) => {
      let bgColor = "white";

      if (selectedOptions[questionID] === optionIndex) {
        bgColor = answersCorrect[questionID] ? "#4CAF50" : "#EF9A9A";
      }

      if (
        selectedOptions[questionID] !== undefined &&
        optionIndex === item.correctAnswer &&
        selectedOptions[questionID] !== item.correctAnswer
      ) {
        bgColor = "#4CAF50";
      }

      return bgColor;
    },
    [selectedOptions, answersCorrect],
  );

  // ────── Final score calculation (only once when exam ends) ──────
  const finalScore = useMemo(() => {
    if (!quiz || !Array.isArray(quiz)) return 0;
    return quiz.reduce((acc, q) => {
      return acc + (selectedOptions[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  }, [quiz, selectedOptions]);

  // ────── Timer ──────
  useEffect(() => {
    setTimeLeft(totalTime);

    if (totalTime <= 0) {
      setVisible(true);
      setResult(true);
      setScore(finalScore); // ← calculate once
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(true);
          setResult(true);
          setScore(finalScore); // ← calculate once
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime, finalScore]);

  // ────── Back button ──────
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        { text: "Cancel", style: "cancel" },
        { text: "YES", onPress: () => router.back() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const total = selectedExam.exams[0].amount;
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = finalScore / total;
  const strokeDashoffset = circumference * (1 - progress);

  // ────── Stable renderItem ──────
  const renderQuestion = useCallback(
    ({ item, index }) => (
      <QuestionItem
        item={item}
        index={index}
        selectedOptions={selectedOptions}
        answersCorrect={answersCorrect}
        expandedQuestions={expandedQuestions}
        result={result}
        onOptionPress={handleOptionPress}
        onToggleExpand={toggleExpand}
        getOptionColor={getOptionColor}
      />
    ),
    [
      selectedOptions,
      answersCorrect,
      expandedQuestions,
      result,
      handleOptionPress,
      toggleExpand,
      getOptionColor,
    ],
  );

  // checking loading and error state
  if (isContentLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen errorMessage={error} onRetry={loadOfflineQuiz} />;
  

  // ────── AI Review ──────
  const handleReviewMistakes = async () => {
    setAiLoading(true);
    setAiVisible(true);
    setAiText("");

    try {
      const details = quiz
        .filter((q) => missedQuestions[q.id] !== undefined)
        .map((q) => {
          const parsed =
            typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          return {
            question: q.question,
            userPicked: parsed[missedQuestions[q.id]],
            correctAnswer: parsed[q.correctAnswer],
            explanation: q.explanation,
          };
        });

      if (details.length === 0) {
        setAiText("Great job! You didn't miss any questions.");
        setAiLoading(false);
        return;
      }

      const prompt =
        `You are a helpful tutor. Explain why the user's choice was wrong and give a clear explanation.\n\n` +
        details
          .map(
            (d) =>
              `Q: ${d.question}\nUser: ${d.userPicked}\nCorrect: ${d.correctAnswer}\nBasic: ${d.explanation}\n\n`,
          )
          .join("");

      const finalResult = await generateGeminiResponse(finalPrompt);
      setAiText(finalResult.response.text());
    } catch (e) {
      setAiText("Sorry, I couldn't generate the review.");
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]}>
          {/* Score Modal */}
          <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.container}>
                <Svg width={size} height={size}>
                  <Circle
                    stroke="#eee"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  <Circle
                    stroke="#4CAF50"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                  />
                </Svg>

                <View style={styles.textContainer}>
                  <Text style={styles.scoreText}>{finalScore}</Text>
                  <Text style={styles.totalText}>/ {total}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 20,
                  width: "100%",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={[styles.optionBtn, { backgroundColor: "gray" }]}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.optionText}>Done</Text>
                </TouchableOpacity>

                {Object.keys(missedQuestions).length > 0 && (
                  <TouchableOpacity
                    style={[styles.optionBtn, { backgroundColor: "#2196F3" }]}
                    onPress={() => {
                      setVisible(false);
                      handleReviewMistakes();
                    }}
                  >
                    <Text style={styles.optionText}>AI Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>

          {/* AI Review Modal */}
          <Modal
            isVisible={AiVisible}
            onBackdropPress={() => setAiVisible(false)}
            backdropOpacity={0.7}
          >
            <View style={styles.aimodalContainer}>
              <View style={styles.aimodalContent}>
                <Text style={styles.aititle}>AI Tutor Review</Text>
                {aiLoading ? (
                  <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                  <Text style={styles.aiText}>{aiText}</Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    { backgroundColor: "#222", marginTop: 20 },
                  ]}
                  onPress={() => setAiVisible(false)}
                >
                  <Text style={styles.optionText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View>
            <Stack.Screen
              options={{
                headerStyle: { backgroundColor: "#3b5998" },
                headerTintColor: "#fff",
                headerLeft: () => (
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-SemiBold",
                      color: "white",
                      marginLeft: 5,
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={() => setVisible(true)}>
                    <Ionicons name="document-text" size={24} color="white" />
                  </TouchableOpacity>
                ),
              }}
            />

            <FlatList
              data={quiz}
              keyExtractor={(item) =>
                item.id?.toString() || Math.random().toString()
              }
              renderItem={renderQuestion}
              windowSize={5}
              maxToRenderPerBatch={10}
              initialNumToRender={8}
              removeClippedSubviews={Platform.OS === "android"}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OnceFinishedLatex;

// ====================== STYLES ======================
const styles = StyleSheet.create({
  // ... (keep all your existing styles exactly the same)
  quizBox: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 25,
      },
    }),
  },

  question: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 10,
    padding: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 25,
      },
    }),
  },

  option: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 13,
    padding: 13,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 0.4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 25,
      },
    }),
  },

  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  totalText: {
    fontSize: 18,
    color: "#777",
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  aimodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  aimodalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
  },
  aititle: { fontSize: 22, fontFamily: "Poppins-Bold", marginBottom: 15 },
  aiText: { fontSize: 16, lineHeight: 24, textAlign: "left" },
});
