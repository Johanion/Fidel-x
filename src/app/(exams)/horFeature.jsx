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

// import specificExam from "../../constants/specificExams";
import React, { useState } from "react";

const zoomIn = {
  0: {
    scale: 0.8,
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
    scale: 0.8,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  return (
    <Animatable.View
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={700}
    >
      <View style={styles.contents}>
        <Text style={{ fontFamily: "Poppins-ExtraBold" }}>{item.type}</Text>

        <Image source={item.image} style={{ width: 120, height: 120 }} />
        <Text style={{ fontFamily: "Poppins-ExtraBold" }}>{item.name}</Text>
      </View>
    </Animatable.View>
  );
};

const HorFeature = ( {data} ) => {
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
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default HorFeature;

const styles = StyleSheet.create({
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
