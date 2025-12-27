// ReadingDoc.js
import React from "react";
import { ScrollView, Dimensions, Platform } from "react-native";
import MathJax from "react-native-mathjax"; // Make sure you have this installed

const { width } = Dimensions.get("window");

const MathRenderer = ({latexContent}) => {
  return (
    <ScrollView
      contentContainerStyle={{
      }}
    >
      <MathJax
        html={latexContent}
        mathJaxOptions={{
          messageStyle: "none",
          extensions: ["tex2jax.js"],
          jax: ["input/TeX", "output/HTML-CSS"],
          tex2jax: {
            inlineMath: [["(", "\)"]],
            displayMath: [["[", "\]"]],
            processEscapes: true,
            preview: "none",
          },
          TeX: {
            extensions: [
              "AMSmath.js",
              "AMSsymbols.js",
              "noErrors.js",
              "noUndefined.js",
            ],
            Macros: {
              text: ["\\text{#1}", 1],
            },
          },
          showMathMenu: false,
        }}
        // Styling the WebView
        style={{
          width: width - 40, // full width minus padding
        }}
        customStyle={`
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 18px;
            line-height: 1.7;
            color: #222;
            margin: 0;
            padding: 10px;
          }
          h2, h3, h4 {
            color: #2c3e50;
            margin: 30px 0 15px 0;
            font-weight: bold;
          }
          ul, ol {
            padding-left: 20px;
          }
          .MathJax_Display {
            margin: 20px 0 !important;
            text-align: center;
          }
        `}
        // Optional: better Android scaling
        scalesPageToFit={Platform.OS === "android"}
        heightOffset={30}
      />
     </ScrollView>
  );
};

export default React.memo(MathRenderer);
