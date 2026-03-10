import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { selectedSubject, selectedSubjectSpecificContent } from "../../atoms";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { themeAtom } from "../../atoms.jsx";

import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

import * as FileSystem from "expo-file-system";
import { Svg, Circle, G, Text as SvgText } from "react-native-svg";

const Topics = () => {
  const router = useRouter();
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const [theme, setTheme] = useAtom(themeAtom);

  // Subject icons with colors
  const subjectIcons = useMemo(
    () => [
      { name: "Biology", icon: "leaf", color: "#43a047" },
      { name: "Chemistry", icon: "flask", color: "#1e88e5" },
      { name: "Physics", icon: "atom", color: "#f57c00" },
      { name: "Geography", icon: "globe-africa", color: "#2e7d32" },
      { name: "History", icon: "landmark", color: "#795548" },
      { name: "English", icon: "book", color: "#1565c0" },
      { name: "Economics", icon: "chart-line", color: "#f9a825" },
      { name: "SAT", icon: "book", color: "#388e3c" },
    ],
    [],
  );

  // session data states
  const { session, loading: authLoading } = useAuth();
  const [Status, setStatus] = useState(); //user authoritization status

  // selected subject states
  const [selectedSubjectValue] = useAtom(selectedSubject); //eg. biology
  const setSelectedSubjectSpecificContent = useSetAtom(
    selectedSubjectSpecificContent,
  ); //eg. genetics
  const subject = selectedSubjectValue[0]?.subjectCode;
  const subjectMatch = subjectIcons.find((s) => s.name === subject); // subjectIcons[0];

  // download data states
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingID, setDownloadingID] = useState();
  const [allDownloaded, setAllDownloaded] = useState({});
  // const [progress, setProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState({}); // { itemId: 0.65 }
  const [currentlyDownloading, setCurrentlyDownloading] = useState({});

  // Download Progress Simulation
  const size = 56;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // const strokeDashoffset = circumference - circumference * progress;

  const colors = {
    light: {
      backgroundColor: "white",
      greeting: "#111111",
      welcome: "#006400",
      fidelx: "#FFE100",
      darkGreen: "#014421",
      pageGradient1: "#E0F2ED",
      pageGradient2: "#FFFFFF",
      pageGradient3: "#fff",
      pageGradient4: "#fff",
      moon: "#1a1a1a",
    },
    dark: {
      backgroundColor: "white",
      greeting: "#C9D1D9",
      welcome: "#C9D1D9",
      fidelx: "#FFE100",
      darkGreen: "#E5E7EB",
      pageGradient1: "#0B1220",
      pageGradient2: "#020617",
      pageGradient3: "#0B1220",
      pageGradient4: "#020617",
      moon: "#C9D1D9",
    },
  };

  // dynamic files based on subject + ID
  const FILE = subject?.toLowerCase();
  const getFilesForItem = (item) => {
    const ID = item.id;
    return [
      {
        name: "pdf",
        type: "pdf",
        url: `${ID}.pdf`,
        localName: `${FILE}_read_${ID}`,
      },
      { name: "flashcards", type: "json", table: `${FILE}_flashcard_${ID}` },
      {
        name: "EUEE preparation",
        type: "json",
        table: `${FILE}_preparation_${ID}`,
      },
      { name: "EUEE", type: "json", table: `${FILE}_euee_${ID}` },
    ];
  };
  // local file paths
  const getFileUri = (fileName) => {
    return `${FileSystem.documentDirectory}${fileName}`;
  };

  // check if the item's file exist
  const checkAllFilesDownloaded = async () => {
    if (
      !selectedSubjectValue ||
      selectedSubjectValue.length === 0 ||
      !subject
    ) {
      setAllDownloaded({});
      return;
    }

    const downloadedStatus = {};

    for (const item of selectedSubjectValue) {
      const files = getFilesForItem({ id: item.id }); // your function
      let allFilesExist = true;

      for (const file of files) {
        let fileName = "";

        if (file.type === "json" && file.table) {
          fileName = `${file.table}.json`; // e.g. biology_flashcard_5.json
        }
        // Add PDF later if needed
        else if (file.type === "pdf" && file.localName) {
          fileName = `${file.localName}.pdf`;
        }

        if (!fileName) continue;

        const fileUri = getFileUri(fileName); // uses your function exactly

        try {
          // await FileSystem.deleteAsync(fileUri, { idempotent: true });
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
            allFilesExist = false;
            console.log("Missing:", fileName);
            break; // no need to check other files
          }
        } catch (error) {
          allFilesExist = false;
          break;
        }
      }

      downloadedStatus[item.id] = allFilesExist;
    }

    // Update state once
    setAllDownloaded(downloadedStatus);
    console.log("Files checked on disk:", downloadedStatus);
  };

  /************load saved data from device ***************/
  const downloadAllContent = async (itemId) => {
    console.log("all Downloaded", allDownloaded);
    if (allDownloaded[itemId]) return;
    setCurrentlyDownloading((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    setDownloadProgress((prev) => ({ ...prev, [itemId]: 0 }));
    const FILES_TO_DOWNLOAD = getFilesForItem({ id: itemId }); // Get files for THIS item

    try {
      for (let i = 0; i < FILES_TO_DOWNLOAD.length; i++) {
        console.log(i);
        const file = FILES_TO_DOWNLOAD[i];
        console.log("file", file);

        if (file.type === "pdf") {
          await downloadPdf(file.url, file.localName);
        } else {
          await downloadJsonFromTable(file.table);
        }

        const newProgress = (i + 1) / FILES_TO_DOWNLOAD.length;
        setDownloadProgress((prev) => ({ ...prev, [itemId]: newProgress }));
      }
      setAllDownloaded((prev) => ({ ...prev, [itemId]: true }));

      // loadAllContentIntoMemory(itemId);

      Alert.alert("Success", "All files downloaded! Ready to study offline!");
    } catch (error) {
      // setIsDownloading(false);
      // setDownloadingID(false);
      // setProgress(0);
      Alert.alert("Download Failed", error.message, "Please try again later");
    } finally {
      setCurrentlyDownloading((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  /********************* load all contents into jotai atom ****************************/
  const loadAllContentIntoMemory = (itemId) => {
    const FILES_TO_DOWNLOAD = getFilesForItem({ id: itemId }); // Get files for THIS item
    console.log("FILES_TO_DOWNLOAD", FILES_TO_DOWNLOAD);

    const content = {
      pdfUri: getFileUri(`${FILES_TO_DOWNLOAD[0].localName}.pdf`),
      flashcardsUri: getFileUri(`${FILES_TO_DOWNLOAD[1].table}.json`),
      preparationUri: getFileUri(`${FILES_TO_DOWNLOAD[2].table}.json`),
      eueeUri: getFileUri(`${FILES_TO_DOWNLOAD[3].table}.json`),
    };
    setSelectedSubjectSpecificContent(content);
  };

  /*********** Download from supabase + save to device */
  // Download PDF with resume support
  // const downloadPdf = async (url, localName) => {
  //   // Fetch the private file data using the Supabase SDK
  //   const { data, error } = supabase.storage
  //     .from(FILE) // e.g. 'biology'
  //     .getPublicUrl(url);
  //   console.log("errrrrrrrrrrrrr", error);
  //   if (error || !data?.publicUrl) throw new Error("Can't get public URL");
  //   const publicUrl = data.publicUrl;
  //   console.log("publicUrl", publicUrl);
  //   await FileSystem.downloadAsync(publicUrl, getFileUri(localName + ".pdf"));

  //   // const {data, error} = await supabase.storage
  //   // .from(FILE)
  //   // .download(url)

  //   // if(error) throw error;

  //   // const blobToBase64 = (blob)=>
  //   //   new promise((resolve,reject)=>{
  //   //     const reader new FileReader();
  //   //     reader.onloadend =()=>{
  //   //       const base64data= reader.result.split(','[1];
  //   //         resolve(base64data);
  //   //       )
  //   //     }
  //   //   })
  // };

  /************** Downlaod from supabse private bucket wiht signed URLs ******************/
  const downloadPdf = async (pathInBucket, localName) => {
    try {
      // 1. Request a temporary "Signed URL" (valid for 60 seconds)
      // This triggers your 'is_active_profile' SQL policy!
      const { data, error } = await supabase.storage
        .from(FILE) // e.g., 'geography'
        .createSignedUrl(pathInBucket, 600);

      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Could not generate signed URL");

      const signedUrl = data.signedUrl;
      const fileUri = getFileUri(localName + ".pdf");

      // 2. Download the file using the temporary link
      const downloadResult = await FileSystem.downloadAsync(signedUrl, fileUri);

      console.log("Finished downloading to:", downloadResult.uri);
      return downloadResult.uri;
    } catch (err) {
      console.error("Download Error:", err.message);
      throw err;
    }
  };

  // Download JSON from Supabase table
  const downloadJsonFromTable = async (table) => {
    const { data, error } = await supabase.from(table).select("*").order("id");
    if (error) throw error;
    if (!data) throw new Error("No data");
    const jsonString = JSON.stringify(data);
    await FileSystem.writeAsStringAsync(
      getFileUri(table + ".json"),
      jsonString,
    );
  };

  // handle card press
  const handleCardPress = (checkID) => {
    if (!Status) {
    } else if (allDownloaded[checkID]) {
      router.push("../../(study)/allStudyTools");
      loadAllContentIntoMemory(checkID); // preapre all the files path and pass to next pages.
    } else {
      downloadAllContent(checkID);
    }
  };

  // caching user payment Status
  useEffect(() => {
    setIsDownloading(false);
    const loadStatus = async () => {
      try {
        // first try to get name from local storage
        const storedStatus = await AsyncStorage.getItem("status");
        if (storedStatus && storedStatus !== undefined) {
          setStatus(JSON.parse(storedStatus));
        }

        // Then, try to fetch from supabase (if user is online)
        const { data, error } = await supabase
          .from("profile")
          .select("status")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setStatus(!data.status);
          await AsyncStorage.setItem("status", JSON.stringify(!data.status)); // cache it
        }
        // check downloaded files
        checkAllFilesDownloaded();
      } catch (err) {
        console.log("Error loaindg name", err);
      }
    };

    loadStatus();
  }, [selectedSubjectValue]);

  /****************** Progress simulation *******************/
  const TopicCard = ({
    item,
    itemProgress,
    isDownloadingThis,
    isDownloaded,
    Status,
    handleCardPress,
    colors,
    theme,
    subjectMatch,
  }) => {
    const progressAnim = useSharedValue(itemProgress);

    useEffect(() => {
      progressAnim.value = withTiming(itemProgress, { duration: 300 });
    }, [itemProgress]);

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: circumference * (1 - progressAnim.value),
    }));

    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: colors[theme].backgroundColor }]}
        activeOpacity={0.85}
        onPress={() => handleCardPress(item.id)}
      >
        <LinearGradient
          colors={[colors[theme].pageGradient3, colors[theme].pageGradient4]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardContent}>
          {/* Icon */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: subjectMatch.color + "15" },
            ]}
          >
            <FontAwesome5
              name={subjectMatch.icon}
              size={26}
              color={subjectMatch.color}
            />
          </View>

          {/* Title */}
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, { color: colors[theme].darkGreen }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </View>

          {/* Status Circle */}
          <View style={styles.StatusCircle}>
            {isDownloadingThis ? (
              <Svg width={80} height={80} viewBox="0 0 80 80">
                <G rotation="-90" origin="40,40">
                  {/* Background Circle */}
                  <Circle
                    stroke="#e0e0e0"
                    fill="none"
                    cx={40}
                    cy={40}
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  {/* Animated Progress Circle */}
                  <AnimatedCircle
                    animatedProps={animatedProps}
                    stroke="#4CAF50"
                    fill="none"
                    cx={40}
                    cy={40}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                  />
                </G>
                {/* Centered Text */}
                <SvgText
                  x="40"
                  y="40"
                  fontSize="12"
                  fontWeight="bold"
                  fill={theme === "light" ? "#333" : "white"}
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {`${Math.round(itemProgress * 100)}%`}
                </SvgText>
              </Svg>
            ) : !Status ? (
              <FontAwesome5 name="lock" size={22} color="#9ca3af" />
            ) : isDownloaded ? null : (
              <FontAwesome5
                name="cloud-download-alt"
                size={24}
                color="#388E3C"
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <TopicCard
      item={item}
      itemProgress={downloadProgress[item.id] || 0}
      isDownloadingThis={!!currentlyDownloading[item.id]}
      isDownloaded={allDownloaded[item.id]}
      Status={Status}
      handleCardPress={handleCardPress}
      colors={colors}
      theme={theme}
      subjectMatch={subjectMatch}
    />
  );

  // const renderItem = ({ item }) => {
  //   const itemProgress = downloadProgress[item.id] || 0;
  //   const isDownloadingThis = !!currentlyDownloading[item.id];
  //   const isDownloaded = allDownloaded[item.id];

  //   // Create animation PER CARD
  //   const progressAnim = useSharedValue(itemProgress);

  //   const animatedProps = useAnimatedProps(() => ({
  //     strokeDashoffset: circumference * (1 - progressAnim.value),
  //   }));

  //   // Update animation when THIS card's progress changes
  //   useEffect(() => {
  //     progressAnim.value = withTiming(itemProgress, { duration: 300 });
  //   }, [itemProgress]);

  //   return (

  // };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <FlatList
          data={selectedSubjectValue}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <FontAwesome5
                  name={subjectMatch.icon}
                  size={36}
                  color={subjectMatch.color}
                />
              </View>
              <Text
                style={[styles.headerTitle, { color: colors[theme].darkGreen }]}
              >
                {subject} Contents
              </Text>
              <View style={styles.headerUnderline} />
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="book-open" size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Topics Available</Text>
              <Text style={styles.emptySubtitle}>
                Check back later for new study materials.
              </Text>
            </View>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Topics;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  // Header
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: "#239BA7",
    borderRadius: 2,
    marginTop: 8,
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },

  // Card
  card: {
    marginVertical: 10,
    borderRadius: 18,
    borderWidth: 3,
    overflow: "hidden",
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 24,
  },
  StatusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#4b5563",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});
