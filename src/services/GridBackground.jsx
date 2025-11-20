import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, LinearGradient as SvgGradient, Defs } from "react-native-svg";

export default function GridBackground({ size = 40, color = "rgba(0, 128, 0, 0.05)" }) {
  const { width, height } = Dimensions.get("window");
  const svgRef = useRef(null);

  // Calculate number of lines based on screen dimensions
  const verticalLines = Math.ceil(width / size) + 1;
  const horizontalLines = Math.ceil(height / size) + 1;

  // Generate lines with dashed pattern and gradient
  const lines = [];
  for (let i = 0; i < verticalLines; i++) {
    lines.push(
      <Path
        key={`v-${i}`}
        d={`M${i * size} 0 V${height}`}
        stroke={`url(#gridGradient)`}
        strokeWidth="0.3"
        strokeDasharray={[4, 8]} // Dashed pattern: 4 units on, 8 units off
      />
    );
  }
  for (let i = 0; i < horizontalLines; i++) {
    lines.push(
      <Path
        key={`h-${i}`}
        d={`M0 ${i * size} H${width}`}
        stroke={`url(#gridGradient)`}
        strokeWidth="0.3"
        strokeDasharray={[4, 8]}
      />
    );
  }

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: -1, // Stay behind everything
      }}
    >
      <Svg ref={svgRef} height={height} width={width}>
        <Defs>
          <SvgGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Path offset="0%" stopColor="rgba(0, 128, 0, 0.02)" />
            <Path offset="100%" stopColor="rgba(0, 128, 0, 0.08)" />
          </SvgGradient>
        </Defs>
        {lines}
      </Svg>
    </View>
  );
}