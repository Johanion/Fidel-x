import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RenderSubjects = ({ data }) => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={({ item }) => {
        return (
          <View style={styles.contents}>
            <Image
              source={item.image}
              style={{  width: "65%", height: 180, resizeMode: "cover" }}
            />
            <Text style={{ fontFamily: "Poppins-ExtraBold" }}>{item.name}</Text>
          </View>
        );
      }}
    />
  );
};

export default RenderSubjects;

const styles = StyleSheet.create({
  contents: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
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
});
