import { useState, useEffect } from 'react';
import { PrefectureSelector } from './components/PrefectureSelector';
import { WeatherChart } from './components/WeatherChart';
import { weatherAPI } from './api';
import { getPrefectureByCode } from './data/prefectures';
import type { WeatherData } from './api/weatherInterface';
import './App.css';

function App() {
  const [prefCode, setPrefCode] = useState('13'); // 東京都
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pref = getPrefectureByCode(prefCode);
    if (!pref) return;

    setLoading(true);
    setError(null);
    setWeatherData([]);

    weatherAPI
      .getCombinedData(pref.lat, pref.lon, 3, 7)
      .then((data) => {
        setWeatherData(data);
      })
      .catch((err) => {
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
              <p className="chart-subtitle">過去3ヶ月〜1週間後</p>
              <WeatherChart data={weatherData} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
