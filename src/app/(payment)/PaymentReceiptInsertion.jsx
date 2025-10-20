import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { selectedPaymentEnd } from "../../atoms.jsx";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase.ts";

import * as ImagePicker from "expo-image-picker";

const insertData = async (senderName, ref, image) => {
  const { data, error } = await supabase
    .from("payment_bills")
    .insert({
      user_id: "233",
      sender_name: senderName,
      ref_no: ref,
      image: image,
    })
    .select();

  if (error) {
    throw error;
  } else {
    return data;
  }
};

const PaymentReceiptInsertion = () => {
  const [paymentData, setPaymentData] = useAtom(selectedPaymentEnd);
  const [image, setImage] = useState(null);
  const [insertREF, setInsertREF] = useState(false);
  const [ref, setRef] = useState();
  const [senderName, setSenderName] = useState();

  // inserting data to supabse database
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: () => insertData(senderName, ref, image),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (data) => {
      console.log(error);
    },
  });

  console.log("data:", data);
  console.log("error:", error);

  // image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
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
            <TouchableOpacity
              onPress={() => {
                mutate();
              }}
              disabled={isPending}
            >
              <View style={styles.image}>
                <Text style={{ fontFamily: "Poppins-Black" }}>
                  {isPending ? "Submitting" : "Submit"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              {/* Select Image */}
              <TouchableOpacity
                style={styles.image}
                onPress={() => {
                  pickImage();
                }}
              >
                <Ionicons name="image-outline" size={28} color="white" />
                <Text style={styles.optionText}>Select Image</Text>
              </TouchableOpacity>

              <Text style={styles.separator}>────── or ──────</Text>

              {/* Insert Reference */}
              <TouchableOpacity
                style={styles.image}
                onPress={() => setInsertREF((prev) => !prev)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color="white"
                />
                <Text style={styles.optionText}>
                  Input Transaction Ref. & Sender Name
                </Text>
              </TouchableOpacity>

              {/* Reference Form */}
              {insertREF && (
                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Depositor / Sender Name"
                    placeholderTextColor="#888"
                    value={senderName}
                    onChangeText={setSenderName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Transaction Ref"
                    placeholderTextColor="#888"
                    value={ref}
                    onChangeText={setRef}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      mutate();
                    }}
                    style={styles.submitBtn}
                    disabled={isPending}
                  >
                    <Text style={styles.submitText}>
                      {isPending ? "Submitting" : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PaymentReceiptInsertion;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
    flex: 1,
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
    marginVertical: 33,
    flexDirection: "row",
    paddingHorizontal: 28,
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
  optionCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Poppins-Black",
    color: "#333",
    textAlign: "center",
  },
  separator: {
    color: "#888",
    marginVertical: 10,
    fontSize: 18,
    fontFamily: "Poppins-Black",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Black",
  },
});
