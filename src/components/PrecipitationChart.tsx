import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { PrecipitationPoint } from '../api/weatherInterface';

interface PrecipitationChartProps {
  data: PrecipitationPoint[];
}

function formatTick(timeStr: string): string {
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  // 0時のエントリだけをX軸ティックに使用
  const midnightTicks = useMemo(
    () => data.filter((p) => new Date(p.time).getHours() === 0).map((p) => p.time),
    [data]
  );

  if (data.length === 0) return null;

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
