import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { selectedPaymentEnd } from "../../atoms.jsx";
import { useAtom } from "jotai";

import * as ImagePicker from "expo-image-picker";

const PaymentReceiptInsertion = () => {
  const [paymentData, setPaymentData] = useAtom(selectedPaymentEnd);
  const [image, setImage] = useState(null);

  // image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* payment option end logo */}
          <View style={styles.logo}>
            <Image
              source={image ? { uri: image } : paymentData.image}
              style={{ width: 150, height: 150 }}
            />
          </View>

          <Text
            style={{
              alignSelf: "center",
              marginTop: 12,
              fontFamily: "Poppins-Bold",
              fontSize: 20,
            }}
          >
            {paymentData.name}
          </Text>

          {/* account information */}
          <View style={styles.info}>
            <Text style={{ fontFamily: "Poppins-Bold" }}>
              account information
            </Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>.....</Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>.....</Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>.....</Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>.....</Text>
            <Text style={{ fontFamily: "Poppins-Bold" }}>.....</Text>
          </View>

          {/* image inset */}
          {image ? (
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.image}>
                <Text style={{ fontFamily: "Poppins-Black" }}>
                  Upload image
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.image}>
                <Text style={{ fontFamily: "Poppins-Black" }}>
                  Select image
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PaymentReceiptInsertion;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
  },
  logo: {
    marginHorizontal: 98,
    paddingVertical: 12,
    borderRadius: 19,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000", // color of shadow
        shadowOffset: { width: 0, height: 2 }, // offset in x & y
        shadowOpacity: 0.25, // transparency of shadow
        shadowRadius: 3.84, // blur radius
      },
      android: {
        elevation: 29,
      },
    }),
  },
  info: {
    marginHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 19,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000", // color of shadow
        shadowOffset: { width: 0, height: 2 }, // offset in x & y
        shadowOpacity: 0.25, // transparency of shadow
        shadowRadius: 3.84, // blur radius
      },
      android: {
        elevation: 29,
      },
    }),
  },
  image: {
    backgroundColor: "#239BA7",
    marginTop: 73,
    marginHorizontal: 98,
    paddingVertical: 12,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000", // color of shadow
        shadowOffset: { width: 0, height: 2 }, // offset in x & y
        shadowOpacity: 0.25, // transparency of shadow
        shadowRadius: 3.84, // blur radius
      },
      android: {
        elevation: 29,
      },
    }),
  },
});
