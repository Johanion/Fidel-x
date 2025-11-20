import React from "react";
import { View, StyleSheet } from "react-native";
import MathRenderer from "../../services/MathRenderer"; // Adjust path as needed

const RightAwayLatex = () => {
 const content = `
$$\int_0^1 x^2 \, dx = \left[ \frac{x^3}{3} \right]_0^1 = \frac{1}{3}$$
`;




<MathRenderer content={content} />




  return (
    <View style={styles.container}>
      <MathRenderer content={content}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexWrap: "wrap", // Allow content to wrap
  },
});

export default RightAwayLatex;
