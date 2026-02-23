import { useState, useEffect } from 'react';
import { PrefectureSelector } from './components/PrefectureSelector';
import { WeatherChart } from './components/WeatherChart';
import { weatherAPI } from './api';
import { getPrefectureByCode, getPrefectureByName } from './data/prefectures';
import type { WeatherData } from './api/weatherInterface';
import './App.css';

const STORAGE_KEY = 'selectedPrefecture';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getInitialPrefCode(): string {
  // クエリパラメータを最優先
  const params = new URLSearchParams(window.location.search);
  const qName = params.get('q');
  if (qName) {
    const pref = getPrefectureByName(qName);
    if (pref) return pref.code;
  }

  // localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && getPrefectureByCode(saved)) return saved;

  // デフォルト: 東京都
  return '13';
}

function parseCustomDate(value: string, year: number): Date | null {
  const parts = value.split('/');
  if (parts.length !== 2) return null;
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getMonth() !== month - 1) return null; // 2/30 などの無効な日付を除外
  return d;
}

function App() {
  const [prefCode, setPrefCode] = useState(getInitialPrefCode);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [historicalData, setHistoricalData] = useState<WeatherData[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateMode, setDateMode] = useState<'today' | 'custom'>('today');
  const [customDateInput, setCustomDateInput] = useState('1/1');
  const [customDate, setCustomDate] = useState('1/1');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, prefCode);
  }, [prefCode]);

  function confirmCustomDate() {
    const parsed = parseCustomDate(customDateInput, new Date().getFullYear());
    if (parsed) {
      setCustomDate(customDateInput);
    }
  }

  useEffect(() => {
    const pref = getPrefectureByCode(prefCode);
    if (!pref) return;

    setLoading(true);
    setError(null);
    setWeatherData([]);
    setHistoricalData([]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 基準日を計算
    let centerDate: Date;
    if (dateMode === 'today') {
      centerDate = new Date(today);
    } else {
      const parsed = parseCustomDate(customDate, today.getFullYear());
      centerDate = parsed ?? new Date(today);
    }

    // 過去4年分: 基準日の同日 ±2ヶ月
    const historicalPromises = [1, 2, 3, 4].map((yearsAgo) => {
      const refDate = new Date(centerDate);
      refDate.setFullYear(refDate.getFullYear() - yearsAgo);

      const startDate = new Date(refDate);
      startDate.setMonth(startDate.getMonth() - 2);

      const endDate = new Date(refDate);
      endDate.setMonth(endDate.getMonth() + 2);

      return weatherAPI.getHistoricalData(
        pref.lat,
        pref.lon,
        formatDate(startDate),
        formatDate(endDate)
      );
    });

    // 今年: 基準日 ±2ヶ月、ただし今日+14日でキャップ
    const rangeStart = new Date(centerDate);
    rangeStart.setMonth(rangeStart.getMonth() - 2);
    const rangeEnd = new Date(centerDate);
    rangeEnd.setMonth(rangeEnd.getMonth() + 2);

    const maxForecastDate = new Date(today);
    maxForecastDate.setDate(maxForecastDate.getDate() + 14);
    const effectiveEnd = rangeEnd <= maxForecastDate ? rangeEnd : maxForecastDate;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentDataPromise: Promise<WeatherData[]>;
    if (effectiveEnd < today) {
      // 全て過去 → アーカイブAPIのみ
      currentDataPromise = weatherAPI.getHistoricalData(
        pref.lat,
        pref.lon,
        formatDate(rangeStart),
        formatDate(effectiveEnd)
      );
    } else if (rangeStart >= today) {
      // 全て未来 → 予報APIのみ、rangeStart以降をフィルタ
      const daysForward = Math.ceil((effectiveEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      currentDataPromise = weatherAPI.getForecastData(pref.lat, pref.lon, daysForward + 1)
        .then((data) => data.filter((d) => d.date >= formatDate(rangeStart)));
    } else {
      // 今日をまたぐ → アーカイブ + 予報を結合
      const daysForward = Math.ceil((effectiveEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      currentDataPromise = Promise.all([
        weatherAPI.getHistoricalData(pref.lat, pref.lon, formatDate(rangeStart), formatDate(yesterday)),
        weatherAPI.getForecastData(pref.lat, pref.lon, daysForward + 1),
      ]).then(([hist, forecast]) => [...hist, ...forecast]);
    }

    Promise.all([currentDataPromise, ...historicalPromises])
      .then(([currentData, ...histData]) => {
        setWeatherData(currentData);
        setHistoricalData(histData);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [prefCode, dateMode, customDate]);

  const selectedPref = getPrefectureByCode(prefCode);
  const centerLabel = dateMode === 'today' ? '今日' : customDate;

  return (
    <div className="app">
      <header className="app-header">
        <h1>お天気アプリ</h1>
      </header>
      <main className="app-main">
        <div className="chart-container">
          {loading && (
            <div className="status-message">データを読み込み中...</div>
          )}
          {error && (
            <div className="status-message error">{error}</div>
          )}
          {!loading && !error && (weatherData.length > 0 || historicalData.some(d => d.length > 0)) && (
            <>
              <h2 className="chart-title">{selectedPref?.name} の気温推移</h2>
              <p className="chart-subtitle">{centerLabel} の前後2ヶ月（過去4年比較）</p>
              <WeatherChart data={weatherData} historicalData={historicalData} />
            </>
          )}
        </div>
        <div className="controls">
          <PrefectureSelector
            value={prefCode}
            onChange={setPrefCode}
            dateMode={dateMode}
            onDateModeChange={setDateMode}
            customDateInput={customDateInput}
            onCustomDateInputChange={setCustomDateInput}
            onCustomDateConfirm={confirmCustomDate}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
