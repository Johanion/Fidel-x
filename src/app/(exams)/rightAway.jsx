import { Text, View, FlatList, Platform, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BackHandler, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import Svg, { Circle } from "react-native-svg";
import { supabase } from "../../lib/supabase.ts";
import * as FileSystem from "expo-file-system";

import { selectedExamsSubject, selectedSpecificTime } from "../../atoms";
import { useState, useEffect, memo, useCallback } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectedExamSpecifc } from "../../atoms";
import LoadingScreen from "../../services/LoadingScreen.jsx";
import { selectedSubjectSpecificContent } from "../../atoms";
import {generateGeminiResponse} from "../../API/SupabaseGeminiConfig.js"
import { useAuth } from "../../providers/AuthProvider";

import {ErrorScreen} from "../../services/ErrorScreen.jsx"

// ====================== MEMOIZED QUESTION ITEM ======================
const QuestionItem = memo(
  ({
    item,
    index,
    selectedOptions,
    answersCorrect,
    expandedQuestions,
    finish,
    onOptionPress,
    onToggleExpand,
    getOptionColor,
  }) => {
    return (
      <View style={styles.quizBox}>
        <View style={styles.question}>
          <Text style={{ fontFamily: "Poppins-Medium" }}>
            {index + 1}. {item.question}
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
              style={{ flex: 1 }}
              onPress={() =>
                onOptionPress(item.id, optionIndex, item.correctAnswer)
              }
              disabled={selectedOptions[item.id] !== undefined || finish}
              activeOpacity={0.7}
            >
              <Text style={{ fontFamily: "Poppins-Medium" }}>{option}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {selectedOptions[item.id] !== undefined && (
          <>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
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
const RightAway = () => {
  const queryClient = useQueryClient();
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [selectedSpecifc] = useAtom(selectedExamSpecifc);
  const [selectedTime] = useAtom(selectedSpecificTime);

  const tableName = selectedSpecifc;
  const totalTime = selectedTime;

  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [missedQuestions, setMissedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [score, setScore] = useState(0);
  const [showTime, setShowTime] = useState(false);
  const [visible, setVisible] = useState(false);
  const [finish, setFinish] = useState(false);

  // AI states
  const [AiVisible, setAiVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  // downloaded file path states
    const [content] = useAtom(selectedSubjectSpecificContent);
    const [isContentLoading, setIsContentLoading] = useState(true)
    const [quiz, setQuiz] = useState([]);
    const [error, setError] = useState(null);
    const { session } = useAuth();
      console.log("sesisionssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", session);
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
  

  // ====================== HANDLERS ======================
  const handleOptionPress = useCallback(
    (questionIndex, optionIndex, correctAnswer) => {
      setSelectedOptions((prev) => ({ ...prev, [questionIndex]: optionIndex }));

      const isCorrect = correctAnswer === optionIndex;

      if (isCorrect) setScore((prev) => prev + 1);

      if (!isCorrect) {
        setMissedQuestions((prev) => ({
          ...prev,
          [questionIndex]: optionIndex,
        }));
      }

      setAnswersCorrect((prev) => ({ ...prev, [questionIndex]: isCorrect }));
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
    (questionIndex, optionIndex, item) => {
      let bgColor = "white";

      if (selectedOptions[questionIndex] === optionIndex) {
        bgColor = answersCorrect[questionIndex] ? "#4CAF50" : "#EF9A9A";
      }

      if (
        selectedOptions[questionIndex] !== undefined &&
        optionIndex === item.correctAnswer &&
        selectedOptions[questionIndex] !== item.correctAnswer
      ) {
        bgColor = "#4CAF50";
      }

      return bgColor;
    },
    [selectedOptions, answersCorrect],
  );

  // ====================== TIMER ======================
  useEffect(() => {
    if (totalTime <= 0) {
      setVisible(true);
      return;
    }

    setTimeLeft(totalTime);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime]);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // ====================== AI REVIEW ======================
  const createAiReviewPrompt = (details) => {
    let prompt =
      "You are a helpful tutor. The user missed some quiz questions. ";
    prompt +=
      "For each question, explain why their choice was wrong and explain the correct answer in more depth.\n\n";

    details.forEach((item) => {
      prompt += `QUESTION: ${item.question}\n`;
      prompt += `USER CHOICE: "${item.userPicked}"\n`;
      prompt += `CORRECT ANSWER: "${item.correctAnswer}"\n`;
      prompt += `BASIC REASON: ${item.explanation}\n\n`;
    });

    return prompt;
  };

  const handleReviewMistakes = async () => {
    setAiLoading(true);
    setAiVisible(true);
    setAiText("");

    try {
      const details = quiz
        .filter((q) => missedQuestions[q.id] !== undefined)
        .map((q) => {
          const parsedOptions =
            typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          const userChoiceIndex = missedQuestions[q.id];

          return {
            question: q.question,
            userPicked: parsedOptions[userChoiceIndex],
            correctAnswer: parsedOptions[q.correctAnswer],
            explanation: q.explanation,
          };
        });

      if (details.length === 0) {
        setAiText("Great job! You didn't miss any questions.");
        setAiLoading(false);
        return;
      }

      const finalPrompt = createAiReviewPrompt(details);
      const finalResult = await generateGeminiResponse(finalPrompt, session?.access_token);
      setAiText(finalResult.response.text());
    } catch (error) {
      console.log("AI Review Error:", error);
      setAiText("Sorry, I couldn't generate the review.");
    } finally {
      setAiLoading(false);
    }
  };

  // ====================== BACK BUTTON ======================
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on", "Are you sure you want to go back?", [
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

  // ====================== DATA FETCHING ======================
  // const {
  //   data: quiz,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["examQuestions", tableName],
  //   queryFn: () =>
  //     supabase
  //       .from(tableName)
  //       .select("*")
  //       .then(({ data, error }) => {
  //         if (error) throw error;
  //         return data;
  //       }),
  // });

  // handle loaidng screen

  const renderQuestion = useCallback(
    ({ item, index }) => (
      <QuestionItem
        item={item}
        index={index}
        selectedOptions={selectedOptions}
        answersCorrect={answersCorrect}
        expandedQuestions={expandedQuestions}
        finish={finish}
        onOptionPress={handleOptionPress}
        onToggleExpand={toggleExpand}
        getOptionColor={getOptionColor}
      />
    ),
    [
      selectedOptions,
      answersCorrect,
      expandedQuestions,
      finish,
      handleOptionPress,
      toggleExpand,
      getOptionColor,
    ],
  );
  
  // checking loading and error state
  if (isContentLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen errorMessage={error} onRetry={loadOfflineQuiz} />;

  const total = selectedExam?.exams[0]?.amount || 0;
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / total;
  const strokeDashoffset = circumference * (1 - progress);

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
                  <Text style={styles.scoreText}>{score}</Text>
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
                  onPress={() => {
                    setVisible(false);
                    setFinish(true);
                  }}
                >
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    setVisible(false);
                    router.back();
                  }}
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
                  <Text style={styles.aiText}>
                    {aiText || "No review available"}
                  </Text>
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
            {/* Header */}
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
                    {showTime
                      ? `${selectedExam.name} ${selectedExam.exams[0].year}`
                      : formatTime(timeLeft)}
                  </Text>
                ),
                headerRight: () => (
                  <View style={{ marginRight: 12, flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{ marginRight: 12 }}
                      onPress={() => setShowTime((prev) => !prev)}
                    >
                      <Ionicons name="time-outline" size={27} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                      <Ionicons name="document-text" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />

            {/* Main List */}
            <FlatList
              data={quiz}
              keyExtractor={(item) =>
                item.id?.toString() || Math.random().toString()
              }
              renderItem={renderQuestion}
              windowSize={5}
              maxToRenderPerBatch={10}
              initialNumToRender={8}
              updateCellsBatchingPeriod={50}
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

export default RightAway;

// ====================== STYLES ======================
const styles = StyleSheet.create({
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
      android: { elevation: 25 },
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
      android: { elevation: 25 },
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
      android: { elevation: 25 },
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
  scoreText: { fontSize: 36, fontWeight: "bold", color: "#4CAF50" },
  totalText: { fontSize: 18, color: "#777" },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  optionText: { color: "white", fontSize: 16, fontWeight: "600" },

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
  aiText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    paddingHorizontal: 10,
  },
});
