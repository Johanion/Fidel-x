import React from "react";
import { View, StyleSheet } from "react-native";
import MathRenderer from "../../services/MathRenderer"; // Adjust path as needed

const RightAwayLatex = () => {
  return (
    <View style={styles.container}>
      <MathRenderer latex={"\\text{Find the ddddddddddd dddddddd value of } \\int_0^1 \\frac{x^2}{1+x} \\, dx"} />
      <MathRenderer latex={"\\text{The sum offfffffffffffffffffffffffffffffffff} \\sum_{n=0}^{\\infty} \\frac{1}{n!} \\text{ converges to } e"} />
      <MathRenderer latex={"\\text{Evaluateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee } \\lim_{x \\to 0} \\frac{\\sin x}{x}"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexWrap: 'wrap', // Allow content to wrap
  },
});

export default RightAwayLatex;