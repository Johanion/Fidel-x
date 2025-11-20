import { StyleSheet, Text, View } from 'react-native'
import { selectedSubjectSpecificContent } from "../../atoms"; 
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const readingPDF = () => {
  const [content] = useAtom(selectedSubjectSpecificContent);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [theme, setTheme] = useState('light');
  const [showBar, setShowBar] = useState(true);

  useEffect(() => {
    
      const loadOfflinePdf = async () => {
        if (!content?.pdfUri) {
          setError("No quiz data. Please download content first.");
          setIsLoading(false);
          return;
        }
  
        try {
          const fileContent = await FileSystem.readAsStringAsync(
            content.pdfUri
          );
          const data = JSON.parse(fileContent);
            
          if (!data || data===undefined || data===null) {
            setError("No pdf found in file.");
          } else {
            setData(data);
            console.log(`Loaded ${questions.length} preparation questions!`);
          }
          setIsLoading(false);
        } catch (err) {
          console.log("Read error:", err);
          setError("Failed to load quiz. Try re-downloading.");
          setIsLoading(false);
        }
      };
  
      loadOfflinePdf();
    }, [content?.pdfUri]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleScreenPress = () => {
    setShowBar(!showBar);
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={handleScreenPress}>
      {/* Top Bar */}
      {showBar && (
        <View style={styles.topBar}>
          <Text style={styles.pdfName}>{pdfName}</Text>
          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <Text style={styles.buttonText}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PDF Viewer */}
      <WebView
        source={{
          uri:
            theme === 'light'
              ? `https://docs.google.com/gview?embedded=true&url=${lightPdfUrl}`
              : `https://docs.google.com/gview?embedded=true&url=${darkPdfUrl}`,
        }}
        style={{ flex: 1 }}
      />
    </Pressable>
  );
};

export default readingPDF

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  pdfName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});




