import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeDrawer({ visible, onClose }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <LinearGradient
        colors={["#0A0E14", "#000"]}
        style={styles.drawer}
      >
        <Text style={styles.title}>Menu</Text>

        <TouchableOpacity>
          <Text style={styles.item}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.item}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.item}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: "75%",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  item: {
    color: "white",
    fontSize: 16,
    paddingVertical: 12,
  },
});
