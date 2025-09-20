import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BackHandler, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import Svg, { Circle } from "react-native-svg";

import { selectedExamsSubject } from "../../atoms";
import question from "../../constants/question";
import { useState, useEffect } from "react";

const rightAway = () => {
  const [selectedExam] = useAtom(selectedExamsSubject);

  const [questionNumber, setQuestionNumber] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answersCorrect, setAnswersCorrect] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(100); // 60 seconds
  const [score, setScore] = useState(0);
  const [showTime, setShowTime] = useState(false);
  const [visible, setVisisble] = useState(false);

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

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // explanation toggle
  const toggleExpand = (questionIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex], // toggle only this question
    }));
  };

  const handleOptionPress = (questionIndex, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    const isAnswerCorrect = question[questionIndex].correctAnswer === option;
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
      backAction
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
  const getOptionColor = (questionIndex, option, item) => {
    // default white
    let bgColor = "white";

    // If user selected this option
    if (selectedOptions[questionIndex] === option) {
      if (answersCorrect[questionIndex]) {
        bgColor = "#4CAF50"; // ✅ correct selection
      } else {
        bgColor = "#EF9A9A"; // ❌ wrong selection
      }
    }

    // Always show the correct one green if they missed it
    if (
      selectedOptions[questionIndex] &&
      option === item.correctAnswer &&
      selectedOptions[questionIndex] !== item.correctAnswer
    ) {
      bgColor = "#4CAF50";
    }

    return bgColor;
  };

  console.log(visible);
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

            {/* main exams list */}
            <FlatList
              data={question}
              renderItem={({ item, index: questionIndex }) => {
                return (
                  <View>
                    <View style={styles.quizBox}>
                      <View style={styles.question}>
                        <Text style={{ fontFamily: "Poppins-Medium" }}>
                          {questionIndex + 1}. {item.question}
                        </Text>
                      </View>
                      {item.options.map((option, optionIndex) => (
                        <View
                          key={optionIndex}
                          style={[
                            styles.option,
                            {
                              backgroundColor: getOptionColor(
                                questionIndex,
                                option,
                                item
                              ),
                            },
                          ]}
                        >
                          <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                              handleOptionPress(questionIndex, option);
                            }}
                            activeOpacity={0.7}
                            disabled={!!selectedOptions[questionIndex]}
                          >
                            <Text style={{ fontFamily: "Poppins-Medium" }}>
                              {option}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* explanation toggle */}

                      {selectedOptions[questionIndex] && (
                        <>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: 7,
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => toggleExpand(questionIndex)}
                            >
                              <Text style={{ fontFamily: "Poppins-Black" }}>
                                Explanation
                              </Text>
                            </TouchableOpacity>
                            <Ionicons
                              name={
                                expandedQuestions[questionIndex]
                                  ? "chevron-up"
                                  : "chevron-down"
                              }
                              size={20}
                              color="#333"
                            />
                          </View>
                          {expandedQuestions[questionIndex] && (
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
                );
              }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default rightAway;

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
