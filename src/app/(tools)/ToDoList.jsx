
// screens/TodoBoardScreen.jsx
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import DateTimePicker from "@react-native-community/datetimepicker";

// Import Zustand store
import useStore from "../../services/store.ts";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function TodoBoardScreen() {
  // Zustand: state + actions
  const {
    tables,
    addTable,
    deleteTable,
    updateTableTitle,
    updateTableDate, // ← NEW: update board date
    addTask,
    deleteTask,
    updateTask,
  } = useStore();

  // Local UI states
  const [showStatusPicker, setShowStatusPicker] = React.useState(null);
  const [showPriorityPicker, setShowPriorityPicker] = React.useState(null);
  const [showDatePicker, setShowDatePicker] = React.useState(null);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [d, m, y] = dateStr.split("/");
      return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#E0F2ED", "#FFFFFF"]} style={styles.background}>
        <View style={styles.scrollContainer}>
          <FlatList
            data={tables}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TaskTable
                table={item}
                updateTableTitle={updateTableTitle}
                updateTableDate={updateTableDate}
                addTask={addTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                deleteTable={deleteTable}
                showStatusPicker={showStatusPicker}
                setShowStatusPicker={setShowStatusPicker}
                showPriorityPicker={showPriorityPicker}
                setShowPriorityPicker={setShowPriorityPicker}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                formatDate={formatDate}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TouchableOpacity style={styles.addTableBtn} onPress={addTable}>
                <Ionicons name="add-circle" size={28} color="#239BA7" />
                <Text style={styles.addTableText}>Add New Board</Text>
              </TouchableOpacity>
            }
          />
        </View>

        {/* Status Picker */}
        <PickerModal
          visible={!!showStatusPicker}
          options={STATUS_OPTIONS}
          selected={showStatusPicker?.value}
          onSelect={(val) => {
            updateTask(
              showStatusPicker.tableId,
              showStatusPicker.taskId,
              "status",
              val
            );
            setShowStatusPicker(null);
          }}
          onClose={() => setShowStatusPicker(null)}
        />

        {/* Priority Picker */}
        <PickerModal
          visible={!!showPriorityPicker}
          options={PRIORITY_OPTIONS}
          selected={showPriorityPicker?.value}
          onSelect={(val) => {
            updateTask(
              showPriorityPicker.tableId,
              showPriorityPicker.taskId,
              "priority",
              val
            );
            setShowPriorityPicker(null);
          }}
          onClose={() => setShowPriorityPicker(null)}
        />

        {/* Date Picker (Board Level) */}
        {showDatePicker && (
          <DateTimePicker
            value={
              showDatePicker.dateStr
                ? new Date(
                    showDatePicker.dateStr.split("/").reverse().join("-")
                  )
                : new Date()
            }
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                const d = selectedDate.getDate().toString().padStart(2, "0");
                const m = (selectedDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const y = selectedDate.getFullYear();
                updateTableDate(showDatePicker.tableId, `${d}/${m}/${y}`);
              }
              setShowDatePicker(null);
            }}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

/* -------------------------------------------------
   TASK TABLE – NOW WITH BOARD DATE
   ------------------------------------------------- */
const TaskTable = ({
  table,
  updateTableTitle,
  updateTableDate,
  addTask,
  deleteTask,
  updateTask,
  deleteTable,
  showStatusPicker,
  setShowStatusPicker,
  showPriorityPicker,
  setShowPriorityPicker,
  showDatePicker,
  setShowDatePicker,
  formatDate,
}) => {
  const scale = new Animated.Value(1);
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.015,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const [editingTitle, setEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(table.title);
  const [date, setDate] = React.useState(table.date || "");

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      style={styles.tableWrapper}
    >
      <Animated.View style={[styles.tableCard, { transform: [{ scale }] }]}>
        {/* HEADER */}
        <LinearGradient
          colors={["#239BA7", "#1A7F8A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tableHeader}
        >
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="clipboard" size={28} color="#FFE100" />
            </View>
            <View>
              {/* Board Title */}
              {editingTitle ? (
                <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => {
                    updateTableTitle(table.id, title);
                    setEditingTitle(false);
                  }}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setEditingTitle(true)}>
                  <Text style={styles.tableTitle}>{table.title}</Text>
                </TouchableOpacity>
              )}

              {/* Board Date + Calendar */}
              <View style={styles.headerRight}>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={16} color="#fff" />
                  <TextInput
                    style={styles.inputBoardDate}
                    value={formatDate(date)}
                    onChangeText={(txt) => {
                      setDate(txt);
                      updateTableDate(table.id, txt);
                    }}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#ccc"
                    keyboardType="numeric"
                  />

                  {/* date picker */}
                  <TouchableOpacity
                    onPress={() =>
                      setShowDatePicker({
                        tableId: table.id,
                        dateStr: date || "01/01/2025",
                      })
                    }
                  >
                    <Ionicons name="calendar" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* delete and add Board */}
            <View style={{ flexDirection: "row" }}>
              {/* Add / Delete */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => addTask(table.id)}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => deleteTable(table.id)}
              >
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.goldenBar} />
        </LinearGradient>

        {/* TASKS */}
        <FlatList
          data={table.tasks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.taskList}
          renderItem={({ item: task }) => (
            <TaskCard
              task={task}
              tableId={table.id}
              updateTask={updateTask}
              deleteTask={deleteTask}
              setShowStatusPicker={setShowStatusPicker}
              setShowPriorityPicker={setShowPriorityPicker}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyTask}>
              <Text style={styles.emptyText}>No tasks yet. Tap + to add.</Text>
            </View>
          }
        />
      </Animated.View>
    </Animatable.View>
  );
};

/* -------------------------------------------------
   TASK CARD – NO DATE
   ------------------------------------------------- */
const TaskCard = ({
  task,
  tableId,
  updateTask,
  deleteTask,
  setShowStatusPicker,
  setShowPriorityPicker,
}) => {
  const [name, setName] = React.useState(task.name);
  const [interval, setInterval] = React.useState(task.interval);

  const statusColor = {
    Done: "#4CAF50",
    "In Progress": "#FF9800",
    "To Do": "#9E9E9E",
  }[task.status];

  const priorityColor = {
    High: "#F44336",
    Medium: "#FF9800",
    Low: "#2196F3",
  }[task.priority];

  return (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={styles.deleteTask}
        onPress={() => deleteTask(tableId, task.id)}
      >
        <Ionicons name="close-circle" size={20} color="#ccc" />
      </TouchableOpacity>

      <TextInput
        style={styles.inputName}
        value={name}
        onChangeText={(txt) => {
          setName(txt);
          updateTask(tableId, task.id, "name", txt);
        }}
        placeholder="Task name"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        style={styles.pickerRow}
        onPress={() =>
          setShowStatusPicker({ tableId, taskId: task.id, value: task.status })
        }
      >
        <Ionicons name="flag" size={16} color={statusColor} />
        <Text style={[styles.pickerText, { color: statusColor }]}>
          {task.status}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#aaa" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pickerRow}
        onPress={() =>
          setShowPriorityPicker({
            tableId,
            taskId: task.id,
            value: task.priority,
          })
        }
      >
        <Ionicons name="warning" size={16} color={priorityColor} />
        <Text style={[styles.pickerText, { color: priorityColor }]}>
          {task.priority}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#aaa" />
      </TouchableOpacity>

      <View style={styles.intervalRow}>
        <Ionicons name="time-outline" size={16} color="#FFE100" />
        <TextInput
          style={styles.inputInterval}
          value={interval}
          onChangeText={(txt) => {
            setInterval(txt);
            updateTask(tableId, task.id, "interval", txt);
          }}
          placeholder="e.g. 1‑2 hours"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.taskAccent} />
    </View>
  );
};

/* -------------------------------------------------
   PICKER MODAL
   ------------------------------------------------- */
const PickerModal = ({ visible, options, selected, onSelect, onClose }) => (
  <Modal transparent visible={visible} animationType="fade">
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerModal}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pickerOption,
                selected === opt && styles.pickerSelected,
              ]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  selected === opt && styles.pickerSelectedText,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

/* -------------------------------------------------
   STYLES
   ------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContainer: { flex: 1 },
  list: { paddingVertical: 20 },

  addTableBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  addTableText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#239BA7",
    marginLeft: 8,
  },

  tableWrapper: { marginHorizontal: 16, marginBottom: 28 },
  tableCard: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
      },
      android: { elevation: 22 },
    }),
  },
  tableHeader: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
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
  titleInput: {
    fontFamily: "Poppins-Black",
    fontSize: 19,
    color: "#fff",
    minWidth: 120,
  },
  tableTitle: { fontFamily: "Poppins-Black", fontSize: 19, color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { marginLeft: 12 },

  // NEW: Board Date Row
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 0.1,
    borderRadius: 12,
  },
  inputBoardDate: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#fff",
    marginLeft: 6,
    minWidth: 80,
    textAlign: "center",
  },

  goldenBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#FFE100",
  },

  taskList: { paddingHorizontal: 12, paddingVertical: 16, flexGrow: 1 },
  emptyTask: { padding: 20 },
  emptyText: { fontFamily: "Poppins-Medium", color: "#aaa", fontSize: 14 },

  taskCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "rgba(35,155,167,0.15)",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: { elevation: 14 },
    }),
  },
  deleteTask: { position: "absolute", top: 8, right: 8, zIndex: 10 },
  inputName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15.5,
    color: "#014421",
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1.5,
    borderColor: "rgba(35,155,167,0.2)",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  pickerText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  intervalRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  inputInterval: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#239BA7",
    marginLeft: 8,
    flex: 1,
  },
  taskAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#239BA7",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    minWidth: 160,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  pickerOption: { padding: 12, borderRadius: 12 },
  pickerSelected: { backgroundColor: "#239BA7" },
  pickerOptionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  pickerSelectedText: { color: "#fff", fontFamily: "Poppins-SemiBold" },
});
