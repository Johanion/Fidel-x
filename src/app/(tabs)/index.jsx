import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  SectionList,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

import subjects from "../../constants/subjects.js";
import RenderSubjects from "../../components/RenderSubjects.jsx";
import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import featureCat from "../../constants/featureCat.js";

import GridBackground from "../../services/GridBackground.jsx";
import { useAuth } from "../../providers/AuthProvider";
import { useState, useEffect, use } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";

export default function Index() {
  // session data
  const { session, loading: authLoading } = useAuth();
  const [name, setName] = useState("");

  // caching user name
  useEffect(() => {
    const loadName = async () => {
      try {
        // first try to get name from local storage
        const storedName = await AsyncStorage.getItem("username");
        if (storedName) {
          setName(storedName);
        }

        // getting user first name
        const getFirstName = (fullName) => {
          if (!fullName) return ""; // handle empty/null input
          // Trim spaces and split by space
          const trimmedName = fullName.trim;
          return fullName.trim().split(" ")[0];
        };

        // Then, try to fetch from supabase (if user is online)
        const { data, error } = await supabase
          .from("profile")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        const firstName = getFirstName(data.full_name);
        if (!error && data) {
          setName(firstName);
          await AsyncStorage.setItem("username", firstName); // cache it
        }
      } catch (err) {
        console.log("Error loaindg name", err);
      }
    };
    loadName();
  }, []);

  // featured catefories data
  const featuredCategoriesData = [
    {
      image: featureCat.ExamIcon,
      text: "400+ EUEE and Model exams",
      colors: ["#FFFFFF", "#F8FCFB", "#E2F2F0", "#BDE3DE", "#95D4CE"],

      start: [0.19, 0.11],
      end: [0.81, 0.89],
    },
    {
      image: featureCat.Productive,
      text: "Your daily study checklist",
      colors: ["#FFFFFF", "#F8FCFB", "#E2F2F0", "#BDE3DE", "#95D4CE"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
    },
    {
      image: featureCat.Study,
      text: "scientific study guide",
      colors: ["#FFFFFF", "#FFFDF5", "#FFF3E0", "#FFE4C4", "#FFD8A8"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
    },
    {
      image: featureCat.Telegram,
      text: "join our community!",
      colors: ["#FFFFFF", "#F9FAFC", "#E3E8EF", "#C9D3E0", "#A0B2C8"],
      start: [0.19, 0.11],
      end: [0.81, 0.89],
    },
  ];

  // page header
  const PageHeader = () => (
    <View style={{ flex: 1 }}>
      {/* background grid */}
      <GridBackground size={40} color="rgba(255,255,255,0.05)" />
      <View style={styles.header}>
        <View>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              color: "black",
            }}
          >
            Hello {name},
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-ExtraLight",
              fontSize: 15,
              marginTop: -12,
              color: "#006400",
            }}
          >
            Welcome to fidel{" "}
            <Text style={{ color: "#FFE100", fontFamily: "Poppins-Bold" }}>
              x
            </Text>
          </Text>
        </View>
        <FontAwesome5
          name="stream"
          size={20}
          color="#014421"
          style={{ letterSpacing: 4, paddingTop: 16 }} // small spacing effect
        />
      </View>
      // slogan box
      <Text
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginHorizontal: 17,
          fontWeight: "600",
          fontSize: 24,
          fontFamily: "Poppins-Bold",
          color: "#014421",
          borderColor: "white",
          borderWidth: 5,
          borderRadius: 16,
          padding: 15,
        }}
      >
        Empowering students through smart learning tools.
      </Text>
      // payment button
      
      <View style={{ overflow: "visible", marginTop: 30 }}>
        <RenderingFeaturesCategories data={featuredCategoriesData} />
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, paddingTop: 10, backgroundColor: "white" }}
      >
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]} // Left to right: light mint green to white
          start={{ x: 1, y: 0.5 }} // End at right-center (horizontal gradient)
          end={{ x: 0, y: 0.5 }} // Start at left-center
          style={styles.container}
        >
          {/* status bar */}
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <ScrollView>
            {/* page header */}
            <PageHeader style={{ flex: 1 }} />

            {/* natural science bar */}
            <View
              style={{
                flexDirection: "row",
                padding: 12,
                paddingTop: 23,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE100",
                  width: 6,
                  height: 23,
                  marginRight: 10,
                  borderRadius: 24,
                }}
              ></View>
              <Text
                style={{
                  fontFamily: "Poppins-Black",
                  fontSize: 21,
                  color: "#014421",
                }}
              >
                Natural Science
              </Text>
            </View>
            <RenderSubjects data={subjects.NaturalScience} />

            {/* social science bar */}
            <View
              style={{
                flexDirection: "row",
                padding: 12,
                paddingTop: 23,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE100",
                  width: 6,
                  height: 23,
                  marginRight: 10,
                  borderRadius: 24,
                }}
              ></View>
              <GridBackground size={40} color="rgba(255,255,255,0.05)" />

              <Text
                style={{
                  fontFamily: "Poppins-Black",
                  fontSize: 21,
                  color: "#014421",
                }}
              >
                Social Science
              </Text>
            </View>
            <RenderSubjects data={subjects.SocialScience} />

            {/* Aptitude and english */}
            <View
              style={{
                flexDirection: "row",
                padding: 12,
                paddingTop: 23,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE100",
                  width: 6,
                  height: 23,
                  marginRight: 10,
                  borderRadius: 24,
                }}
              ></View>
              <Text
                style={{
                  fontFamily: "Poppins-Black",
                  fontSize: 21,
                  color: "#014421",
                }}
              >
                English & SAT
              </Text>
            </View>
            <View style={{ marginBottom: 150 }}>
              <RenderSubjects data={subjects.Language} />
            </View>
          </ScrollView>
        </LinearGradient>
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
  sloganBox: {
    alignSelf: "center",
    flex: 1,
    borderRadius: 20,
  },
  shadowBox: {
    width: "95%",
    height: 125,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
  },
});
