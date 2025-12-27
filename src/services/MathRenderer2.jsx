
const inlineStyle = `
html, body {
  display: flex;
  background-color: #fafafa;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  font-size: 4em;
  margin: 0;
  display: flex;
}
`;
import {StyleSheet} from "react-native";
import React, {useState} from "react";
import Katex from "react-native-katex";


export default function MathRenderer2({expression}) {
  const inlineText = 'inline text';
  const [loaded, setLoaded] = useState(false);
  return (
    <Katex
      expression={expression}
      style={styles.katex}
      inlineStyle={inlineStyle}
      displayMode={false}
      throwOnError={false}
      errorColor="#f00"
      macros={{}}
      colorIsTextColor={false}
      onLoad={() => setLoaded(true)}
      onError={() => console.error('Error')}
    />
  );
}


const styles = StyleSheet.create({
  katex: {
    flex: 1,
  }
});
