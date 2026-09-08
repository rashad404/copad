import React from "react";
import { View } from "react-native";
import Svg, { Line, Polyline, Rect, Circle } from "react-native-svg";
import { Body, palette } from "./kit";
export function ReadingChart({
  label,
  rows,
  low,
  high,
}: {
  label: string;
  rows: { value: number; date: string }[];
  low?: number | null;
  high?: number | null;
}) {
  const points = rows
    .filter(
      (r) =>
        Number.isFinite(r.value) && Number.isFinite(new Date(r.date).getTime()),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!points.length) return null;
  const values = [
      ...points.map((p) => p.value),
      ...(low != null ? [low] : []),
      ...(high != null ? [high] : []),
    ],
    min = Math.min(...values),
    max = Math.max(...values);
  const y = (v: number) => 125 - ((v - min) / (max - min || 1)) * 100;
  const start = new Date(points[0].date).getTime(),
    end = new Date(points[points.length - 1].date).getTime();
  const x = (p: (typeof points)[number], i: number) =>
    Number.isFinite(start) && end > start
      ? 12 + ((new Date(p.date).getTime() - start) / (end - start)) * 276
      : 12 + (i / Math.max(1, points.length - 1)) * 276;
  return (
    <View accessibilityLabel={label} style={{ gap: 8 }}>
      <Body small>
        {label}: {min} - {max}
      </Body>
      <Svg width="100%" height={145} viewBox="0 0 300 145" accessible={false}>
        {low != null && high != null && high >= low && (
          <Rect
            x={12}
            y={y(high)}
            width={276}
            height={y(low) - y(high)}
            fill={palette.sage}
          />
        )}
        <Line x1={12} x2={288} y1={128} y2={128} stroke={palette.line} />
        <Polyline
          points={points.map((p, i) => `${x(p, i)},${y(p.value)}`).join(" ")}
          fill="none"
          stroke={palette.blue}
          strokeWidth={2}
        />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={x(p, i)}
            cy={y(p.value)}
            r={3}
            fill={palette.blue}
          />
        ))}
      </Svg>
    </View>
  );
}
