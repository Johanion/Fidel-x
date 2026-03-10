// screens/ProfileScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";
import GridBackground from "../../services/GridBackground.jsx";
import { useAtom, useSetAtom } from "jotai";
import { themeAtom } from "../../atoms.jsx";

const APP_VERSION = "1.0.0"; // current app version

export default function ProfileScreen({ navigation }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    school: "Springfield High",
    class: "12th Grade",
    stream: "Science",
    status: false,
  });
  const [theme, setTheme] = useAtom(themeAtom);

  const { session, loading: authLoading } = useAuth(); // get session from AuthProvider
  const colors = {
    light: {
      backgroundColor: "white",
      greeting: "#111111",
      welcome: "#006400",
      fidelx: "#FFE100",
      darkGreen: "#014421",
      pageGradient1: "#E0F2ED",
      pageGradient2: "#FFFFFF",
      moon: "#014421",
    },
    dark: {
      backgroundColor: "black",
      greeting: "#C9D1D9",
      welcome: "#C9D1D9",
      fidelx: "#FFE100",
      darkGreen: "#E5E7EB",
      pageGradient1: "#0B1220",
      pageGradient2: "#020617",
      moon: "#C9D1D9",
    },
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [
          storedName,
          storedSchool,
          storedClass,
          storedStream,
          storedStatus,
        ] = await Promise.all([
          // get data stored in AsyncStorage using key("userName", "schoolName", "class", "stream", "status")
          AsyncStorage.getItem("userName"),
          AsyncStorage.getItem("schoolName"),
          AsyncStorage.getItem("class"),
          AsyncStorage.getItem("stream"),
          AsyncStorage.getItem("status"),
        ]);

        // Load basic fields if they exist from the Async storge or use default value
        const loadedProfile = {
          name: storedName || profile.name,
          school: storedSchool || profile.school,
          class: storedClass || profile.class,
          stream: storedStream || profile.stream,
          status: storedStatus ? JSON.parse(storedStatus) : false,
        };

        setProfile(loadedProfile);

        if (session?.user?.id) {
          const { data, error } = await supabase
            .from("profile")
            .select("full_name, school_name, grade, stream, status")
            .eq("id", session.user.id)
            .single();

          if (!error && data) {
            const { full_name, school_name, grade, stream, status } = data;
            const updatedProfile = {
              name: full_name ?? loadedProfile.name,
              school: school_name ?? loadedProfile.school,
              class: grade ?? loadedProfile.class,
              stream: stream ?? loadedProfile.stream,
              status: status ?? loadedProfile.status,
            };
            setProfile(updatedProfile);

            // Cache everything
            await Promise.all([
              AsyncStorage.setItem("userName", updatedProfile.name),
              AsyncStorage.setItem("schoolName", updatedProfile.school),
              AsyncStorage.setItem("class", updatedProfile.class),
              AsyncStorage.setItem("stream", updatedProfile.stream),
              AsyncStorage.setItem(
                "status",
                JSON.stringify(updatedProfile.status),
              ),
            ]);
          }
        }
      } catch (err) {
        console.warn("Profile load error:", err);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  // handle sign out logic
  async function handleSignOut() {
    // Always destructure the error
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const { error: LogOutError } = await supabase.auth.signOut();
          if (LogOutError) {
            throw Error(LogOutError);
          }
          router.replace("../log-in");
        },
      },
    ]);
  }

  // handle sign in logic
  const handleSave = async () => {
    setIsEditing(false);
    await Promise.all([
      AsyncStorage.setItem("userName", profile.name),
      AsyncStorage.setItem("schoolName", profile.school),
      AsyncStorage.setItem("class", profile.class),
      AsyncStorage.setItem("stream", profile.stream),
      AsyncStorage.setItem("status", JSON.stringify(profile.status)),
    ]);
    Alert.alert("Saved", "Profile updated locally!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors[theme].pageGradient1, colors[theme].pageGradient2]}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={["#239BA7", "#1A7F8A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerCard}
            >
              <GridBackground />

              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <FontAwesome5
                    name="user-graduate"
                    size={48}
                    color="#FFE100"
                  />
                </View>
                <View style={styles.onlineBadge} />
              </View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{profile.name}</Text>

              {/* Status Chip */}
              {profile.status ? (
                <View style={styles.chip}>
                  <MaterialIcons name="verified" size={16} color="#10B981" />
                  <Text style={styles.chipText}>Verified Student</Text>
                </View>
              ) : (
                <View style={[styles.chip, styles.pendingChip]}>
                  <MaterialIcons name="schedule" size={16} color="#F59E0B" />
                  <Text style={[styles.chipText, styles.pendingChipText]}>
                    Pending Verification
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Profile Card */}
          <View
            style={[
              styles.profileCardWrapper,
              { color: colors[theme].backgroundColor },
            ]}
          >
            <View
              style={[
                styles.profileCardWrapper,
                { color: colors[theme].backgroundColor },
              ]}
            ></View>
            <View
              style={[
                styles.profileCard,
                { color: colors[theme].backgroundColor },
              ]}
            >
              <View
                style={[
                  styles.cardHeader,
                  { color: colors[theme].backgroundColor },
                ]}
              >
                <Text style={styles.cardTitle}>Student Profile</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Ionicons
                    name={isEditing ? "checkmark-circle" : "create"}
                    size={24}
                    color="#239BA7"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldsContainer}>
                {[
                  {
                    key: "name",
                    icon: "person",
                    label: "Full Name",
                    color: "#239BA7",
                  },
                  {
                    key: "school",
                    icon: "school",
                    label: "Institution",
                    color: "#1A7F8A",
                  },
                  {
                    key: "class",
                    icon: "book",
                    label: "Grade",
                    color: "#FFE100",
                  },
                  {
                    key: "stream",
                    icon: "git-branch",
                    label: "Stream",
                    color: "#4CAF50",
                  },
                ].map((field, index) => (
                  <View style={styles.fieldRow} key={field.key}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: `${field.color}20` },
                      ]}
                    >
                      <Ionicons
                        name={field.icon}
                        size={20}
                        color={field.color}
                      />
                    </View>

                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={profile[field.key]}
                        onChangeText={(text) =>
                          setProfile((p) => ({ ...p, [field.key]: text }))
                        }
                        placeholder={field.label}
                        placeholderTextColor="#aaa"
                      />
                    ) : (
                      <View style={styles.fieldContent}>
                        <Text style={styles.fieldLabel}>{field.label}</Text>
                        <Text style={styles.fieldValue}>
                          {profile[field.key] || "Not set"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {isEditing && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#388E3C"]}
                    style={styles.saveGradient}
                  >
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                    <Text style={styles.saveText}>Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Contact & Support */}

          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL("mailto:support@fidelx.app")}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="mail" size={20} color="#239BA7" />
                </View>
                <Text style={styles.contactText}>support@fidelx.app</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL("tel:+251911223344")}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="call" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.contactText}>+251 911 223 344</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out" size={20} color="#F44336" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>v{APP_VERSION}</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerWrapper: { paddingHorizontal: 24, paddingTop: 20 },
  headerCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 20 },
    }),
  },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,225,0,0.45)",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 8,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#E0F2ED",
  },
  greeting: { fontFamily: "Poppins-Medium", fontSize: 16, color: "#fff" },
  userName: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#FFE100",
    marginTop: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  pendingChip: {
    backgroundColor: "rgba(255,193,7,0.2)",
  },
  chipText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#fff",
    marginLeft: 6,
  },
  pendingChipText: {
    color: "#F59E0B",
  },

  profileCardWrapper: { paddingHorizontal: 24, marginTop: 24 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: { elevation: 14 },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: "#239BA7" },
  fieldsContainer: { gap: 16 },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  fieldContent: { flex: 1 },
  fieldLabel: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#666" },
  fieldValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#014421",
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#014421",
    borderBottomWidth: 1.5,
    borderColor: "#239BA7",
    paddingVertical: 8,
  },
  saveButton: { marginTop: 24, borderRadius: 16, overflow: "hidden" },
  saveGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  saveText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 8,
  },

  supportCard: { paddingHorizontal: 24, marginTop: 32 },
  supportTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#239BA7",
    textAlign: "center",
    marginBottom: 16,
  },
  contactRow: { flexDirection: "row", justifyContent: "space-around" },
  contactItem: { alignItems: "center" },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(35,155,167,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: { fontFamily: "Poppins-Medium", fontSize: 13, color: "#239BA7" },

  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,67,54,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#F44336",
    marginLeft: 6,
  },
  versionContainer: {
    backgroundColor: "rgba(35,155,167,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  versionText: { fontFamily: "Poppins-Medium", fontSize: 12, color: "#239BA7" },
});
