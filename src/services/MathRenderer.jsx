import { useState, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const MathRenderer = ({ latex, style }) => {
  const [webViewHeight, setWebViewHeight] = useState(24);
  const [localHtml, setLocalHtml] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const loadKaTeX = async () => {
      try {
        // Load local JS and CSS from assets
        const jsAsset = Asset.fromModule(require("../../assets/katex/katex.min.js"));
        const cssAsset = Asset.fromModule(require("../../assets/katex/katex.min.css"));

        await jsAsset.downloadAsync();
        await cssAsset.downloadAsync();

        const jsUri = jsAsset.localUri || jsAsset.uri;
        const cssUri = cssAsset.localUri || cssAsset.uri;

        // Build the HTML string using local KaTeX files
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="${cssUri}">
              <script src="${jsUri}"></script>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background: transparent;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                }
                .math-container {
                  display: inline-block;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #000 !important;
                  max-width: 100%;
                  overflow-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <span id="math" class="math-container"></span>
              <script>
                try {
                  const latexInput = ${JSON.stringify(latex || "")};
                  katex.render(latexInput, document.getElementById('math'), { throwOnError: false });
                  const height = document.body.scrollHeight || 24;
                  window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
                } catch (e) {
                  document.getElementById('math').innerText = latexInput || 'Invalid LaTeX';
                  window.ReactNativeWebView.postMessage(JSON.stringify({ height: 24 }));
                }
              </script>
            </body>
          </html>
        `;
        setLocalHtml(html);
      } catch (err) {
        console.error("KaTeX asset loading failed:", err);
      }
    };

    loadKaTeX();
  }, [latex]);

  if (!localHtml) return null;

  return (
    <View style={[styles.container, style, { height: webViewHeight }]}>
      <WebView
        originWhitelist={["*"]}
        allowFileAccess
        allowUniversalAccessFromFileURLs
        source={{ html: localHtml }}
        style={[styles.webview, { width: screenWidth - 10 }]}
        scrollEnabled={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) setWebViewHeight(data.height);
          } catch (err) {
            console.error("Message parsing failed:", err);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  webview: {
    backgroundColor: "transparent",
  },
});

export default MathRenderer;
