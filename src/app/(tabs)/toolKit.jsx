// screens/ProductivityHub.jsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import GridBackground from "../../services/GridBackground.jsx";
import { router } from "expo-router";
import { themeAtom } from "../../atoms.jsx";
import { useAtom, useSetAtom } from "jotai";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

const ProductivityHub = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const tools = [
    {
      id: 1,
      title: "Daily Schedule",
      icon: "calendar-alt",
      gradient: ["#E8F5E9", "#C8E6C9", "#A5D6A7"],
      color: "#2E7D32",
      route: "/ToDoList",
      desc: "Plan your perfect study day",
    },
    {
      id: 2,
      title: "Pomodoro Timer",
      icon: "clock",
      gradient: ["#FFF3E0", "#FFE0B2", "#FFCC80"],
      color: "#F57C00",
      route: "/pomodoro",
      desc: "25-min focus + 5-min breaks",
    },
    {
      id: 3,
      title: "Performance Radar",
      icon: "chart-pie",
      gradient: ["#E0F2F1", "#B2DFDB", "#80CBC4"],
      color: "#00695C",
      route: "/radar",
      desc: "Visualize your strengths & gaps",
    },
    {
      id: 4,
      title: "Scientific Study Guide",
      icon: "lightbulb",
      gradient: ["#E3F2FD", "#BBDEFB", "#90CAF9"],
      color: "#1565C0",
      route: "/studyguide",
      desc: "Personalized revision plans",
    },
  ];

  // color theme
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
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

      {/* GRID BACKGROUND */}

      <LinearGradient
        colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
        {/* SCROLLABLE LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <GridBackground size={40} color="rgba(255,255,255,0.05)" />
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={[styles.pageTitle, {color: colors[theme].darkGreen}]}>Productivity Hub</Text>
          </View>
          {tools.map((tool, index) => (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push(tool.route)}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={tool.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.iconBg}>
                  <FontAwesome5 name={tool.icon} size={42} color={tool.color} />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>{tool.title}</Text>
                  <Text style={styles.cardDesc}>{tool.desc}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          {/* EXTRA SPACE AT BOTTOM */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProductivityHub;

// STYLES — SCROLLABLE, BULLETPROOF, GORGEOUS
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 28,
    color: "#014421",
    letterSpacing: 0.6,
  },
  subtitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 17.5,
    color: "#014421",
    marginTop: 10,
    lineHeight: 26,
  },
  gold: { color: "#FFE100", fontFamily: "Poppins-Black" },

  scrollContent: {
    flex:1,
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  cardWrapper: {
    marginBottom: 22,
  },
  card: {
    width: CARD_WIDTH,
    height: 0.34*width,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.6,
    borderColor: "rgba(0,0,0,0.07)",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      },
      android: { elevation: 22 },
    }),
  },

  iconBg: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.96)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3.6,
    borderColor: "#FFFFFF",
    marginRight: 20,
  },

  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#1A1A1A",
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#014421",
    opacity: 0.88,
    lineHeight: 20,
  },

  trustBadge: {
    textAlign: "center",
    paddingVertical: 32,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#014421",
    marginTop: 10,
  },
  bold: {
    fontFamily: "Poppins-Black",
    color: "#239BA7",
  },
});
