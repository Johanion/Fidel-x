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

import { useSetAtom } from "jotai";
import { selectedSubject } from "../../src/atoms.jsx";
import { router } from "expo-router";

const RenderSubjects = ({ data }) => {
  const setSubject = useSetAtom(selectedSubject);
  console.log(data[0].topic)  
  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity style={styles.contents} onPress={()=>{
            setSubject(item.topic)
            router.push("../../(study)/topics")
            
                                      
          }}>
            <Image
              source={item.image}
              style={{ width: "65%", height: 180, resizeMode: "cover" }}
            />

            <Text style={{ fontFamily: "Poppins-ExtraBold" }}>{item.name}</Text>
          </TouchableOpacity>
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
