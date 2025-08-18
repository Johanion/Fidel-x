import { Text, View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function Index() {
  return (
    <SafeAreaProvider>
      {/* our main box */}
      <SafeAreaView
        style={{ flex: 1, paddingTop: 10, backgroundColor: "white" }}
      >
        {/* status bar */}
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        {/* header */}
        <View style={styles.header}>
          <View>
            <Text style={{fontWeight: 600, fontSize:22}}>Hello Andria,</Text>
            <Text>Welcom to fidelx</Text>
          </View>
          <FontAwesome5
            name="stream"
            size={20}
            color="#333"
            style={{ letterSpacing: 4 }} // small spacing effect
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
});
