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

export default function Index() {
  // featured catefories data
  const featuredCategoriesData = [
    {
      image: featureCat.ExamIcon,
      text: "400+ EUEE and Model exams with answers",
      colors: ["#FFFFFF", "#FFF9F6", "#53342aff", "#FFD6CC", "#FFB8A8"],

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
      <View style={styles.header}>
        <View>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 24,
              fontFamily: "Poppins-Bold",
              color: "white",
            }}
          >
            Hello Andria,
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-ExtraLight",
              fontSize: 15,
              marginTop: -12,
              color: "white",
            }}
          >
            Welcom to fidel{" "}
            <Text style={{ color: "#FFE100", fontFamily: "Poppins-Bold" }}>
              x
            </Text>
          </Text>
        </View>
        <FontAwesome5
          name="stream"
          size={20}
          color="white"
          style={{ letterSpacing: 4 }} // small spacing effect
        />
      </View>

      <View style={styles.shadowBox}>
        <LinearGradient
          colors={["#075499", "#CFD64A"]}
          start={{ x: 0.93, y: 0.75 }}
          end={{ x: 0.07, y: 0.25 }}
          style={styles.sloganBox}
        >
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
            }}
          >
            A platform that combines scientific tools and smart learning to help
            students understand concepts better and achieve higher marks
          </Text>
        </LinearGradient>
        {/* conditionally rendering payment */}
      </View>
      <TouchableOpacity onPress={() => router.push("../mainPayment")}>
        <View
          style={{
            backgroundColor: "#DDF4E7",
            marginHorizontal: 20,
            marginVertical: 10,
            padding: 20,
            borderRadius: 15,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="crown" size={25} color="#FFD700" />
          <Text style={{ fontFamily: "Poppins-Bold" }}>
            {" "}
            Unlock everything for just ETB 500
          </Text>
        </View>

        {/* featured categories for main page */}
      </TouchableOpacity>
      <View style={{ overflow: "visible" }}>
        <RenderingFeaturesCategories data={featuredCategoriesData} />
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, paddingTop: 10, backgroundColor: "black" }}
      >
        {/* status bar */}
        <StatusBar backgroundColor="black" barStyle="light-content" />
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
                color: "white",
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
            <Text
              style={{
                fontFamily: "Poppins-Black",
                fontSize: 21,
                color: "white",
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
                color: "white",
              }}
            >
              English $ SAT
            </Text>
          </View>
          <RenderSubjects data={subjects.Language} />

        </ScrollView>
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
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
