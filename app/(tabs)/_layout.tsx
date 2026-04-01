import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

function TabIcon({ name, color, size }: { name: any, color: string, size: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0a0a0f", borderTopColor: "#1a1a2e", height: 60 },
        tabBarActiveTintColor: "#a855f7",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <TabIcon name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="market" options={{ title: "Market", tabBarIcon: ({ color, size }) => <TabIcon name="trending-up-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="news" options={{ title: "News", tabBarIcon: ({ color, size }) => <TabIcon name="newspaper-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions", tabBarIcon: ({ color, size }) => <TabIcon name="swap-horizontal-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="holdings" options={{ title: "Holdings", tabBarIcon: ({ color, size }) => <TabIcon name="wallet-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics", tabBarIcon: ({ color, size }) => <TabIcon name="bar-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color, size }) => <TabIcon name="settings-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
