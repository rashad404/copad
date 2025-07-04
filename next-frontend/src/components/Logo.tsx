import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  // Generate unique IDs to prevent conflicts when multiple logos are on the page
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const neuralGradientId = `neuralGradient-${uniqueId}`;
  const pulseGradientId = `pulseGradient-${uniqueId}`;
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id={neuralGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id={pulseGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>

      {/* Background Circle with Subtle Pattern */}
      <circle cx="50" cy="50" r="45" fill="#EEF2FF" className="dark:fill-gray-800" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#E0E7FF" className="dark:stroke-gray-700" strokeWidth="1" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#E0E7FF" className="dark:stroke-gray-700" strokeWidth="1" />

      {/* Animated Pulse Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke={`url(#${pulseGradientId})`} 
        strokeWidth="2"
        strokeDasharray="8 4"
        className="animate-spin-slow"
        style={{ transformOrigin: 'center', animation: 'spin 8s linear infinite' }}
      />

      {/* Neural Network Base */}
      <g className="neural-network">
        {/* Central Hub */}
        <circle cx="50" cy="50" r="6" fill={`url(#${neuralGradientId})`} />
        
        {/* Orbital Nodes */}
        <g className="orbital-nodes">
          <circle cx="35" cy="35" r="4" fill={`url(#${neuralGradientId})`} />
          <circle cx="65" cy="35" r="4" fill={`url(#${neuralGradientId})`} />
          <circle cx="35" cy="65" r="4" fill={`url(#${neuralGradientId})`} />
          <circle cx="65" cy="65" r="4" fill={`url(#${neuralGradientId})`} />
          
          {/* Small Decorative Nodes */}
          <circle cx="50" cy="30" r="2" fill={`url(#${neuralGradientId})`} />
          <circle cx="50" cy="70" r="2" fill={`url(#${neuralGradientId})`} />
          <circle cx="30" cy="50" r="2" fill={`url(#${neuralGradientId})`} />
          <circle cx="70" cy="50" r="2" fill={`url(#${neuralGradientId})`} />
        </g>

        {/* Neural Connections */}
        <g className="connections" stroke={`url(#${neuralGradientId})`} strokeWidth="1.5">
          {/* Main Connections */}
          <path d="M35 35 Q50 50 65 35" fill="none" />
          <path d="M35 65 Q50 50 65 65" fill="none" />
          <path d="M35 35 Q50 50 35 65" fill="none" />
          <path d="M65 35 Q50 50 65 65" fill="none" />
          
          {/* Secondary Connections */}
          <path d="M50 30 Q50 40 50 44" fill="none" strokeWidth="1" />
          <path d="M50 56 Q50 60 50 70" fill="none" strokeWidth="1" />
          <path d="M30 50 Q40 50 44 50" fill="none" strokeWidth="1" />
          <path d="M56 50 Q60 50 70 50" fill="none" strokeWidth="1" />
        </g>
      </g>

      {/* Medical Cross (Modernized) */}
      <g className="medical-cross">
        <path
          d="M50 35 L50 65 M35 50 L65 50"
          stroke={`url(#${pulseGradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Decorative Dots at Cross Endpoints */}
        <circle cx="50" cy="35" r="2" fill={`url(#${pulseGradientId})`} />
        <circle cx="50" cy="65" r="2" fill={`url(#${pulseGradientId})`} />
        <circle cx="35" cy="50" r="2" fill={`url(#${pulseGradientId})`} />
        <circle cx="65" cy="50" r="2" fill={`url(#${pulseGradientId})`} />
      </g>

      {/* Outer Glow Effect */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        fill="none" 
        stroke={`url(#${neuralGradientId})`} 
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  );
} 