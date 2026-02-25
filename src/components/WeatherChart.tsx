import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { WeatherData } from '../api/weatherInterface';

interface WeatherChartProps {
  data: WeatherData[];
  historicalData?: WeatherData[][];
}

type ChartDataEntry = Record<string, string | number | null | undefined>;

const PAST_MAX_COLOR = '#991B1B'; // 暗い赤
const PAST_MIN_COLOR = '#1e3a8a'; // 暗い青
const PAST_YEAR_OPACITY = [0.9, 0.7, 0.5, 0.35]; // 1年前〜4年前

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// 日付を指定年数だけ加算（閏年の2/29は2/28に丸める）
function shiftDate(dateStr: string, yearsToAdd: number): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr) + yearsToAdd;
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);
  if (month === 2 && day === 29) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return `${year}-02-${isLeap ? '29' : '28'}`;
  }
  return `${year}-${monthStr}-${dayStr}`;
}

const LEGEND_LABELS: Record<string, string> = {
  tempMax: '最高気温',
  tempMin: '最低気温',
  tempCurrent: '現在気温',
  tempMax_1y: '過去4年 最高',
  tempMin_1y: '過去4年 最低',
};

export function WeatherChart({ data, historicalData }: WeatherChartProps) {
  const chartData = useMemo<ChartDataEntry[]>(() => {
    // 各過去年のデータを「今年の日付」にシフトしたMapを構築
    const histMaps = (historicalData ?? []).map((yearData, idx) => {
      const map = new Map<string, WeatherData>();
      yearData.forEach((d) => {
        const shifted = shiftDate(d.date, idx + 1);
        map.set(shifted, d);
      });
      return map;
    });

    // 全日付を収集（今年 + 過去年シフト後）
    const dateSet = new Set<string>(data.map((d) => d.date));
    histMaps.forEach((map) => {
      map.forEach((_, shiftedDate) => {
        dateSet.add(shiftedDate);
      });
    });
    const allDates = Array.from(dateSet).sort();

    // 今年データのMap
    const dataMap = new Map<string, WeatherData>();
    data.forEach((d) => dataMap.set(d.date, d));

    return allDates.map((date) => {
      const d = dataMap.get(date);
      const entry: ChartDataEntry = {
        date,
        tempMax: d?.tempMax ?? null,
        tempMin: d?.tempMin ?? null,
        tempCurrent: d?.tempCurrent ?? null,
      };
      histMaps.forEach((map, idx) => {
        const hist = map.get(date);
        const n = idx + 1;
        entry[`tempMax_${n}y`] = hist?.tempMax ?? null;
        entry[`tempMin_${n}y`] = hist?.tempMin ?? null;
      });
      return entry;
    });
  }, [data, historicalData]);

  const yAxisTicks = useMemo(() => {
    if (chartData.length === 0) return [];
    let min = Infinity;
    let max = -Infinity;
    chartData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key.startsWith('temp')) {
          const val = entry[key];
          if (typeof val === 'number' && !isNaN(val)) {
            if (val < min) min = val;
            if (val > max) max = val;
          }
        }
      });
    });
    if (!isFinite(min) || !isFinite(max)) return [];
    const tickMin = Math.floor(min / 5) * 5;
    const tickMax = Math.ceil(max / 5) * 5;
    const ticks: number[] = [];
    for (let t = tickMin; t <= tickMax; t += 5) {
      ticks.push(t);
    }
    return ticks;
  }, [chartData]);

  const currentTempDate = useMemo(() => {
    const entry = chartData.find((e) => e.tempCurrent != null);
    return entry?.date as string | undefined;
  }, [chartData]);

  if (chartData.length === 0) return null;

  const tickInterval = Math.floor(chartData.length / 10);
  const hasHistorical = historicalData && historicalData.length > 0;

  return (
    <div className="weather-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateShort}
            interval={tickInterval}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis
            unit="℃"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11, textAnchor: 'start', dx: 5 }}
            width={5}
            mirror={true}
            ticks={yAxisTicks}
          />
          <Legend
            formatter={(value: string) => LEGEND_LABELS[value] ?? value}
          />
          {currentTempDate && (
            <ReferenceLine
              x={currentTempDate}
              stroke="var(--text-secondary)"
              strokeDasharray="4 4"
              label={{ value: '現在', fill: 'var(--text-secondary)', fontSize: 11, position: 'insideTopLeft' }}
            />
          )}

          {/* 過去4年（奥に表示） */}
          {hasHistorical &&
            historicalData.map((_, idx) => {
              const n = idx + 1;
              const opacity = PAST_YEAR_OPACITY[idx];
              return (
                <React.Fragment key={`hist_${n}`}>
                  <Line
                    type="monotone"
                    dataKey={`tempMax_${n}y`}
                    stroke={PAST_MAX_COLOR}
                    strokeWidth={1}
                    strokeOpacity={opacity}
                    dot={false}
                    activeDot={false}
                    name={`tempMax_${n}y`}
                    legendType={n === 1 ? 'line' : 'none'}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={`tempMin_${n}y`}
                    stroke={PAST_MIN_COLOR}
                    strokeWidth={1}
                    strokeOpacity={opacity}
                    dot={false}
                    activeDot={false}
                    name={`tempMin_${n}y`}
                    legendType={n === 1 ? 'line' : 'none'}
                    connectNulls={false}
                  />
                </React.Fragment>
              );
            })}

          {/* 今年（手前に表示） */}
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
