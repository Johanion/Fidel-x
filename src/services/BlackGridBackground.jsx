import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import Svg, { Path, LinearGradient as SvgGradient, Defs, Stop, Rect, Circle } from "react-native-svg";
import { useAtom } from "jotai";
import { themeAtom } from "../atoms"; // adjust path

export default function GridBackground({ horizontalSize = 40, verticalSize = 25 }) { // Different spacing for rectangular (non-square) cells
  const { width, height } = Dimensions.get("window");
  const [theme] = useAtom(themeAtom);

  // 🎨 Sophisticated color scheme: muted tones for professionalism
  const gridColor = theme === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.04)";
  
  // Faint background gradient for subtle depth and modern feel
  const bgColorTop = theme === "light" ? "rgba(250, 250, 250, 0.9)" : "rgba(25, 25, 25, 0.9)";
  const bgColorBottom = theme === "light" ? "rgba(240, 240, 240, 0.9)" : "rgba(15, 15, 15, 0.9)";

  const verticalLines = Math.ceil(width / horizontalSize) + 2;
  const horizontalLines = Math.ceil(height / verticalSize) + 2;

  // Animation for gentle pulse on dots – professional and engaging without distraction
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const elements = [];

  // Instead of lines, use a dot grid pattern for a fresh, non-square structure – more modern and less rigid
  for (let i = 0; i < verticalLines; i++) {
    for (let j = 0; j < horizontalLines; j++) {
      // Offset every other row for a staggered, hexagonal-inspired layout (not strictly square)
      const xOffset = (j % 2 === 0) ? 0 : horizontalSize / 2;
      elements.push(
        <Circle
          key={`dot-${i}-${j}`}
          cx={i * horizontalSize + xOffset}
          cy={j * verticalSize}
          r={1.2} // Small dots for subtlety
          fill="url(#dotGradient)"
          opacity={opacityAnim}
        />
      );
    }
  }

  // Add faint connecting lines between dots for structure, but dashed and thin
  for (let i = 0; i < verticalLines - 1; i++) {
    for (let j = 0; j < horizontalLines; j++) {
      const xOffsetStart = (j % 2 === 0) ? 0 : horizontalSize / 2;
      const xOffsetEnd = (j % 2 === 0) ? horizontalSize : horizontalSize / 2;
      elements.push(
        <Path
          key={`h-line-${i}-${j}`}
          d={`M${i * horizontalSize + xOffsetStart} ${j * verticalSize} H${(i + 1) * horizontalSize + xOffsetStart - xOffsetEnd + horizontalSize / 2}`}
          stroke="url(#gridGradient)"
          strokeWidth={0.3}
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
      );
    }
  }

  for (let i = 0; i < verticalLines; i++) {
    for (let j = 0; j < horizontalLines - 1; j++) {
      const xOffsetStart = (j % 2 === 0) ? 0 : horizontalSize / 2;
      const xOffsetEnd = ((j + 1) % 2 === 0) ? 0 : horizontalSize / 2;
      elements.push(
        <Path
          key={`v-line-${i}-${j}`}
          d={`M${i * horizontalSize + xOffsetStart} ${j * verticalSize} L${i * horizontalSize + xOffsetEnd} ${(j + 1) * verticalSize}`}
          stroke="url(#gridGradient)"
          strokeWidth={0.3}
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
      );
    }
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}>
      <Svg width={width} height={height}>
        <Defs>
          {/* Gradient for dots: radial for soft glow */}
          <SvgGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gridColor} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={gridColor} stopOpacity="0.2" />
          </SvgGradient>
          {/* Gradient for lines: linear with fade */}
          <SvgGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gridColor} stopOpacity="0.1" />
            <Stop offset="50%" stopColor={gridColor} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={gridColor} stopOpacity="0.1" />
          </SvgGradient>
          {/* Background gradient */}
          <SvgGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={bgColorTop} stopOpacity="1" />
            <Stop offset="100%" stopColor={bgColorBottom} stopOpacity="1" />
          </SvgGradient>
        </Defs>
        {/* Subtle background fill */}
        <Rect width={width} height={height} fill="url(#bgGradient)" />
        {elements}
      </Svg>
    </View>
  );
}