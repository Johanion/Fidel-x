import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { selectedPaymentEnd } from "../atoms.jsx";

const RenderingPaymentGateway = ({ data }) => {
  const setPaymentData = useSetAtom(selectedPaymentEnd);

  const goToPaymentImagePicker = (pData) => {
    setPaymentData(pData);
    router.push("../PaymentReceiptInsertion");
  };

  return (
    <TouchableOpacity
      onPress={() => goToPaymentImagePicker(data)}
      style={styles.card}
      activeOpacity={1}
    >
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Image source={data.image} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Bank Name */}
      <Text style={styles.bankName} numberOfLines={2}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );
};

export default RenderingPaymentGateway;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth:1,
    borderColor: "#239BA7",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 130,
    maxWidth: "30%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  logoContainer: {
    width: 56,
    height: 56,
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 6,
  },
  logo: {
    width: 60,
    height: 60,
  },
  bankName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#030303ff",
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 16,
  },
  accountNumber: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
});
