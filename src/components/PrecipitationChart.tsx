import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { PrecipitationPoint } from '../api/weatherInterface';

interface PrecipitationChartProps {
  data: PrecipitationPoint[];
}

function formatTick(timeStr: string): string {
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  // X軸ティック: 今日-1 〜 今日+16 を日次で固定表示
  const midnightTicks = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const ticks: string[] = [];
    for (let i = 0; i <= 17; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      ticks.push(`${formatDate(d)}T00:00`);
    }
    return ticks;
  }, []);

  if (data.length === 0) return null;

  const today = `${formatDate(new Date())}T00:00`;

  return (
    <div className="chart-container precip-chart-container">
      <h2 className="chart-title">降水確率（16日間）</h2>
      <div className="weather-chart">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="time"
              ticks={midnightTicks}
              interval={0}
              tickFormatter={formatTick}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              unit="%"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, textAnchor: 'start', dx: 5 }}
              width={5}
              mirror={true}
            />
            <ReferenceLine
              x={today}
              stroke="var(--text-secondary)"
              strokeDasharray="4 4"
              label={{ value: '今日', fill: 'var(--text-secondary)', fontSize: 11, position: 'insideTopLeft' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
