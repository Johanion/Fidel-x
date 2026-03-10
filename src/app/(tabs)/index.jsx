import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; // provide protected screen

import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import subjects from "../../constants/subjects.js";
import RenderSubjects from "../../components/RenderSubjects.jsx";
import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import featuredCategoriesData from "../../constants/featuredCategoriesData.js";

import GridBackground from "../../services/GridBackground.jsx";
import BlackGridBackground from "../../services/BlackGridBackground.jsx";
import * as Animatable from "react-native-animatable";

import { useAuth } from "../../providers/AuthProvider"; // session proiver
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";

// import HomeDrawer from "../../providers/HomeDrawer.jsx";
import { themeAtom } from "../../atoms.jsx";
import { useAtom } from "jotai";

export default function Index() {
  // session data
  const { session, loading: authLoading } = useAuth(); // getting session from auth provider using hook
  const [name, setName] = useState("");
  const [theme, setTheme] = useAtom(themeAtom);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  
  const colors = {
    light: {
      backgroundColor: "#E0F2ED",
      greeting: "#111111",
      welcome: "#006400",
      fidelx: "#FFE100",
      darkGreen: "",
      pageGradient1: "#E0F2ED",
      pageGradient2: "#FFFFFF",
      pageGradient3: "#E0F2ED",
      moon: "#014421",
      accent: "#FFE100", // Shared accent for highlights
      shadow: "", // Default shadow for light mode
      gridOpacity: 0.05, // For grid backgrounds
    },
    dark: {
      backgroundColor: "#0F172A",
      greeting: "#C9D1D9",
      welcome: "#C9D1D9",
      fidelx: "#FFE100",
      darkGreen: "#E5E7EB",
      pageGradient1: "#020617",
      pageGradient2: "#0f172a",
      pageGradient3: "#1e3a5f", // Creative deep blue-gray for depth (midnight blue tint)
      moon: "#C9D1D9",
      accent: "#A5B4FC", // Creative soft purple-gray accent for highlights (e.g., neon-like glow)
      shadow: "#A5B4FC", // Glowing shadow for creative "ethereal" effect in dark mode
      gridOpacity: 0.1, // Slightly higher opacity for grids in dark mode to add texture
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
        console.log("Error loading name", err);
      }
    };
    loadName();
  }, [session]);

  // page header
  const PageHeader = () => (
    <View style={{ flex: 1 }}>
      {theme === "dark" ? (
        <BlackGridBackground
          size={40}
          color={`rgba(165, 180, 252, ${colors[theme].gridOpacity})`}
        /> // Creative gray-purple tint for grid
      ) : (
        <GridBackground size={40} />
      )}

      {/* background grid */}
      <View style={styles.header}>
        <View>
          <Animatable.Text
            animation={theme === "dark" ? "fadeInDown" : undefined}
            duration={600}
            useNativeDriver={true}
            style={{
              fontWeight: "600",
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              color: colors[theme].greeting,
            }}
          >
            Hello {name},
          </Animatable.Text>
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
          {/* <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <FontAwesome5
              name="stream"
              size={20}
              color={colors[theme].moon}
              style={{ letterSpacing: 4, paddingTop: 16 }} // small spacing effect
            />
          </TouchableOpacity> */}
        </View>
        {/* render drawer */}
        {/* <HomeDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} /> */}
      </View>

      {/* slogan box */}

      {theme==="dark"? 
       <Animatable.Text
        animation={theme === "dark" ? "fadeInLeft" : undefined}
        duration={600}
        delay={200}
        useNativeDriver={true}
        style={{
          marginTop: 20,
          marginHorizontal: 17,
          fontWeight: "600",
          fontSize: 24,
          fontFamily: "Poppins-Bold",
          color: colors[theme].darkGreen,
          borderColor: theme === "dark" ? "#1E293B" : "white",
          borderWidth: 5,
          borderRadius: 16,
          padding: 15,
          textAlign: "center",
          shadowColor: colors[theme].shadow, // Creative shadow glow
          shadowOpacity: 0,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        Empowering students through smart learning tools.
      </Animatable.Text> 

      : 
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
}

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
          colors={[
            colors[theme].pageGradient1,
            colors[theme].pageGradient3,
            colors[theme].pageGradient2,
          ]}
          start={theme === "dark" ? { x: 1, y: 0 } : { x: 1, y: 0 }}
          end={theme === "dark" ? { x: 0, y: 0 } : { x: 0, y: 0 }}
          style={styles.container}
        >
          {/* status bar */}
          <StatusBar
            backgroundColor={colors[theme].pageGradient1}
            barStyle={theme === "dark" ? "light-content" : "dark-content"}
          />

          <ScrollView nestedScrollEnabled={true}>
            {/* page header */}
            <PageHeader />

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
                  backgroundColor:
                    theme === "dark" ? colors[theme].accent : "#FFE100", // Creative accent for bar
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
                  backgroundColor:
                    theme === "dark" ? colors[theme].accent : "#FFE100", // Creative accent for bar
                  width: 6,
                  height: 23,
                  marginRight: 10,
                  borderRadius: 24,
                }}
              ></View>
              {theme === "dark" ? (
                <BlackGridBackground
                  size={40}
                  color={`rgba(165, 180, 252, ${colors[theme].gridOpacity})`}
                /> // Creative tint
              ) : (
                <GridBackground size={40} />
              )}
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
                  backgroundColor:
                    theme === "dark" ? colors[theme].accent : "#FFE100", // Creative accent for bar
                  width: 6,
                  height: 23,
                  marginRight: 10,
                  borderRadius: 24,
                }}
              ></View>
              {theme === "dark" ? (
                <BlackGridBackground
                  size={40}
                  color={`rgba(165, 180, 252, ${colors[theme].gridOpacity})`}
                /> // Creative tint
              ) : (
                <GridBackground size={40} />
              )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
});
