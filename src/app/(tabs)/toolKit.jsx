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
import { useAtom } from "jotai";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

const ProductivityHub = () => {
  const [theme] = useAtom(themeAtom);

  const tools = [
    {
      id: 1,
      title: "Daily Schedule",
      icon: "calendar-alt",
      gradient: ["#E8F5E9", "#C8E6C9"],
      color: "#2E7D32",
      route: "/ToDoList",
      desc: "Plan your perfect study day",
    },
    {
      id: 2,
      title: "Pomodoro Timer",
      icon: "clock",
      gradient: ["#FFF3E0", "#FFE0B2"],
      color: "#F57C00",
      route: "/Pomodro",
      desc: "25-min focus + 5-min breaks",
    },
    {
      id: 3,
      title: "Performance Radar",
      icon: "chart-pie",
      gradient: ["#E0F2F1", "#B2DFDB"],
      color: "#00695C",
      route: "/PerfomanceRadar",
      desc: "Visualize strengths & weaknesses",
    },
    {
      id: 4,
      title: "Scientific Study Guide",
      icon: "lightbulb",
      gradient: ["#E3F2FD", "#BBDEFB"],
      color: "#1565C0",
      route: "/StudyGuide",
      desc: "Personalized revision strategy",
    },
  ];

  const colors = {
    light: {
      pageGradient1: "#E0F2ED",
      pageGradient2: "#FFFFFF",
      darkGreen: "#014421",
      text: "#1A1A1A",
      subtext: "#4B5563",
    },
    dark: {
      pageGradient1: "#0B1220",
      pageGradient2: "#020617",
      darkGreen: "#E5E7EB",
      text: "#F9FAFB",
      subtext: "#9CA3AF",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E0F2ED" barStyle="dark-content" />

      <LinearGradient
        colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <GridBackground size={40} color="rgba(255,255,255,0.05)" />

          {/* HERO HEADER */}
          <LinearGradient
            colors={["#014421", "#026C45"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <FontAwesome5 name="bolt" size={20} color="#014421" />
              </View>

              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Productivity Hub</Text>
              </View>
            </View>
          </LinearGradient>

          {/* TOOLS */}
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.9}
              onPress={() => router.push(tool.route)}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={tool.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={[styles.iconBg, { borderColor: tool.color }]}>
                  <FontAwesome5 name={tool.icon} size={26} color={tool.color} />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>{tool.title}</Text>
                  <Text style={styles.cardDesc}>{tool.desc}</Text>
                </View>

                <FontAwesome5
                  name="chevron-right"
                  size={18}
                  color={tool.color}
                  style={styles.arrow}
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <View style={{ height: 50 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProductivityHub;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 80,
  },

  header: {
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    fontFamily: "Poppins-Black",
    fontSize: 30,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#014421",
    justifyContent: "center",
    alignItems: "center",
  },

  cardWrapper: {
    marginBottom: 20,
    ...Platform.select({
    ios: {
      shadowColor: "#4FC3F7", // light blue shadow
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
      shadowColor: "#4FC3F7",
    },
  }),
  },

  card: {
    width: CARD_WIDTH,
    height: width * 0.3,
    borderRadius: 26,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",

    ...Platform.select({
    ios: {
      shadowColor: "#2563EB", // light blue shadow
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
    },
    android: {
      elevation: 20,
      shadowColor: "#1e8a27",
    },
  }),
  },

  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginRight: 16,
  },

  textContent: {
    flex: 1,
  },

  cardTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 17,
    color: "#1A1A1A",
  },

  cardDesc: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 18,
  },

  arrow: {
    opacity: 0.7,
  },
  heroCard: {
  borderRadius: 28,
  padding: 20,
  marginBottom: 28,
  marginTop: 25,
  marginHorizontal: -12,
  borderWidth: 10,
  borderColor: "white",

  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.25,
      shadowRadius: 30,
    },
    android: {
      elevation: 18,
    },
  }),
},

heroContent: {
  flexDirection: "row",
  alignItems: "center",
},

heroIcon: {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 16,
},

heroText: {
  flex: 1,
},

heroTitle: {
  fontFamily: "Poppins-Black",
  fontSize: 20,
  color: "#FFFFFF",
},

heroSubtitle: {
  fontFamily: "Poppins-Medium",
  fontSize: 13,
  color: "rgba(255,255,255,0.85)",
  marginTop: 6,
  lineHeight: 18,
},
});
