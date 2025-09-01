import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSetAtom } from "jotai";
import {selectedPaymentEnd} from "../atoms.jsx"


const RenderingPaymentGateway = ({ data }) => {
  const setPaymentData = useSetAtom(selectedPaymentEnd)

  const goToPaymentImagePicker = ( pData ) => {
    router.push("../PaymentReceiptInsertion");
    console.log(pData)
    setPaymentData(pData);
  };
  return (
    <TouchableOpacity
      onPress={() => {
        goToPaymentImagePicker(data);
      }}
      style={styles.container}
    >
      <View style={{flex:1}}>
        <Image
          source={data.image}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
        <Text style={{ marginVertical: 10, fontFamily: "Poppins-SemiBold", fontSize: 15 }}>{data.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderingPaymentGateway;

const styles = StyleSheet.create({
  container: {
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
});
