import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { selectedSubject, selectedSubjectSpecificContent } from "../../atoms";
import { router } from "expo-router";

const Topics = () => {
  const [selectedSubjectValue] = useAtom(selectedSubject);
  const setSelectedSubjectSpecificContent = useSetAtom(
    selectedSubjectSpecificContent
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedSubjectSpecificContent(item);
        router.push("../../(study)/allStudyTools");
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="book" size={24} color="#007bff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title || item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#444852ff", "#3b5998", "#192f6a"]}
        style={{ flex: 1 }}
      >
        <FlatList
          data={selectedSubjectValue}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            (item.id || item.name || index).toString()
          }
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={styles.header}>Topics</Text>}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="info-outline" size={40} color="#666" />
              <Text style={styles.emptyText}>No topics available</Text>
            </View>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Topics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
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
});
