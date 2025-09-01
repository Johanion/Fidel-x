import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import featureCat from "../../constants/featureCat.js";
import Exams from "../../constants/Exams.js";
import HorFeature from "../(exams)/horFeature.jsx";
import specificExam from "../../constants/specificExams";

const exam = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
        {/* main contents */}
        <FlatList
          data={Exams}
          renderItem={({ item }) => {
            return (
              <View style={styles.contents}>
                <Image
                  source={item.image}
                  style={{ width: 120, height: 120 }}
                />
                <Text style={{ fontFamily: "Poppins-ExtraBold" }}>
                  {item.name}
                </Text>
              </View>
            );
          }}
          numColumns={2}
          ListHeaderComponent={
            <View>
              <FontAwesome5
                name="stream"
                size={20}
                color="white"
                style={{ letterSpacing: 4, margin: 13 }} // small spacing effect
              />

              {/* slogan box */}
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="check-circle"
                      size={18}
                      color="white"
                      style={{ marginRight: 10 }}
                    />

                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        flex: 1,
                        color: "black",
                        fontSize: 15,
                      }}
                    >
                      {/* text 1 */}
                      Take tests with {}
                      <Text
                        style={{ fontFamily: "Poppins-Black", color: "black" }}
                      >
                        AI-powered {}
                      </Text>
                      explanations.
                    </Text>
                  </View>
                  {/* text 2 */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="check-circle"
                      size={18}
                      color="white"
                      style={{ marginRight: 10 }}
                    />

                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        flex: 1,
                        color: "black",
                        fontSize: 15,
                      }}
                    >
                      Review your scores instantly and understand every answer{" "}
                    </Text>
                  </View>
                  {/* text 3 */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="check-circle"
                      size={18}
                      color="white"
                      style={{ marginRight: 10 }}
                    />

                    <Text
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        flex: 1,
                        color: "black",
                        fontSize: 15,
                      }}
                    >
                      Practice with hundreds of EUEE and model exams.
                    </Text>
                  </View>
                </Text>
              </LinearGradient>

              {/* featured categories */}
              <View
                style={{
                  flexDirection: "row",
                  margin: 15,
                  alignItems: "center",
                  borderRadius: 12,
                  borderWidth: 0.5,
                  borderColor: "white",
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
                    fontSize: 18,
                    color: "white",
                    marginLeft: 12,
                    flex: 1,
                  }}
                >
                  “Take tests by topic for{" "}
                  <Text style={{ color: "#FFE100" }}>English</Text> and{" "}
                  <Text style={{ color: "#FFE100" }}>Aptitude</Text> subjects to
                  focus on specific areas.”
                </Text>
                <View
                  style={{
                    backgroundColor: "#FFE100",
                    width: 6,
                    height: 23,
                    marginRight: 10,
                    borderRadius: 24,
                  }}
                ></View>
              </View>

              {/* specific exams for english and aptitude */}
              <View style={{ overflow: "visible" }}>
                <HorFeature data={specificExam} />
              </View>

              {/* introduction */}
              <View
                style={{
                  flexDirection: "row",
                  margin: 15,
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="pen" // or "pen-alt" for alternate style
                  size={24}
                  color="#FFE100"
                />
                <Text
                  style={{
                    fontFamily: "Poppins-Black",
                    fontSize: 21,
                    color: "white",
                    marginLeft: 12,
                  }}
                >
                  EUEE and model exams
                </Text>
              </View>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default exam;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 23,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 30 },
    }),
  },
  contents: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 30 },
    }),
  },
  sloganBox: {
    alignSelf: "center",
    flex: 1,
    borderRadius: 20,
  },
});
