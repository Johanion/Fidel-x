import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; // provide protected screen

import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons  } from "@expo/vector-icons";

import subjects from "../../constants/subjects.js";
import RenderSubjects from "../../components/RenderSubjects.jsx";
import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import featuredCategoriesData from "../../constants/featuredCategoriesData.js";

import GridBackground from "../../services/GridBackground.jsx";
import { useAuth } from "../../providers/AuthProvider"; // session proiver
import { useState, useEffect, use } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";

import HomeDrawer from "../../providers/HomeDrawer.jsx";
import { themeAtom } from "../../atoms.jsx";
import { useAtom, useSetAtom } from "jotai";
import HomeDraswer from "../../providers/AuthProvider";

export default function Index() {
  // session data
  const { session, loading: authLoading } = useAuth(); // getting session from auth provider using hook
  const [name, setName] = useState("");
  const [theme, setTheme] = useAtom(themeAtom);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  // caching user name
  useEffect(() => {
    const loadName = async () => {
      if (!session?.user?.id) return;
      try {
        // first try to get name from local storage with id -- "username"
        const storedName = await AsyncStorage.getItem("username");
        if (storedName !== null) {
          setName(storedName);
          return;
        }

        // getting user first name if it is not availabe in async storage
        const getFirstName = (fullName) => {
          if (!fullName) return ""; // handle empty/null input
          // Trim spaces and split by space
          return fullName.trim().split(" ")[0];
        };

        // Then, try to fetch from supabase (if user is online)
        const { data, error } = await supabase
          .from("profile") // from profile table
          .select("full_name") // give datas in full_name column
          .eq("id", session.user.id) // condition :- get user's data only
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

  console.log("themeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", theme); // color theme

  // page header
  const PageHeader = () => (
    <View style={{ flex: 1 }}>
      <GridBackground size={40} />

      {/* background grid */}
      <View style={styles.header}>
        <View>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              color: colors[theme].greeting,
            }}
          >
            Hello {name},
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-ExtraLight",
              fontSize: 15,
              marginTop: -12,
              color: colors[theme].welcome,
            }}
          >
            Welcome to fidel{" "}
            <Text
              style={{
                color: colors[theme].fidelx,
                fontFamily: "Poppins-Bold",
              }}
            >
              x
            </Text>
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {/* light and dark mode */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              console.log("hellllllllllo");
              setTheme((prev) => (prev === "light" ? "dark" : "light"));
            }}
          >
            <Ionicons 
              name={theme === "light" ? "sunny" : "moon"}
              size={23}
              color={colors[theme].moon}
              style={{ letterSpacing: 4, paddingTop: 16, marginRight: 11 }} // small spacing effect
            />
          </TouchableOpacity>
          {/* drawer */}
          <TouchableOpacity>
            <FontAwesome5
              name="stream"
              size={20}
              color={colors[theme].moon}
              style={{ letterSpacing: 4, paddingTop: 16 }} // small spacing effect
              // onPress={() => setDrawerOpen(true)}
            />
          </TouchableOpacity>
        </View>
        {/* render drawer */}
        <HomeDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </View>

      {/* slogan box */}
      <Text
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginHorizontal: 17,
          fontWeight: "600",
          fontSize: 24,
          fontFamily: "Poppins-Bold",
          color: colors[theme].darkGreen,
          borderColor: "white",
          borderWidth: 5,
          borderRadius: 16,
          padding: 15,
        }}
      >
        Empowering students through smart learning tools.
      </Text>
      <View style={{ overflow: "visible", marginTop: 30 }}>
        <RenderingFeaturesCategories data={featuredCategoriesData} />
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 10,
          backgroundColor: colors[theme].backgroundColor,
        }}
      >
        <LinearGradient
          colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]} // Left to right: light mint green to white
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
                  fontFamily: "Poppins-Bold",
                  fontSize: 21,
                  color: colors[theme].darkGreen,
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
              <GridBackground size={40} />

              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 21,
                  color: colors[theme].darkGreen,
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
                  fontFamily: "Poppins-Bold",
                  fontSize: 21,
                  color: colors[theme].darkGreen,
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
