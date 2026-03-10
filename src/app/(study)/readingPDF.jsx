import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAtom } from "jotai";
import * as FileSystem from "expo-file-system";
// import * as ScreenOrientation from "expo-screen-orientation";

// ----------------------------------------------------
import { selectedSubjectSpecificContent } from "../../atoms";
import { useState, useEffect, useCallback } from "react";
import PDFView from "react-native-pdf";

const ReadingPDF = () => {
  const [content] = useAtom(selectedSubjectSpecificContent);

  // Set isLoading to true initially, or until the check is done.
  const [pdfSource, setPdfSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- Initialize to true
  const [error, setError] = useState(null);

  // Define loadOfflinePdf using useCallback to ensure stable function reference
  const loadOfflinePdf = useCallback(async () => {
    if (!content?.pdfUri) {
      setError("No PDF found. Please download the topic first.");
      setIsLoading(false);
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(content.pdfUri);
      console.log("File info:", fileInfo);

      if (!fileInfo.exists) {
        setError("PDF file not found on device. Try re-downloading.");
      } else {
        // Directly use the file URI — no Base64!
        setPdfSource(content.pdfUri);
      }
    } catch (err) {
      console.error("Error checking PDF:", err);
      setError("Cannot access PDF file.");
    } finally {
      setIsLoading(false);
    }
  }, [content?.pdfUri]); // Dependency array should include what the function uses

  // Trigger the loading when pdfUri changes
  useEffect(() => {
    loadOfflinePdf();
  }, [loadOfflinePdf]); // Dependency on the stable function reference

  // allowing Auto-Rotate for this screen only
  // useEffect(() => {
  //   const enableAutoRotate = async () => {
  //     await ScreenOrientation.unlockAsync(); 
  //     // This allows portrait + landscape
  //   };

  //   enableAutoRotate();

  //   // When leaving screen → lock back to portrait
  //   return () => {
  //     ScreenOrientation.lockAsync(
  //       ScreenOrientation.OrientationLock.PORTRAIT
  //     );
  //   };
  // }, []);

  // ------------------------------------------------------------------
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorText}>File URI: {content?.pdfUri}</Text>
      </View>
    );
  }

  if (isLoading || !pdfSource) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Loading PDF...</Text>
      </View>
    );
  }
  // ------------------------------------------------------------------

  return (
    <>

      {/* PDF Viewer */}
      <PDFView
        source={{ uri: pdfSource, cache: true }}
        style={{ flex: 1 }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Loaded PDF with ${numberOfPages} pages`);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    </>
  );
};


export default ReadingPDF;

const styles = StyleSheet.create({
  // ... (Your existing styles) ...
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 60,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  pdfName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
