// screens/listOfExams.jsx
import React, { useState, useCallback, useEffect, memo } from "react";  // Added memo
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAtom, useSetAtom } from "jotai";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { themeAtom } from "../../atoms.jsx";
import { useAuth } from "../../providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { Svg, Circle, G, Text as SvgText } from "react-native-svg";

import {
  selectedExamsSubject,
  selectedExamSpecifc,
  selectedSpecificTime,
  selectedSubjectSpecificContent
} from "../../atoms";

// Define AnimatedCircle here (was missing)
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ListOfExams = () => {
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [, setSelectedSpecificExam] = useAtom(selectedExamSpecifc); //eg. biology_2014
  const [, setSelectedTime] = useAtom(selectedSpecificTime);
  const [selectedExamSubject, setSelectedExamSubject] = useState(null);
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useAtom(themeAtom);

  const { session, loading: authLoading } = useAuth();
  const [Status, setStatus] = useState(); //user authoritization status

  // download data states
  const [allDownloaded, setAllDownloaded] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({}); // { itemId: 0.65 }
  const [currentlyDownloading, setCurrentlyDownloading] = useState({});
  const setSelectedSubjectSpecificContent = useSetAtom(
      selectedSubjectSpecificContent
    ); //eg. genetics

  // Download Progress Simulation
  const size = 56;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Subjects requiring LaTeX rendering
  const LatexExams = ["Physics", "Chemistry", "Aptitude"];
  const colors = {
    light: {
      backgroundColor: "white",
      greeting: "#111111",
      welcome: "#006400",
      fidelx: "#FFE100",
      darkGreen: "#014421",
      pageGradient1: "#E0F2ED",
      pageGradient2: "#FFFFFF",
      moon: "#014421",
      info: "#555",
      border: "#fff",
    },
    dark: {
      backgroundColor: "black",
      greeting: "#C9D1D9",
      welcome: "#C9D1D9",
      fidelx: "#FFE100",
      darkGreen: "#E5E7EB",
      pageGradient1: "#0B1220",
      pageGradient2: "#020617",
      moon: "#C9D1D9",
      info: "#fff",
      border: "#fff",
    },
  };

  // dynamic files based on subject + ID
  const FILE = selectedExam?.name?.toLowerCase();
  const getFilesForItem = (item) => {
    const ID = item.questions; // Use questions as ID for uniqueness; adjust if needed
    return [
      { name: "exam", type: "json", table: `${FILE}_exam_${ID}` },
    ];
  };

  // local file paths
  const getFileUri = (fileName) => {
    return `${FileSystem.documentDirectory}${fileName}`;
  };

  // check if the item's file exist 
  const checkAllFilesDownloaded = async () => {
    if (!selectedExam || !selectedExam.exams || selectedExam.exams.length === 0 || !FILE) {
      setAllDownloaded({});
      return;
    }

    const downloadedStatus = {};

    for (const item of selectedExam.exams) {
      const file = getFilesForItem(item)[0]; // Only one file
      const fileName = `${file.table}.json`;
      const fileUri = getFileUri(fileName);

      let fileExists = false;

      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        fileExists = fileInfo.exists;
      } catch (error) {
        fileExists = false;
      }

      downloadedStatus[item.id] = fileExists;
    }

    // Update state once
    setAllDownloaded(downloadedStatus);
    console.log("Files checked on disk:", downloadedStatus);
  };

  /************load saved data from device ***************/
  const downloadAllContent = async (itemId) => {
    if (allDownloaded[itemId]) return;
    setCurrentlyDownloading((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    setDownloadProgress((prev) => ({ ...prev, [itemId]: 0 }));
    const item = selectedExam.exams.find((i) => (i.id ) === itemId);
    if (!item) return;

    const file = getFilesForItem(item)[0]; // Only one file

    try {
      console.log("file", file);

      await downloadJsonFromTable(file.table, item.questions); // Pass questions to save locally

      setDownloadProgress((prev) => ({ ...prev, [itemId]: 1 }));
      setAllDownloaded((prev) => ({ ...prev, [itemId]: true }));

      Alert.alert("Success", "Exam downloaded! Ready to study offline!");
    } catch (error) {
      Alert.alert("Download Failed", error.message, "Please try again later");
    } finally {
      setCurrentlyDownloading((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  /*********** Download from supabase + save to device */
  // Download JSON (since questions are already available, save them directly; adjust if need to fetch fresh)
  const downloadJsonFromTable = async (table, questions) => {
    // If questions need fresh fetch, uncomment and adjust:
    const { data, error } = await supabase.from(questions).select("*").order("id");
    if (error) throw error;
    if (!data) throw new Error("No data");
    const jsonString = JSON.stringify(data);

    // But since item.questions is available, save it:
    await FileSystem.writeAsStringAsync(
      getFileUri(table + ".json"),
      jsonString
    );
  };

  // handle card press
  const handleCardPress = (itemId) => {
    if (!Status) {
      
    } else if (allDownloaded[itemId]) {
      const item = selectedExam.exams.find((i) => (i.id  === itemId));
      if (item) {
        setSelectedSpecificExam(item.questions); // Still use in-memory for now; load from file in target screen for full offline
        setSelectedTime(item.time);
        setSelectedExamSubject(item);
        setVisible(true);

        const file = getFilesForItem(item)[0]; // Only one file
        const fileName = `${file.table}.json`;
        const fileUri = getFileUri(fileName);
        setSelectedSubjectSpecificContent(fileUri)
      }
    } else {
      downloadAllContent(itemId);
    }
  };

  //  loading user paid status and check downloads
  useEffect(() => {
    const loadStatus = async () => {
      try {
        // first try to get name from local storage
        const storedStatus = await AsyncStorage.getItem("status");
        if (storedStatus && storedStatus !== undefined) {
          setStatus(JSON.parse(storedStatus));
        }

        // Then, try to fetch from supabase (if user is online)
        const { data, error } = await supabase
          .from("profile")
          .select("status")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setStatus(!data.status);
          await AsyncStorage.setItem("status", JSON.stringify(!data.status)); // cache it
        }
      } catch (err) {
        console.log("Error loading name", err);
      } finally {
        // check downloaded files after status load
        checkAllFilesDownloaded();
      }
    };

    loadStatus();
  }, [selectedExam, session]);

  // In ListOfExams
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors[theme].backgroundColor },
        ]}
      >
        <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

        <LinearGradient
          colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <FlatList
            data={selectedExam.exams}
            renderItem={({ item }) => (
              <ExamItem
                item={item}
                theme={theme}
                colors={colors[theme]}  // Pass the resolved colors
                allDownloaded={allDownloaded}
                downloadProgress={downloadProgress}
                currentlyDownloading={currentlyDownloading}
                Status={Status}
                handleCardPress={handleCardPress}
                size={size}
                strokeWidth={strokeWidth}
                radius={radius}
                circumference={circumference}
              />
            )}
            keyExtractor={(item, index) =>
              item.id?.toString() || `${item.type}-${item.year}-${index}`
            }
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerText,
                    { color: colors[theme].darkGreen },
                  ]}
                >
                  {" "}
                  {selectedExam.name} Exams
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="info" size={44} color="#999" />
                <Text style={styles.emptyText}>No exams available</Text>
              </View>
            }
          />

          {/* Exam Mode Modal */}
          <Modal
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            backdropOpacity={0.5}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Test Mode</Text>

              <TouchableOpacity
                style={[styles.optionBtn, styles.rightAwayBtn]}
                onPress={() => {
                  setVisible(false);
                  if (selectedExam.name === "English") {
                    const route = "englishRightAway";
                    router.push(route);
                  } else if (selectedExam.name === "Aptitude") {
                    const route = "aptitudeRightAway";
                    router.push(route);
                  } else {
                    const route = LatexExams.includes(selectedExam.name)
                      ? "rightAwayLatex"
                      : "rightAway";
                    router.push(route);
                  }
                }}
              >
                <MaterialIcons name="play-arrow" size={22} color="#FFF" />
                <Text style={styles.optionText}>Start Right Away</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionBtn, styles.onceFinishedBtn]}
                onPress={() => {
                  setVisible(false);
                  if (selectedExam.name === "English") {
                    const route = "englishOnceFinished";
                    router.push(route);
                  } else if (selectedExam.name === "Aptitude") {
                    const route = "aptitudeOnceFinished";
                    router.push(route);
                  } else {
                    const route = LatexExams.includes(selectedExam.name)
                      ? "onceFinishedLatex"
                      : "onceFinished";
                    router.push(route);
                  }
                }}
              >
                <MaterialIcons name="schedule" size={22} color="#FFF" />
                <Text style={styles.optionText}>Once Finished</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// New component for each exam item
const ExamItem = memo(({ item, theme, colors, allDownloaded, downloadProgress, currentlyDownloading, Status, handleCardPress, size, strokeWidth, radius, circumference }) => {
  const itemId = item.id;
  const itemProgress = downloadProgress[itemId] || 0;
  const isDownloadingThis = !!currentlyDownloading[itemId];
  const isDownloaded = allDownloaded[itemId];

  // Hooks are now at the top level of this component
  const progressAnim = useSharedValue(itemProgress);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progressAnim.value),
  }));

  useEffect(() => {
    progressAnim.value = withTiming(itemProgress, { duration: 300 });
  }, [itemProgress, progressAnim]);  // Added progressAnim to deps if needed

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.backgroundColor },
        { borderColor: colors.border },
      ]}
      activeOpacity={0.88}
      onPress={() => handleCardPress(itemId)}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="auto-stories" size={26} color="#239BA7" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.darkGreen }]}>
            {item.type} {item.year}
          </Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="quiz" size={18} color="#666" />
            <Text style={[styles.infoText, { color: colors.info }]}>
              {item.amount || "N/A"} Questions
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="timer" size={18} color="#666" />
            <Text style={[styles.infoText, { color: colors.info }]}>
              {item.time ? `${item.time} mins` : "N/A"}
            </Text>
          </View>
        </View>
        {/* Status Circle */}
                  <View style={styles.StatusCircle}>
                    {isDownloadingThis ? (
                      <Svg width={80} height={80} viewBox="0 0 80 80">
                        <G rotation="-90" origin="40,40">
                          {/* Background Circle */}
                          <Circle
                            stroke="#e0e0e0"
                            fill="none"
                            cx={40}
                            cy={40}
                            r={radius}
                            strokeWidth={strokeWidth}
                          />
                          {/* Animated Progress Circle */}
                          <AnimatedCircle
                            animatedProps={animatedProps}
                            stroke="#4CAF50"
                            fill="none"
                            cx={40}
                            cy={40}
                            r={radius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                          />
                        </G>
                        {/* Centered Text */}
                        <SvgText
                          x="40"
                          y="40"
                          fontSize="12"
                          fontWeight="bold"
                          fill={theme === "light" ? "#333" : "white"}
                          textAnchor="middle"
                          alignmentBaseline="central"
                        >
                          {`${Math.round(itemProgress * 100)}%`}
                        </SvgText>
                      </Svg>
                    ) : !Status ? (
                      <FontAwesome5 name="lock" size={22} color="#9ca3af" />
                    ) : isDownloaded ? null : (
                      <FontAwesome5
                        name="cloud-download-alt"
                        size={24}
                        color="#388E3C"
                      />
                    )}
                  </View>
      </View>
    </TouchableOpacity>
  );
});

export default ListOfExams;

// ─────── STYLES – INDEX.TSX AESTHETIC CLONE ───────
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },

  // Header
  header: {
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    textAlign: "center",
  },

  // Card
  card: {
    borderRadius: 20,
    marginVertical: 10,
    padding: 18,
    borderWidth: 1.4,
    borderColor: "rgba(35,155,167,0.16)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
      },
      android: { elevation: 10 },
    }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(35,155,167,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1.8,
    borderColor: "rgba(35,155,167,0.22)",
  },
  textContainer: { flex: 1 },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  infoText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 8,
  },
  StatusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#777",
    marginTop: 12,
  },

  // Modal
  modalContent: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 16 },
    }),
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#014421",
    marginBottom: 20,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    marginVertical: 8,
  },
  rightAwayBtn: {
    backgroundColor: "#4CAF50",
  },
  onceFinishedBtn: {
    backgroundColor: "#239BA7",
  },
  optionText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelBtn: {
    marginTop: 12,
    padding: 10,
  },
  cancelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#666",
  },
});