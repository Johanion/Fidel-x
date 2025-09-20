import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { useState } from "react";
import Modal from "react-native-modal";

import Icon from "react-native-vector-icons/MaterialIcons";
import { selectedExamsSubject } from "../../atoms";
import { router } from "expo-router";

const [timeLeft, setTimeLeft] = useState(10); // 60 seconds


const ListOfExams = () => {
  const [selectedExam] = useAtom(selectedExamsSubject);
  const [visible, setVisisble] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card]}
        activeOpacity={0.8}
        onPress={() => {
          setVisisble(true);
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Icon name="local-florist" size={24} color="green" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {item.type} {item.year}
            </Text>
            <View style={styles.infoRow}>
              <Icon name="question-answer" size={18} color="#666" />
              <Text style={styles.infoText}>
                {item.amount || "N/A"} Questions
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="timer" size={18} color="#666" />
              <Text style={styles.infoText}>
                {item.time ? `${item.time} mins` : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Exams List</Text>
        <FlatList
          data={selectedExam.exams}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="info-outline" size={40} color="#666" />
              <Text style={styles.emptyText}>No exams available</Text>
            </View>
          }
        />
        {/* exam options modal */}
        <Modal isVisible={visible} onBackdropPress={() => setVisisble(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Choose how to take the test</Text>

            <TouchableOpacity
              style={[styles.optionBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                setVisisble(false);
                router.push("rightAway");
              }}
            >
              <Text style={styles.optionText}>Right Away</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionBtn, { backgroundColor: "#2196F3" }]}
              onPress={() => {
                setVisisble(false);
                router.push("onceFinished");
              }}
            >
              <Text style={styles.optionText}>Once Finished</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVisisble(false)}
              style={styles.cancelBtn}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f7ff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 8,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
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
    width: "100%",
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
});

export default ListOfExams;
