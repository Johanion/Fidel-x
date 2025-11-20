import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import gateway from "../../constants/gateway";
import RenderingPaymentGateway from "../../components/RenderingPaymentGateway.jsx";
import { LinearGradient } from "expo-linear-gradient";

const PAYMENT_AMOUNT = "799 ETB";

// Support Info
const PHONE_1 = "+251 911 123 456";
const PHONE_2 = "+251 911 654 321";
const TELEGRAM_LINK = "https://t.me/your_support_bot"

const menu = () => {
  const paymentGatewayData = [
    { name: "Telebirr", image: gateway.telebirr, acc: "111111111111" },
    { name: "CBE Birr", image: gateway.cbeBirr, acc: "2222222222222" },
    { name: "E-birr", image: gateway.ebirr, acc: "33333333333333" },
    { name: "Awash Bank", image: gateway.awash, acc: "444444444444" },
    { name: "Abyssinia Bank", image: gateway.abyssinia, acc: "5555555555" },
    { name: "COOP", image: gateway.coop, acc: "66666666666" },
    { name: "Wegagen Bank", image: gateway.wegagen, acc: "777777777777" },
    { name: "Nib Bank", image: gateway.nib, acc: "88888888888888" },
    { name: "Hibret Bank", image: gateway.hibret, acc: "999999999" },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Select Payment Method</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amount}>{PAYMENT_AMOUNT}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.paymentInfoSection}>
      <Text style={styles.infoTitle}>Payment Information</Text>

      <View style={styles.contactRow}>
        <Ionicons name="call-outline" size={20} color="#239BA7" />
        <Text style={styles.contactText}>Call us:</Text>
      </View>

      <TouchableOpacity style={styles.phoneBtn} onPress={() => Linking.openURL(`tel:${PHONE_1}`)}>
        <Text style={styles.phoneText}>{PHONE_1}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.phoneBtn} onPress={() => Linking.openURL(`tel:${PHONE_2}`)}>
        <Text style={styles.phoneText}>{PHONE_2}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.telegramBtn}
        onPress={() => Linking.openURL(TELEGRAM_LINK).catch(() => alert("Telegram not installed"))}
      >
        <FontAwesome name="paper-plane" size={18} color="white" />
        <Text style={styles.telegramText}>Chat with us on Telegram</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#E0F2ED", "#FFFFFF"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <FlatList
            data={paymentGatewayData}
            renderItem={({ item }) => <RenderingPaymentGateway data={item} />}
            numColumns={3}
            columnWrapperStyle={styles.row}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.acc}
          />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  title: {
    fontSize: 23,
    fontFamily: "Poppins-Bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 14,
  },
  amountContainer: {
    alignItems: "center",
    backgroundColor: "rgba(35, 155, 167, 0.15)",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#239BA7",
  },
  amountLabel: {
    fontSize: 14,
    color: "#239BA7",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  amount: {
    fontSize: 30,
    fontFamily: "Poppins-Black",
    color: "#239BA7",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 16,
  },

  // Grid
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // Payment Info Footer
  paymentInfoSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#239BA7",
  },
  phoneBtn: {
    alignSelf: "center",
    marginBottom: 8,
  },
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
    paddingHorizontal: 28,
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