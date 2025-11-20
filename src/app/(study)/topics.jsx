// src/screens/DashboardScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAdminClient } from "../../lib/supabaseAdmin";
import { Users, UserCheck, UserX } from "lucide-react-native";

const supabaseAdmin = getAdminClient();

export default function DashboardScreen() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-status"],
    queryFn: async () => {
      const [totalRes, activeRes] = await Promise.all([
        supabaseAdmin
          .from("profile")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("profile")
          .select("*", { count: "exact", head: true })
          .eq("status", true),
      ]);

      const total = totalRes.count ?? 0;
      const active = activeRes.count ?? 0;
      const inactive = total - active;

      return { total, active, inactive };
    },
    refetchInterval: 60_000, // Every 60 seconds (not 60 million!)
    staleTime: 30_000,
  });

  const stats = [
    {
      label: "Total Users",
      value: data?.total ?? 0,
      icon: Users,
      color: "#2563eb", // blue-600
      bgLight: "rgba(37, 99, 235, 0.2)",
      border: "#3b82f6",
    },
    {
      label: "Active Users",
      value: data?.active ?? 0,
      icon: UserCheck,
      color: "#059669", // emerald-600
      bgLight: "rgba(5, 150, 105, 0.2)",
      border: "#10b981",
    },
    {
      label: "Inactive Users",
      value: data?.inactive ?? 0,
      icon: UserX,
      color: "#dc2626", // red-600
      bgLight: "rgba(220, 38, 38, 0.2)",
      border: "#ef4444",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor="#10b981"
          colors={["#10b981"]}
        />
      }
    >
      {/* Header */}
      <View style={styles.headerGradient}>
        <Text style={styles.title}>User Overview</Text>
        <Text style={styles.subtitle}>Real-time statistics</Text>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Loading stats...</Text>
          </View>
        ) : isError ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Error loading data</Text>
            <Text style={{ color: "#ef4444", marginTop: 8 }}>
              {(error as any)?.message || "Unknown error"}
            </Text>
          </View>
        ) : (
          <View>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const percentage =
                stat.label === "Total Users" ? 100 : (stat.value / (data?.total || 1)) * 100;

              return (
                <View key={index} style={styles.cardContainer}>
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: stat.bgLight, borderColor: stat.border },
                    ]}
                  >
                    <View style={styles.cardRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardLabel}>{stat.label}</Text>
                        <Text style={styles.cardValue}>
                          {stat.value.toLocaleString()}
                        </Text>
                      </View>

                      <View style={[styles.iconBox, { backgroundColor: stat.color }]}>
                        <Icon size={48} color="white" strokeWidth={2.5} />
                      </View>
                    </View>

                    {/* Progress Bar - Only for Active/Inactive */}
                    {stat.label !== "Total Users" && data && data.total > 0 && (
                      <View style={{ marginTop: 24 }}>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { backgroundColor: stat.color, width: `${percentage}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {percentage.toFixed(1)}% of total users
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pull down to refresh • Updated live
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  headerGradient: {
    backgroundColor: "#064e3b",
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#6ee7b7",
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 24,
    marginTop: -32,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 16,
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "#d1d5db",
    fontSize: 18,
    fontWeight: "500",
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: -1,
  },
  iconBox: {
    padding: 24,
    borderRadius: 16,
  },
  progressBarBg: {
    backgroundColor: "#1f2937",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  footerText: {
    color: "#4b5563",
    fontSize: 12,
  },
});