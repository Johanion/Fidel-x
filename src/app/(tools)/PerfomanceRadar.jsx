import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

const subjects = [
  { name: "Physics", color: "#1E90FF", abbr: "Phys" },
  { name: "Social Maths", color: "#9370DB", abbr: "Soc Math" },
  { name: "Natural Maths", color: "#32CD32", abbr: "Nat Math" },
  { name: "Chemistry", color: "#FF4500", abbr: "Chem" },
  { name: "English", color: "#FFA500", abbr: "Eng" },
  { name: "Aptitude", color: "#FFD700", abbr: "Apt" },
  { name: "Geography", color: "#8B4513", abbr: "Geo" },
  { name: "History", color: "#808080", abbr: "Hist" },
  { name: "Economics", color: "#FF69B4", abbr: "Econ" },
  { name: "Biology", color: "#20B2AA", abbr: "Bio" },
];

const PerformanceRadar = () => {
  const numLevels = 5;
  const maxRadius = 150;
  const numSubjects = subjects.length;
  const angleStep = (2 * Math.PI) / numSubjects;

  const centerX = 175;
  const centerY = 175;

  const getPoint = (index, radius) => {
    const angle = index * angleStep - Math.PI / 2;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  // Initialize user progress to **wrap first polygon**
  const firstLevelRadius = maxRadius / numLevels;
  const [progress] = useState(subjects.map(() => 1)); // values = 1 → polygon wraps first level

  // Generate grid polygons
  const gridPolygons = [];
  for (let level = 1; level <= numLevels; level++) {
    const radius = (maxRadius / numLevels) * level;
    const points = [];
    for (let i = 0; i < numSubjects; i++) {
      const { x, y } = getPoint(i, radius);
      points.push(`${x},${y}`);
    }
    gridPolygons.push(
      <Polygon
        key={`grid-${level}`}
        points={points.join(" ")}
        fill="none"
        stroke={level === 1 ? "#4F46E5" : "#D1D5DB"} // First polygon = highlight color
        strokeWidth={level === 1 ? 2 : 1}
      />
    );
  }

  // Axes
  const axes = [];
  for (let i = 0; i < numSubjects; i++) {
    const { x, y } = getPoint(i, maxRadius);
    axes.push(<Line key={`axis-${i}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />);
  }

  // User progress polygon = wraps first polygon
  const progressPoints = [];
  for (let i = 0; i < numSubjects; i++) {
    const { x, y } = getPoint(i, firstLevelRadius * progress[i]);
    progressPoints.push(`${x},${y}`);
  }

  // Labels
  const labels = [];
  for (let i = 0; i < numSubjects; i++) {
    const { x, y } = getPoint(i, maxRadius + 15);
    labels.push(
      <SvgText key={`label-${i}`} x={x} y={y} fontSize="11" fill={subjects[i].color} textAnchor="middle" dy="4">
        {subjects[i].abbr}
      </SvgText>
    );
  }

  return (
    <LinearGradient colors={["#F0F9FF", "#FFFFFF"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#2E7D32", "#2563EB"]} style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <FontAwesome5 name="chart-line" size={20} color="#1D4ED8" />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Performance Radar</Text>
              <Text style={styles.heroSubtitle}>
                The polygon wraps the first level. Radar starts from center and expands outward.
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Radar Chart */}
        <View style={styles.chartCard}>
          <Svg height="400" width="350" viewBox="0 0 350 400">
            {/* Grids */}
            {gridPolygons}

            {/* Axes */}
            {axes}

            {/* User Polygon */}
            <Polygon points={progressPoints.join(" ")} fill="rgba(79,70,229,0.35)" stroke="#4F46E5" strokeWidth="2" />

            {/* Vertex circles */}
            {progress.map((prog, i) => {
              const { x, y } = getPoint(i, firstLevelRadius * prog);
              return <Circle key={`dot-${i}`} cx={x} cy={y} r="4" fill="#4F46E5" />;
            })}

            {/* Labels */}
            {labels}
          </Svg>
        </View>

        {/* Legend */}
        <Text style={styles.legendTitle}>Subjects</Text>
        <View style={styles.legendContainer}>
          {subjects.map((subject) => (
            <View key={subject.name} style={styles.legendChip}>
              <View style={[styles.legendDot, { backgroundColor: subject.color }]} />
              <Text style={styles.legendText}>{subject.name}</Text>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to read this chart</Text>
          <Text style={styles.instructions}>
            The first polygon (blue) shows your current performance starting from the center. Other grids are guides for higher levels.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PerformanceRadar;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },

  heroCard: {
    marginHorizontal: 20,
    borderRadius: 26,
    padding: 20,
    marginBottom: 25,
    ...Platform.select({
      ios: { shadowColor: "#1D4ED8", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 20 },
      android: { elevation: 12 },
    }),
  },
  heroContent: { flexDirection: "row", alignItems: "center" },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginRight: 15 },
  heroText: { flex: 1 },
  heroTitle: { fontFamily: "Poppins-Black", fontSize: 20, color: "white" },
  heroSubtitle: { fontFamily: "Poppins-Medium", fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 4 },

  chartCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20 },
      android: { elevation: 8 },
    }),
  },

  legendTitle: { fontFamily: "Poppins-Bold", fontSize: 16, marginTop: 25, marginLeft: 22, color: "#111827" },
  legendContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, marginTop: 10 },
  legendChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, margin: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 13, color: "#374151", fontFamily: "Poppins-Medium" },

  infoCard: { margin: 20, padding: 18, backgroundColor: "#EEF2FF", borderRadius: 20, marginBottom: 100 },
  infoTitle: { fontFamily: "Poppins-Bold", fontSize: 14, marginBottom: 6, color: "#1E3A8A" },
  instructions: { fontSize: 13, color: "#374151", lineHeight: 18 },
});