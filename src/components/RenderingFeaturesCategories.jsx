import * as Animatable from "react-native-animatable";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

// import specificExam from "../../constants/specificExams";
import React, { useState } from "react";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  return (
    <Animatable.View
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={700}
    >
      <LinearGradient
        colors={[
          item.colors[0],
          item.colors[1],
          item.colors[2],
          item.colors[3],
          item.colors[4],
        ]}
        start={{ x: item.start[0], y: item.start[1] }}
        end={{ x: item.end[0], y: item.end[1] }}
        style={styles.contents}
      >
        <Image
          source={item.image}
          style={{
            width: 100,
            height: 100,
            marginBottom: 30,
            alignSelf: "center",
          }}
          resizeMode="cover"
        />
        <Text style={{ fontFamily: "Poppins-Bold" }}>{item.text}</Text>
        <View></View>
      </LinearGradient>
    </Animatable.View>
  );
};

const RenderingFeaturesCategories = ({ data }) => {
  const [activeItem, setActiveItem] = useState(data[0].$id);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.$id);
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.$id} // ✅ now works because $id exists
      horizontal
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 0 }}
    />
  );
};

export default RenderingFeaturesCategories;

const styles = StyleSheet.create({
  flex:1,
  contents: {
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
});
