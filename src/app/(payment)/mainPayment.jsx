import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import gateway from "../../constants/gateway";
import RenderingPaymentGateway from "../../components/RenderingPaymentGateway.jsx";
import paymentlogo from "../../../assets/images/BankGateway/paymentlogo.jpg";

const menu = () => {
  // metadata of payments end
  const paymentGatewayData = [
    { name: "telebirr", image: gateway.telebirr, acc: "111111111111" },
    { name: "cbe birr", image: gateway.cbeBirr, acc: "2222222222222" },
    { name: "E-birr", image: gateway.ebirr, acc: "33333333333333" },
    { name: "Awash Bank", image: gateway.awash, acc: "444444444444" },
    { name: "Abyssinia Bank", image: gateway.abyssinia, acc: "5555555555" },
    { name: "COOP", image: gateway.coop, acc: "66666666666" },
    { name: "Wegagen Bank", image: gateway.wegagen, acc: "777777777777" },
    { name: "Nib Bank", image: gateway.nib, acc: "88888888888888" },
    { name: "Hibret Bank", image: gateway.hibret, acc: "999999999" },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <FlatList
          data={paymentGatewayData}
          renderItem={({ item }) => {
            return <RenderingPaymentGateway data={item} />;
          }}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View
              style={{
                marginVertical: 6,
                marginBottom: 26,
                alignSelf: "center",
                borderRadius: 20,
                overflow: "hidden", // makes borderRadius apply to the image
                backgroundColor: "white",
              }}
            >
              {/* Header text */}
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 12,
                  fontSize: 20,
                  backgroundColor: "#DDF4E7",
                  fontFamily: "Poppins-Black",
                  
                }}
              >
                Payment Method
              </Text>

              {/* Image */}
              <Image
                source={paymentlogo}
                style={{
                  width: 300,
                  height: 180,
                  alignSelf: "center",
                }}
                resizeMode="cover"
              />
              <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "#DDF4E7"}}>
                <Text style={{fontFamily: "Poppins-Black", fontSize: 16}}>Amount to pay</Text>
                <Text style={{fontFamily: "Poppins-Black", fontSize: 16}}>ETB 500</Text>
              </View>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default menu;

const styles = StyleSheet.create({});
