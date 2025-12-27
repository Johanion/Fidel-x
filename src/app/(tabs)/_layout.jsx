// _layout.tsx or App.tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabsLayout from "../../providers/TabsLayout.jsx"; // your existing TabsLayout

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TabsLayout />
    </SafeAreaProvider>
  );
}
