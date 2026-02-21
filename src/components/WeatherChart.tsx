import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { WeatherData } from '../api/weatherInterface';

interface WeatherChartProps {
  data: WeatherData[];
}

const today = new Date().toISOString().split('T')[0];

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const LEGEND_LABELS: Record<string, string> = {
  tempMax: '最高気温',
  tempMin: '最低気温',
  tempCurrent: '現在気温',
};

export function WeatherChart({ data }: WeatherChartProps) {
  if (data.length === 0) return null;

  const tickInterval = Math.floor(data.length / 10);

  return (
    <div className="weather-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateShort}
            interval={tickInterval}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis
            unit="°"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            width={40}
          />
          <Tooltip
            formatter={(value: number | undefined, name: string) => [
              value !== undefined ? `${value}°C` : '',
              LEGEND_LABELS[name] ?? name,
            ]}
            labelFormatter={(label: React.ReactNode) =>
              typeof label === 'string' ? formatDateLong(label) : String(label)
            }
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '6px',
              color: 'var(--text-color)',
            }}
          />
          <Legend
            formatter={(value: string) => LEGEND_LABELS[value] ?? value}
          />
          <ReferenceLine
            x={today}
            stroke="var(--text-secondary)"
            strokeDasharray="4 4"
            label={{ value: '今日', fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="tempMax"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="tempMax"
          />
          <Line
            type="monotone"
            dataKey="tempMin"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="tempMin"
          />
          <Line
            type="monotone"
            dataKey="tempCurrent"
            stroke="#EAB308"
            strokeWidth={0}
            dot={{ r: 6, fill: '#EAB308', strokeWidth: 0 }}
            activeDot={{ r: 8, fill: '#EAB308' }}
            connectNulls={false}
            name="tempCurrent"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
