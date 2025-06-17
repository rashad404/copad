import React from 'react';
import Svg, { 
  Circle, 
  Path, 
  G, 
  Defs, 
  LinearGradient, 
  Stop,
  SvgProps 
} from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps extends Partial<SvgProps> {
  width?: number;
  height?: number;
}

export default function Logo({ width = 40, height = 40, ...props }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Generate unique IDs to prevent conflicts when multiple logos are on the page
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const neuralGradientId = `neuralGradient-${uniqueId}`;
  const pulseGradientId = `pulseGradient-${uniqueId}`;
  
  return (
    <Svg 
      viewBox="0 0 100 100" 
      width={width}
      height={height}
      {...props}
    >
      {/* Gradient Definitions */}
      <Defs>
        <LinearGradient id={neuralGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#818CF8" />
          <Stop offset="100%" stopColor="#6366F1" />
        </LinearGradient>
        <LinearGradient id={pulseGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#4F46E5" />
          <Stop offset="100%" stopColor="#4338CA" />
        </LinearGradient>
      </Defs>

      {/* Background Circle with Subtle Pattern */}
      <Circle cx="50" cy="50" r="45" fill={isDark ? "#1F2937" : "#EEF2FF"} />
      <Circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? "#374151" : "#E0E7FF"} strokeWidth="1" />
      <Circle cx="50" cy="50" r="38" fill="none" stroke={isDark ? "#374151" : "#E0E7FF"} strokeWidth="1" />

      {/* Animated Pulse Ring */}
      <Circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke={`url(#${pulseGradientId})`} 
        strokeWidth="2"
        strokeDasharray="8 4"
      />

      {/* Neural Network Base */}
      <G id="neural-network">
        {/* Central Hub */}
        <Circle cx="50" cy="50" r="6" fill={`url(#${neuralGradientId})`} />
        
        {/* Orbital Nodes */}
        <G id="orbital-nodes">
          <Circle cx="35" cy="35" r="4" fill={`url(#${neuralGradientId})`} />
          <Circle cx="65" cy="35" r="4" fill={`url(#${neuralGradientId})`} />
          <Circle cx="35" cy="65" r="4" fill={`url(#${neuralGradientId})`} />
          <Circle cx="65" cy="65" r="4" fill={`url(#${neuralGradientId})`} />
          
          {/* Small Decorative Nodes */}
          <Circle cx="50" cy="30" r="2" fill={`url(#${neuralGradientId})`} />
          <Circle cx="50" cy="70" r="2" fill={`url(#${neuralGradientId})`} />
          <Circle cx="30" cy="50" r="2" fill={`url(#${neuralGradientId})`} />
          <Circle cx="70" cy="50" r="2" fill={`url(#${neuralGradientId})`} />
        </G>

        {/* Neural Connections */}
        <G id="connections" stroke={`url(#${neuralGradientId})`} strokeWidth="1.5">
          {/* Main Connections */}
          <Path d="M35 35 Q50 50 65 35" fill="none" />
          <Path d="M35 65 Q50 50 65 65" fill="none" />
          <Path d="M35 35 Q50 50 35 65" fill="none" />
          <Path d="M65 35 Q50 50 65 65" fill="none" />
          
          {/* Secondary Connections */}
          <Path d="M50 30 Q50 40 50 44" fill="none" strokeWidth="1" />
          <Path d="M50 56 Q50 60 50 70" fill="none" strokeWidth="1" />
          <Path d="M30 50 Q40 50 44 50" fill="none" strokeWidth="1" />
          <Path d="M56 50 Q60 50 70 50" fill="none" strokeWidth="1" />
        </G>
      </G>

      {/* Medical Cross (Modernized) */}
      <G id="medical-cross">
        <Path
          d="M50 35 L50 65 M35 50 L65 50"
          stroke={`url(#${pulseGradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Decorative Dots at Cross Endpoints */}
        <Circle cx="50" cy="35" r="2" fill={`url(#${pulseGradientId})`} />
        <Circle cx="50" cy="65" r="2" fill={`url(#${pulseGradientId})`} />
        <Circle cx="35" cy="50" r="2" fill={`url(#${pulseGradientId})`} />
        <Circle cx="65" cy="50" r="2" fill={`url(#${pulseGradientId})`} />
      </G>

      {/* Outer Glow Effect */}
      <Circle 
        cx="50" 
        cy="50" 
        r="44" 
        fill="none" 
        stroke={`url(#${neuralGradientId})`} 
        strokeWidth="0.5"
        opacity="0.5"
      />
    </Svg>
  );
}