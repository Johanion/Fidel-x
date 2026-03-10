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
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { supabase } from "../../lib/supabase.ts";
import * as FileSystem from "expo-file-system";

import { useEffect, useState } from "react";
import { selectedExamsSubject, selectedSpecificTime } from "../../atoms";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectedExamSpecifc } from "../../atoms";
import LoadingScreen from "../../services/LoadingScreen.jsx";
import {generateGeminiResponse} from "../../API/SupabaseGeminiConfig.js"
import { selectedSubjectSpecificContent } from "../../atoms";

const EnglishRightAway = () => {
  const queryClient = useQueryClient();
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [selectedSpecifc] = useAtom(selectedExamSpecifc);
  const [selectedTime] = useAtom(selectedSpecificTime);
  const tableName = selectedSpecifc; // e.g. "biology_2014"
  const totalTime = selectedTime;

  const [questionNumber, setQuestionNumber] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(100); // 60 seconds
  const [score, setScore] = useState(0);
  const [showTime, setShowTime] = useState(false);
  const [visible, setVisisble] = useState(false);
  const [finish, setFinish] = useState(false);
  
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
  
  // count down time
  useEffect(() => {
    if (timeLeft === 0) {
      setVisisble(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [timeLeft]);

  // setting time once
  // useEffect(()=>{
  //    setTimeLeft(totalTime);
  // },[])

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // explanation toggle
  const toggleExpand = (questionIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex], // toggle only this question
    }));
  };

  const handleOptionPress = (questionIndex, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
    const selectedQuestion = quiz.find((r) => r.id === questionIndex);
    const isAnswerCorrect = selectedQuestion.correctAnswer === optionIndex;
    {
      isAnswerCorrect && setScore((prev) => prev + 1);
    }

    setAnswersCorrect((prev) => ({
      ...prev,
      [questionIndex]: isAnswerCorrect,
    }));
  };

  // preventing accidental touch of back button
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on, ", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => router.back() }, // or navigation.goBack()
      ]);
      return true; // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // score variables
  const total = selectedExam.exams[0].amount;
  const size = 150; // circle diameter
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = score / total; // fraction of total score
  const strokeDashoffset = circumference * (1 - progress);

  // getting background color for options
  const getOptionColor = (questionIndex, optionIndex, item) => {
    // default white
    let bgColor = "white";

    // If user selected this option
    if (selectedOptions[questionIndex] === optionIndex) {
      if (answersCorrect[questionIndex]) {
        bgColor = "#4CAF50"; // ✅ correct selection
      } else {
        bgColor = "#EF9A9A"; // ❌ wrong selection
      }
    }

    // Always show the correct one green if they missed it
    if (
      selectedOptions[questionIndex] !== undefined &&
      optionIndex === item.correctAnswer &&
      selectedOptions[questionIndex] !== item.correctAnswer
    ) {
      bgColor = "#4CAF50";
    }

    return bgColor;
  };

  // getting the exam from supabase database
  // console.log("Selected table:", tableName);

  // const {
  //   data: quiz,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["examQuestions", tableName],
  //   queryFn: () => getExamQuestions(tableName),
  // });

  // // Function to retry the query
  // const handleRetry = () => {
  //   queryClient.invalidateQueries(["examQuestions", tableName]);
  // };

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  // if (error) {
  //   return (
  //     <ErrorScreen
  //       errorMessage={error.message || "failed to load exam question"}
  //       onRetry={handleRetry}
  //     />
  //   );
  // }

  // if (!quiz) {
  //   return <Text>No quiz data found.</Text>;
  // }

  // create a fuction which parse ** ** markdown bold
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

  // Function to parse potential JSON in passage text
  const parsePassageText = (text) => {
    if (
      typeof text === "string" &&
      text.startsWith("[") &&
      text.endsWith("]")
    ) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse passage JSON:", e);
        return [text]; // fallback to original text as array
      }
    }
    return [text]; // return as array for consistent mapping
  };

  /********************************  renderingContentQuestions ******************************************/
  const renderContentQuestions = (content, sectionTitle, instructionText) => (
    <View>
      <View style={styles.quizBox}>
        <Text
          style={{ fontFamily: "Poppins-Bold", fontSize: 18, marginBottom: 10 }}
        >
          {sectionTitle}
        </Text>
        <Text style={{ fontFamily: "Regular" }}>
          <Text style={{ fontWeight: "bold" }}>Instruction: </Text>
          {instructionText}
        </Text>
      </View>
      {content.map((item, index) => (
        <View key={item.id || index}>
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
                    backgroundColor: getOptionColor(item.id, optionIndex, item),
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    handleOptionPress(item.id, optionIndex);
                  }}
                  activeOpacity={0.7}
                  disabled={selectedOptions[item.id] !== undefined || finish}
                >
                  <Text style={{ fontFamily: "Poppins-Medium" }}>{option}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* explanation toggle */}

            {selectedOptions[item.id] !== undefined && (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 7,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <Text style={{ fontFamily: "Poppins-Black" }}>
                      Explanation
                    </Text>
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
        </View>
      ))}
    </View>
  );

  /****************************** Define rendering functions for each type *******************************/
  const renderers = {
    /*********************** passage 1 ***************************/
    passage1: (content) => (
      <View style={{ flex: 1 }}>
        {/* section title and instruction */}
        <View style={styles.quizBox}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Reading Passage 1
          </Text>
          <Text style={{ fontFamily: "Regular" }}>
            <Text style={{ fontWeight: "bold" }}>Instruction: </Text>
            Below is the reading passage. Read the passage carefully before
            answering the questions that follow.
          </Text>
        </View>
        <View style={styles.quizBox}>
          {content.map((item, index) => {
            const paragraphs = item.passage;
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
    ),

    /*********************** passage question 1 ***************************/
    passageQ1: (content) =>
      renderContentQuestions(
        content,
        "Passage 1 Questions",
        "Answer the following questions based on Reading Passage 1. Choose the best alternative from the four options provided for each question.",
      ),

    /*********************** passage 2 ***************************/
    passage2: (content) => (
      <View style={{ flex: 1 }}>
        {/* section title and instruction */}
        <View style={styles.quizBox}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Reading Passage 2
          </Text>
          <Text style={{ fontFamily: "Regular" }}>
            <Text style={{ fontWeight: "bold" }}>Instruction: </Text>
            Below is the reading passage. Read the passage carefully before
            answering the questions that follow.
          </Text>
        </View>
        <View style={styles.quizBox}>
          {content.map((item, index) => {
            const paragraphs = item.passage;
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
    ),

    /*********************** passage question 2 ***************************/
    passageQ2: (content) =>
      renderContentQuestions(
        content,
        "Passage 2 Questions",
        "Answer the following questions based on Reading Passage 2. Choose the best alternative from the four options provided for each question.",
      ),

    /*********************** grammar ***************************/
    grammar: (content) =>
      renderContentQuestions(
        content,
        "Grammar Section",
        "In this grammar section, select the option that correctly completes or corrects the sentence. Choose the best alternative from the four options provided.",
      ),

    /*********************** substitution  ***************************/
    substitution: (content) =>
      renderContentQuestions(
        content,
        "Substitution Section",
        "In this substitution section, choose the best word or phrase to replace the underlined part in the sentence. Select from the four options provided.",
      ),

    /*********************** completion  ***************************/
    completion: (content) =>
      renderContentQuestions(
        content,
        "Sentence Completion Section",
        "In this sentence completion section, select the option that best completes the sentence. Choose the best alternative from the four options provided.",
      ),

    /*********************** analogy  ***************************/
    analogy: (content) =>
      renderContentQuestions(
        content,
        "Analogy Section",
        "In this analogy section, identify the relationship between the given words and select the pair that best matches it from the four options provided.",
      ),

    /*********************** spelling  ***************************/
    spelling: (content) =>
      renderContentQuestions(
        content,
        "Spelling Section",
        "In this spelling section, choose the correctly spelled word or the option that corrects the spelling error. Select from the four options provided.",
      ),

    /*********************** sentence comprehension  ***************************/
    sentence_comprehension: (content) =>
      renderContentQuestions(
        content,
        "Sentence Comprehension Section",
        "In this sentence comprehension section, select the option that best explains, rephrases, or answers the question about the given sentence. Choose the best alternative from the four options.",
      ),

    /*********************** topic  ***************************/
    topic: (content) =>
      renderContentQuestions(
        content,
        "Topic Identification Section",
        "In this topic identification section, choose the best topic or main idea for the given paragraph or sentence. Select from the four options provided.",
      ),

    /*********************** paragraph comprehension  ***************************/
    paragraph_comprehension: (content) =>
      renderContentQuestions(
        content,
        "Paragraph Comprehension Section",
        "In this paragraph comprehension section, answer the questions based on the provided paragraph. Choose the best alternative from the four options.",
      ),

    /*********************** paragraph development  ***************************/
    paragraph_development: (content) =>
      renderContentQuestions(
        content,
        "Paragraph Development Section",
        "In this paragraph development section, select the sentence that best fits into the paragraph or improves its structure. Choose from the four options provided.",
      ),

    /*********************** essay  ***************************/
    essay: (content) =>
      renderContentQuestions(
        content,
        "Essay Analysis Section",
        "In this essay analysis section, answer questions related to the structure, content, or improvement of the essay. Select the best alternative from the four options.",
      ),

    /*********************** communicative  ***************************/
    communicative: (content) =>
      renderContentQuestions(
        content,
        "Communicative Skills Section",
        "In this communicative skills section, choose the most appropriate response or expression for the given situation. Select from the four options provided.",
      ),

    /*********************** letter  ***************************/
    letter: (content) =>
      renderContentQuestions(
        content,
        "Letter Writing Section",
        "In this letter writing section, select the best option to complete or correct the letter. Choose the best alternative from the four options.",
      ),

    /*********************** jumbled  ***************************/
    jumbled: (content) =>
      renderContentQuestions(
        content,
        "Jumbled Words/Sentences Section",
        "In this jumbled words/sentences section, rearrange the words or sentences to form a coherent structure. Select the correct order from the four options provided.",
      ),

    /*********************** punctuation  ***************************/
    punctuation: (content) =>
      renderContentQuestions(
        content,
        "Punctuation Section",
        "In this punctuation section, choose the option with the correct punctuation or the one that corrects the punctuation error. Select from the four options provided.",
      ),
  };

  // handle loading
  if (isContentLoading) return <LoadingScreen />;

  // Filter all groups once, outside of any render loop
  const passage1 = quiz.filter((r) => r.type === "passage1");
  const passageQ1 = quiz.filter((r) => r.type === "passageQ1");
  const passage2 = quiz.filter((r) => r.type === "passage2");
  const passageQ2 = quiz.filter((r) => r.type === "passageQ2");
  const grammar = quiz.filter((r) => r.type === "grammar");
  const substitution = quiz.filter((r) => r.type === "substitution");
  const completion = quiz.filter((r) => r.type === "completion");
  const analogy = quiz.filter((r) => r.type === "analogy");
  const spelling = quiz.filter((r) => r.type === "spelling");
  const sentence_comprehension = quiz.filter(
    (r) => r.type === "sentence_comprehension",
  );
  const topic = quiz.filter(
    (r) => r.type === "topic_identity" || r.type === "topic",
  );
  const paragraph_comprehension = quiz.filter(
    (r) => r.type === "paragraph_comprehension",
  );
  const paragraph_development = quiz.filter(
    (r) => r.type === "paragraph_development",
  );
  const essay = quiz.filter((r) => r.type === "essay");
  const communicative = quiz.filter((r) => r.type === "communicative");
  const jumbled = quiz.filter((r) => r.type === "jumbled_words");
  const punctuation = quiz.filter((r) => r.type === "punctuation");
  const letter = quiz.filter((r) => r.type === "letter_writing");

  // Define the order of sections/topics to render
  const sections = [
    { type: "passage1", content: passage1 },
    { type: "passageQ1", content: passageQ1 },
    { type: "passage2", content: passage2 },
    { type: "passageQ2", content: passageQ2 },
    { type: "grammar", content: grammar },
    { type: "substitution", content: substitution },
    { type: "completion", content: completion },
    { type: "analogy", content: analogy },
    { type: "spelling", content: spelling },
    { type: "sentence_comprehension", content: sentence_comprehension },
    { type: "topic", content: topic },
    { type: "paragraph_comprehension", content: paragraph_comprehension },
    { type: "paragraph_development", content: paragraph_development },
    { type: "essay", content: essay },
    { type: "communicative", content: communicative },
    { type: "letter", content: letter },
    { type: "jumbled", content: jumbled },
    { type: "punctuation", content: punctuation },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]}>
          {/* show score */}
          <Modal isVisible={visible} onBackdropPress={() => setVisisble(false)}>
            <View style={styles.modalContent}>
              <View style={styles.container}>
                <Svg width={size} height={size}>
                  {/* Background Circle */}
                  <Circle
                    stroke="#eee"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  {/* Progress Circle */}
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

                {/* Score Text */}
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
                }}
              >
                {/* cancel button */}
                <TouchableOpacity
                  style={[styles.optionBtn, { backgroundColor: "gray" }]}
                  onPress={() => {
                    setVisisble(false);
                    setFinish(true);
                  }}
                >
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>

                {/* done button */}
                <TouchableOpacity
                  style={[styles.optionBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    setVisisble(false);
                    router.back();
                  }}
                >
                  <Text style={styles.optionText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View>
            {/* header contents */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack.Screen
                options={{
                  headerStyle: { backgroundColor: "#3b5998" },
                  headerTintColor: "#fff",
                  // 👇 custom header title
                  headerLeft: () => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
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
                          onPress={() => {
                            setShowTime((prev) => !prev);
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={27}
                            color="white"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{ marginRight: 12 }}
                          activeOpacity={1}
                          onPress={() => {
                            setShowTime((prev) => !prev);
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={27}
                            color="white"
                            style={{ opacity: 0.3 }}
                          />
                        </TouchableOpacity>
                      )}
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setVisisble(true);
                          }}
                        >
                          <Ionicons
                            name="document-text"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ),
                }}
              />
            </View>

            {/* main exams list - use FlatList with sections for better performance, but render each topic separately */}
            <FlatList
              data={sections}
              keyExtractor={(item) => item.type}
              renderItem={({ item: section }) => {
                if (section.content.length === 0) return null;
                const rendererFunction = renderers[section.type];
                return rendererFunction
                  ? rendererFunction(section.content)
                  : null;
              }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default EnglishRightAway;

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
});
