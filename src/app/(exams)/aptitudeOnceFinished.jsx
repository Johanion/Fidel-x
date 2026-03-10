import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import {
  Alert,
  BackHandler,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { supabase } from "../../lib/supabase.ts";
import * as FileSystem from "expo-file-system";

import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { selectedExamsSubject, selectedSpecificTime } from "../../atoms";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectedExamSpecifc } from "../../atoms";
import ErrorScreen from "../../services/ErrorScreen.jsx";
import LoadingScreen from "../../services/LoadingScreen.jsx";
import {generateGeminiResponse} from "../../API/SupabaseGeminiConfig.js"
import { selectedSubjectSpecificContent } from "../../atoms";

// ====================== PURE HELPER FUNCTIONS (OUTSIDE COMPONENT) ======================
const renderBoldText = (text) => {
  const str = typeof text === "string" ? text : "";
  const parts = str.split(/(\*\*.*?\*\*)/g);

  return (
    <Text>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={index} style={{ fontFamily: "Poppins-Bold" }}>
              {part.substring(2, part.length - 2)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const parsePassageText = (text) => {
  if (typeof text === "string" && text.startsWith("[") && text.endsWith("]")) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse passage JSON:", e);
      return [text]; // fallback to original text as array
    }
  }
  return [text]; // return as array for consistent mapping
};

// ====================== MEMOIZED QUESTION ITEM (FOR CONTENT QUESTIONS) ======================
const ContentQuestionItem = memo(
  ({
    item,
    index,
    selectedOptions,
    answersCorrect,
    expandedQuestions,
    result,
    onOptionPress,
    onToggleExpand,
    getOptionColor,
  }) => {
    return (
      <View style={styles.quizBox}>
        <View style={styles.question}>
          <Text style={{ fontFamily: "Poppins-Medium" }}>
            {index + 1}. {renderBoldText(item.question)}
          </Text>
        </View>
        {item.options.map((option, optionIndex) => (
          <View
            key={optionIndex}
            style={[
              styles.option,
              {
                backgroundColor: result
                  ? getOptionColor(item.id, optionIndex, item)
                  : "white",
              },
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
              activeOpacity={0.7}
              disabled={result}
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
              <Text style={{ fontFamily: "Poppins-Medium", marginLeft: 7 }}>
                {option}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {selectedOptions[item.id] !== undefined && result && (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 7,
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
              <View>
                <Text style={{ fontFamily: "Poppins-Light" }}>
                  {item.explanation}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  },
);

// ====================== MEMOIZED PASSAGE ITEM ======================
const PassageItem = memo(({ content, title, instruction }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.quizBox}>
        <Text
          style={{ fontFamily: "Poppins-Bold", fontSize: 18, marginBottom: 10 }}
        >
          {title}
        </Text>
        <Text style={{ fontFamily: "Regular" }}>
          <Text style={{ fontWeight: "bold" }}>Instruction: </Text>
          {instruction}
        </Text>
      </View>
      <View style={styles.quizBox}>
        {content.map((item, index) => {
          const paragraphs = parsePassageText(item.question || item.passage); // fallback to question if no passage
          return paragraphs.map((para, paraIndex) => (
            <Text
              key={`${index}-${paraIndex}`}
              style={{ fontFamily: "Poppins-Medium", marginBottom: 10 }}
            >
              {renderBoldText(para)}
            </Text>
          ));
        })}
      </View>
    </View>
  );
});

// ====================== MEMOIZED SECTION HEADER ======================
const SectionHeader = memo(({ title, instruction }) => {
  return (
    <View style={styles.quizBox}>
      <Text
        style={{ fontFamily: "Poppins-Bold", fontSize: 18, marginBottom: 10 }}
      >
        {title}
      </Text>
      <Text style={{ fontFamily: "Regular" }}>
        <Text style={{ fontWeight: "bold" }}>Instruction: </Text>
        {instruction}
      </Text>
    </View>
  );
});

// ====================== MAIN COMPONENT ======================
const AptitudeOnceFinished = () => {
  const queryClient = useQueryClient();
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [selectedSpecifc] = useAtom(selectedExamSpecifc);
  const [selectedTime] = useAtom(selectedSpecificTime);
  const tableName = selectedSpecifc; // e.g. "biology_2014"
  const totalTime = selectedTime;

  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [missedQuestions, setMissedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalTime); // 60 seconds
  const [score, setScore] = useState(0);
  const [showTime, setShowTime] = useState(false);
  const [visible, setVisible] = useState(false); // fixed typo
  const [result, setResult] = useState(false);

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
    (questionIndex, optionIndex, correctAnswer) => {
      setSelectedOptions((prev) => ({ ...prev, [questionIndex]: optionIndex }));

      const isCorrect = correctAnswer === optionIndex;

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

  const toggleExpand = useCallback((questionIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
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

  // ────── Final score calculation (memoized) ──────
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
      setScore(finalScore);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(true);
          setResult(true);
          setScore(finalScore);
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
      Alert.alert("Hold on, ", "Are you sure you want to go back?", [
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

  // ────── Data fetching ──────
  // const getExamQuestions = async (tableName) => {
  //   const { data, error } = await supabase.from(tableName).select("*");
  //   if (error) throw error;
  //   return data;
  // };

  // const {
  //   data: quiz,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["examQuestions", tableName],
  //   queryFn: () => getExamQuestions(tableName),
  // });

  // const handleRetry = () =>
  //   queryClient.invalidateQueries(["examQuestions", tableName]);
   
  // handle loading
  if (isContentLoading) return <LoadingScreen />;

  // ────── Memoized filtered sections ──────
  const sections = useMemo(
    () => [
      { type: "passage1", content: quiz.filter((r) => r.type === "passage1") },
      {
        type: "passageQ1",
        content: quiz.filter((r) => r.type === "passageQ1"),
      },
      { type: "passage2", content: quiz.filter((r) => r.type === "passage2") },
      {
        type: "passageQ2",
        content: quiz.filter((r) => r.type === "passageQ2"),
      },
      {
        type: "paragraph_comprehension",
        content: quiz.filter((r) => r.type === "paragraph_comprehension"),
      },
      { type: "logical", content: quiz.filter((r) => r.type === "logical") },
      { type: "analogy", content: quiz.filter((r) => r.type === "analogy") },
      { type: "unique", content: quiz.filter((r) => r.type === "unique") },
      { type: "synonym", content: quiz.filter((r) => r.type === "synonym") },
      { type: "antonym", content: quiz.filter((r) => r.type === "antonym") },
      { type: "maths", content: quiz.filter((r) => r.type === "maths") },
      {
        type: "sentence_completion",
        content: quiz.filter((r) => r.type === "sentence_completion"),
      },
    ],
    [quiz],
  );

  // ────── Memoized section info ──────
  const sectionInfo = useMemo(
    () => ({
      passageQ1: {
        title: "Passage 1 Questions",
        instruction: "Answer the questions based on the passage above.",
      },
      passageQ2: {
        title: "Passage 2 Questions",
        instruction: "Answer the questions based on the passage above.",
      },
      paragraph_comprehension: {
        title: "Paragraph Comprehension",
        instruction: "Read the paragraph and choose the best answer.",
      },
      logical: {
        title: "Logical Reasoning",
        instruction: "Choose the logically correct option.",
      },
      analogy: {
        title: "Analogy",
        instruction: "Choose the best analogous pair.",
      },
      unique: {
        title: "Odd One Out",
        instruction: "Identify the item that does not belong.",
      },
      synonym: {
        title: "Synonyms",
        instruction: "Choose the word with similar meaning.",
      },
      antonym: {
        title: "Antonyms",
        instruction: "Choose the word with opposite meaning.",
      },
      maths: {
        title: "Mathematics",
        instruction:
          "Solve the mathematical problem and choose the correct answer.",
      },
      sentence_completion: {
        title: "Sentence Completion",
        instruction: "Choose the best word or phrase to complete the sentence.",
      },
    }),
    [],
  );

  // ────── Memoized renderers ──────
  const renderers = useMemo(
    () => ({
      passage1: (content) => (
        <PassageItem
          content={content}
          title="Reading Passage 1"
          instruction="Below is the reading passage. Read the passage carefully before answering the questions that follow."
        />
      ),
      passage2: (content) => (
        <PassageItem
          content={content}
          title="Reading Passage 2"
          instruction="Below is the reading passage. Read the passage carefully before answering the questions that follow."
        />
      ),
      // Content questions
      passageQ1: (content) => (
        <>
          <SectionHeader {...sectionInfo.passageQ1} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      passageQ2: (content) => (
        <>
          <SectionHeader {...sectionInfo.passageQ2} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      paragraph_comprehension: (content) => (
        <>
          <SectionHeader {...sectionInfo.paragraph_comprehension} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      logical: (content) => (
        <>
          <SectionHeader {...sectionInfo.logical} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      analogy: (content) => (
        <>
          <SectionHeader {...sectionInfo.analogy} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      unique: (content) => (
        <>
          <SectionHeader {...sectionInfo.unique} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      synonym: (content) => (
        <>
          <SectionHeader {...sectionInfo.synonym} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      antonym: (content) => (
        <>
          <SectionHeader {...sectionInfo.antonym} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      maths: (content) => (
        <>
          <SectionHeader {...sectionInfo.maths} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
      sentence_completion: (content) => (
        <>
          <SectionHeader {...sectionInfo.sentence_completion} />
          {content.map((item, index) => (
            <ContentQuestionItem
              key={item.id || index}
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
          ))}
        </>
      ),
    }),
    [
      sectionInfo,
      selectedOptions,
      answersCorrect,
      expandedQuestions,
      result,
      handleOptionPress,
      toggleExpand,
      getOptionColor,
    ],
  );

  // ────── Stable renderItem ──────
  const renderSection = useCallback(
    ({ item: section }) => {
      if (section.content.length === 0) return null;
      const rendererFunction = renderers[section.type];
      return rendererFunction ? rendererFunction(section.content) : null;
    },
    [renderers],
  );

  // ────── Non-hook calculations ──────
  const total = selectedExam.exams[0].amount;
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / total;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
        "You are a helpful tutor. The user missed some quiz questions. " +
        "For each question, explain why their choice was wrong and explain the correct answer in more depth than the basic explanation provided.\n\n" +
        details
          .map(
            (item) =>
              `QUESTION: ${item.question}\nUSER CHOICE: "${item.userPicked}"\nCORRECT ANSWER: "${item.correctAnswer}"\nBASIC REASON: ${item.explanation}\nINSTRUCTIONS: Please explain to the user in detail why their choice doesn't fit and give a clear real-world example.\n\n`,
          )
          .join("");

      const result = await geminiModel.generateContent(prompt);
      setAiText(result.response.text());
    } catch (error) {
      console.error("AI Review Error:", error);
      setAiText("Sorry, I couldn't generate the review.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]}>
          {/* show score */}
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
                  onPress={() => setVisible(false)}
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
                <Text style={styles.aititle}>AI Response</Text>

                {aiLoading ? (
                  <ActivityIndicator size="large" />
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
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Poppins-SemiBold",
                        color: "white",
                        marginTop: 2,
                        marginLeft: 5,
                      }}
                    >
                      {showTime
                        ? `${selectedExam.name} ${selectedExam.exams[0].year}`
                        : formatTime(timeLeft)}
                    </Text>
                  </View>
                ),
                headerRight: () => (
                  <View
                    style={{
                      marginRight: 12,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {!showTime ? (
                      <TouchableOpacity
                        style={{ marginRight: 12 }}
                        activeOpacity={1}
                        onPress={() => setShowTime((prev) => !prev)}
                      >
                        <Ionicons name="time-outline" size={27} color="white" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ marginRight: 12 }}
                        activeOpacity={1}
                        onPress={() => setShowTime((prev) => !prev)}
                      >
                        <Ionicons
                          name="time-outline"
                          size={27}
                          color="white"
                          style={{ opacity: 0.3 }}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => setVisible(true)}>
                      <Ionicons name="document-text" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />

            {/* main exams list */}
            <FlatList
              data={sections}
              keyExtractor={(item) => item.type}
              renderItem={renderSection}
              // ────── PERFORMANCE PROPS ──────
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

export default AptitudeOnceFinished;

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  cancelBtn: {
    marginTop: 15,
    padding: 10,
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
  aicontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  aibtn: {
    backgroundColor: "#3A6DF0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  aibtnText: {
    color: "#fff",
    fontSize: 16,
  },
  aimodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  aimodalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  aititle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  aiText: {
    fontSize: 16,
    marginVertical: 10,
  },
});
