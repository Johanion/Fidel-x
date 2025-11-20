// screens/listOfExams.jsx
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { selectedExamsSubject, selectedExamSpecifc } from "../../atoms";

const ListOfExams = () => {
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [,setSelectedSpecificExam] = useAtom(selectedExamSpecifc);
  const [selectedExamSubject, setSelectedExamSubject] = useState(null);
  const [visible, setVisible] = useState(false);

  // Subjects requiring LaTeX rendering
  const LatexExams = ["Physics", "Chemistry", "Aptitude"];
  
  // rendering exams
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => {
        setVisible(true);
        setSelectedSpecificExam(item.questions); // selected exam subject
        setSelectedExamSubject(item);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="auto-stories" size={26} color="#239BA7" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.type} {item.year}
          </Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="quiz" size={18} color="#666" />
            <Text style={styles.infoText}>
              {item.amount || "N/A"} Questions
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="timer" size={18} color="#666" />
            <Text style={styles.infoText}>
              {item.time ? `${item.time} mins` : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  // In ListOfExams

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <FlatList
            data={selectedExam.exams}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.headerText}>{selectedExam.name} Exams</Text>
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
                  const route = LatexExams.includes(selectedExam.name)
                    ? "rightAwayLatex"
                    : "rightAway";
                  router.push(route);
                }}
              >
                <MaterialIcons name="play-arrow" size={22} color="#FFF" />
                <Text style={styles.optionText}>Start Right Away</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionBtn, styles.onceFinishedBtn]}
                onPress={() => {
                  setVisible(false);
                  const route = LatexExams.includes(selectedExam.name)
                    ? "onceFinishedLatex"
                    : "onceFinished";
                  router.push(route);
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

export default ListOfExams;

// ─────── STYLES – INDEX.TSX AESTHETIC CLONE ───────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  gradient: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },

  // Header
  header: {
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  headerText: {
    fontFamily: "Poppins-Black",
    fontSize: 24,
    color: "#014421",
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: "#fff",
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
    color: "#014421",
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
    color: "#555",
    marginLeft: 8,
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
