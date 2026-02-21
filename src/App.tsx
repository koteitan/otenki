import { useState, useEffect } from 'react';
import { PrefectureSelector } from './components/PrefectureSelector';
import { WeatherChart } from './components/WeatherChart';
import { weatherAPI } from './api';
import { getPrefectureByCode } from './data/prefectures';
import type { WeatherData } from './api/weatherInterface';
import './App.css';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function App() {
  const [prefCode, setPrefCode] = useState('13'); // 東京都
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [historicalData, setHistoricalData] = useState<WeatherData[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pref = getPrefectureByCode(prefCode);
    if (!pref) return;

    setLoading(true);
    setError(null);
    setWeatherData([]);
    setHistoricalData([]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 過去4年分: 今日の同日を基準に3ヶ月前〜2ヶ月後の範囲で取得
    const historicalPromises = [1, 2, 3, 4].map((yearsAgo) => {
      const refDate = new Date(today);
      refDate.setFullYear(refDate.getFullYear() - yearsAgo);

      const startDate = new Date(refDate);
      startDate.setMonth(startDate.getMonth() - 3);

      const endDate = new Date(refDate);
      endDate.setMonth(endDate.getMonth() + 2);

      return weatherAPI.getHistoricalData(
        pref.lat,
        pref.lon,
        formatDate(startDate),
        formatDate(endDate)
      );
    });

    Promise.all([
      weatherAPI.getCombinedData(pref.lat, pref.lon, 3, 7),
      ...historicalPromises,
    ])
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
  }, [prefCode]);

  const selectedPref = getPrefectureByCode(prefCode);

  return (
    <div className="app">
      <header className="app-header">
        <h1>お天気アプリ</h1>
      </header>
      <main className="app-main">
        <div className="controls">
          <PrefectureSelector value={prefCode} onChange={setPrefCode} />
        </div>
        <div className="chart-container">
          {loading && (
            <div className="status-message">データを読み込み中...</div>
          )}
          {error && (
            <div className="status-message error">{error}</div>
          )}
          {!loading && !error && weatherData.length > 0 && (
            <>
              <h2 className="chart-title">{selectedPref?.name} の気温推移</h2>
              <p className="chart-subtitle">過去3ヶ月〜1週間後（過去4年比較）</p>
              <WeatherChart data={weatherData} historicalData={historicalData} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
