import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Path,
  LinearGradient as SvgGradient,
  Defs,
  Stop,
} from "react-native-svg";
import { useAtom } from "jotai";
import { themeAtom } from "../atoms"; // adjust path

export default function GridBackground({ size = 40 }) {
  const { width, height } = Dimensions.get("window");
  const [theme] = useAtom(themeAtom);

  // 🎨 Grid color by theme
  const gridColor =
    theme === "light"
      ? "rgba(0, 128, 0, 0.08)"     // green for light mode
      : "rgba(255, 255, 255, 0.08)"; // white for dark mode

  const verticalLines = Math.ceil(width / size) + 1;
  const horizontalLines = Math.ceil(height / size) + 1;

  const lines = [];

  for (let i = 0; i < verticalLines; i++) {
    lines.push(
      <Path
        key={`v-${i}`}
        d={`M${i * size} 0 V${height}`}
        stroke="url(#gridGradient)"
        strokeWidth={0.3}
        strokeDasharray="4 8"
      />
    );
  }

  for (let i = 0; i < horizontalLines; i++) {
    lines.push(
      <Path
        key={`h-${i}`}
        d={`M0 ${i * size} H${width}`}
        stroke="url(#gridGradient)"
        strokeWidth={0.3}
        strokeDasharray="4 8"
      />
    );
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={gridColor} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={gridColor} stopOpacity="1" />
          </SvgGradient>
        </Defs>
        {lines}
      </Svg>
    </View>
  );
}
