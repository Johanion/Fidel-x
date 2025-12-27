import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { selectedPaymentEnd } from "../../atoms.jsx";
import { supabase } from "../../lib/supabase.ts";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../providers/AuthProvider";

const PAYMENT_AMOUNT = "799 ETB";

// Support Info
const PHONE_1 = "+251 911 123 456";
const PHONE_2 = "+251 911 654 321";
const TELEGRAM_LINK = "https://t.me/your_support_bot";

// uploading image to supabse storage bucket "payment_receipts"
const uploadImageToSupabase = async (uri) => {
  const fileRes = await fetch(uri);
  // console.log(fileRes)
  // const blob = await fileRes.blob();
  const arrayBuffer = await fileRes.arrayBuffer();
  // const mimeType = fileRes.headers.get("Content-Type") || "image/jpeg";

  const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpeg";
  const filename = `receipt_${Date.now()}_${Math.floor(
    Math.random() * 1000000
  )}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("payment_receipts")
    .upload(filename, arrayBuffer);

  // const { data: urlData } = supabase.storage
  //   .from("payment-receipts")
  //   .getPublicUrl(filename);
  console.log("data", data);
  if (error) {
    throw error;
  } else {
    return data.path;
  }

  // getting the uri of our image to add to the "payment_bill_table" databse
  // if (error) throw error;
  // const { data } = supabase.storage
  //   .from("payment-receipts")
  //   .getPublicUrl(filename);
  // return data.publicUrl;
};

// inserting payment information to databse
const insertData = async (
  userID,
  userName,
  email,
  senderName,
  ref,
  imageUrl,
  bank
) => {
  const { data, error } = await supabase
    .from("payment_bill_receipts")
    .insert({
      user_id: userID,
      user_name: userName,
      email: email,
      sender_name: senderName || "Unknown",
      ref_no: ref || "N/A",
      image: imageUrl || "N/A",
      bank: bank,
    })
    .select();
  if (error) throw error;
  return data;
};

const PaymentReceiptInsertion = () => {
  // user whow insert the payment data
  const [paymentData] = useAtom(selectedPaymentEnd);
  const [image, setImage] = useState(null);
  const [senderName, setSenderName] = useState("");
  const [ref, setRef] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null); // 'photo' or 'reference'
  const [senderInfo, setSenderInfo] = useState({});
  const { session, loading: authLoading } = useAuth(); // get session from AuthProvider

  const mutation = useMutation({
    mutationFn: async () => {
      let imageUrl = null;
      if (image) imageUrl = await uploadImageToSupabase(image); // inserting image to storage and get the URL
      return insertData(
        senderInfo.ID,
        senderInfo.fullName,
        senderInfo.email,
        senderName,
        ref,
        imageUrl,
        paymentData.name
      ); // adding user infomration to database
    },
    onSuccess: () => {
      Alert.alert("Success", "Payment proof submitted successfully!");
      resetForm();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Submission failed.");
    },
  });

  const resetForm = () => {
    setImage(null);
    setSenderName("");
    setRef("");
    setSelectedMethod(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelectedMethod("photo");
    }
  };

  const removeImage = () => {
    setImage(null);
    setSelectedMethod(null);
  };

  const handleSubmit = () => {
    if (selectedMethod === "photo" && !image) {
      Alert.alert("Missing", "Please upload a receipt photo.");
      return;
    }
    if (selectedMethod === "reference" && (!senderName.trim() || !ref.trim())) {
      Alert.alert("Incomplete", "Please fill in sender name and reference.");
      return;
    }
    mutation.mutate();
  };

  const openTelegram = () => {
    Linking.openURL(TELEGRAM_LINK).catch(() =>
      Alert.alert("Error", "Telegram not installed.")
    );
  };

  useEffect(() => {
    const loadSenderInfo = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("id, full_name, email")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        const { id, full_name, email } = data;
        const updateSenderInfo = {
          ID: id,
          fullName: full_name,
          email: email,
        };
        setSenderInfo(updateSenderInfo);
      }
    };
    loadSenderInfo();
  }, []);

  const callPhone = (number) => Linking.openURL(`tel:${number}`);
  console.log(image);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* ────────────────────── Payment Info ────────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#239BA7"
                />
                <Text style={styles.sectionTitle}>Payment Information</Text>
              </View>

              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Amount to Pay</Text>
                <Text style={styles.amount}>{PAYMENT_AMOUNT}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom:19 }}>
                <Image
                  source={paymentData.image}
                  style={styles.gatewayLogo}
                  resizeMode="contain"
                />
                <Text style={styles.gatewayName}>{paymentData.name}</Text>
              </View>
              <View style={styles.gatewayCard}>
                <View style={styles.gatewayInfo}>
                  <Text style={styles.gatewayAcc}>
                    Account: {paymentData.acc}
                  </Text>
                  <Text style={styles.gatewayAcc}>
                    Reciever name: {paymentData.reciever}
                  </Text>
                </View>
              </View>
            </View>

            {/* ────────────────────── Choose Method ────────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="git-branch-outline" size={24} color="#239BA7" />
                <Text style={styles.sectionTitle}>
                  Choose Submission Method
                </Text>
              </View>

              {/* Option 1: Upload Photo */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedMethod === "photo" && styles.optionCardSelected,
                ]}
                onPress={pickImage}
              >
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="camera"
                    size={28}
                    color={selectedMethod === "photo" ? "#fff" : "#239BA7"}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Upload Receipt Photo</Text>
                  <Text style={styles.optionDesc}>
                    Take a clear photo of your payment receipt or screenshot.
                  </Text>
                </View>
                {selectedMethod === "photo" && (
                  <Ionicons name="checkmark-circle" size={24} color="#239BA7" />
                )}
              </TouchableOpacity>

              {/* Option 2: Enter Reference */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedMethod === "reference" && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedMethod("reference")}
              >
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="document-text"
                    size={28}
                    color={selectedMethod === "reference" ? "#fff" : "#239BA7"}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Enter Reference Number</Text>
                  <Text style={styles.optionDesc}>
                    Provide sender name and transaction reference from your
                    bank.
                  </Text>
                </View>
                {selectedMethod === "reference" && (
                  <Ionicons name="checkmark-circle" size={24} color="#239BA7" />
                )}
              </TouchableOpacity>

              {/* Show Upload Preview */}
              {selectedMethod === "photo" && image && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={28} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Show Reference Form */}
              {selectedMethod === "reference" && (
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder="Sender Name"
                    value={senderName}
                    onChangeText={setSenderName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Transaction Reference"
                    value={ref}
                    onChangeText={setRef}
                  />
                </View>
              )}
            </View>

            {/* ────────────────────── Submit ────────────────────── */}
            {(selectedMethod === "photo" && image) ||
            (selectedMethod === "reference" && senderName && ref) ? (
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  mutation.isPending && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Submit Payment Proof</Text>
                )}
              </TouchableOpacity>
            ) : null}

            {mutation.error && (
              <Text style={styles.errorText}>
                {mutation.error.message || "Something went wrong."}
              </Text>
            )}

            {/* ────────────────────── Support ────────────────────── */}
            <View style={styles.supportSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="headset-outline" size={24} color="#239BA7" />
                <Text style={styles.sectionTitle}>Need Help?</Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#239BA7" />
                <Text style={styles.contactText}>Call us:</Text>
              </View>

              <TouchableOpacity
                style={styles.phoneBtn}
                onPress={() => callPhone(PHONE_1)}
              >
                <Text style={styles.phoneText}>{PHONE_1}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.phoneBtn}
                onPress={() => callPhone(PHONE_2)}
              >
                <Text style={styles.phoneText}>{PHONE_2}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.telegramBtn}
                onPress={openTelegram}
              >
                <FontAwesome name="paper-plane" size={18} color="white" />
                <Text style={styles.telegramText}>
                  Chat with us on Telegram
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PaymentReceiptInsertion;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },

  // Section Card
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#1a1a1a",
    marginLeft: 10,
  },

  // Payment Info
  amountBox: {
    backgroundColor: "rgba(35, 155, 167, 0.15)",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#239BA7",
    alignItems: "center",
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: "#239BA7",
    fontFamily: "Poppins-SemiBold",
  },
  amount: { fontSize: 28, fontFamily: "Poppins-Black", color: "#239BA7" },
  gatewayCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  gatewayLogo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 6,
  },
  gatewayInfo: { marginLeft: 12, flex: 1 },
  gatewayName: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1a1a1a",
  },
  gatewayAcc: { fontSize: 14, fontFamily: "Poppins-Bold", color: "green" },

  // Option Cards
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    backgroundColor: "#239BA7",
    borderColor: "#239BA7",
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(35, 155, 167, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionTextContainer: { flex: 1, marginLeft: 14 },
  optionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1a1a1a",
  },
  optionDesc: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 2,
  },

  // Upload Preview
  imagePreview: {
    position: "relative",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
  },
  previewImage: { width: "100%", height: "100%" },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 4,
  },

  // Reference Form
  form: { marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
  },

  // Submit
  submitBtn: {
    backgroundColor: "#239BA7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitBtnDisabled: { backgroundColor: "#aaa" },
  submitText: { color: "#fff", fontSize: 16, fontFamily: "Poppins-SemiBold" },
  errorText: {
    marginTop: 12,
    color: "#e74c3c",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },

  // Support
  supportSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#239BA7",
  },
  phoneBtn: { alignSelf: "center", marginBottom: 6 },
  phoneText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#239BA7",
    textDecorationLine: "underline",
  },
  telegramBtn: {
    flexDirection: "row",
    backgroundColor: "#0088cc",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 12,
  },
  telegramText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 10,
  },
});
