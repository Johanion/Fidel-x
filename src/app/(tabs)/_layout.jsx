// _layout.tsx or App.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabsLayout from "../../providers/TabsLayout.jsx"; // your existing TabsLayout

import { Redirect, Slot, useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';   // ← change path if your provider is elsewhere
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { session, loading } = useAuth();

  // 1. Still checking session from Supabase
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0F2ED' }}>
        <ActivityIndicator size="large" color="#239BA7" />
      </View>
    );
  }

  // 2. No session → force back to login (this fixes your logout problem)
  if (!session) {
      return <Redirect href="/log-in" />;  }

  // 3. Everything good → show tabs
   return (
    <SafeAreaProvider>
      <TabsLayout />
    </SafeAreaProvider>
  );

}