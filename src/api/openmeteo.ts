import type { WeatherAPI, WeatherData } from './weatherInterface';

/**
 * Open-Meteo APIの実装
 */
export class OpenMeteoAPI implements WeatherAPI {
  private readonly ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';
  private readonly FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

  /**
   * 過去の天気データを取得
   */
  async getHistoricalData(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): Promise<WeatherData[]> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: 'temperature_2m_max,temperature_2m_min',
      timezone: 'Asia/Tokyo',
    });

    const response = await fetch(`${this.ARCHIVE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Historical data fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseHistoricalResponse(data);
  }

  /**
   * 天気予報データを取得
   */
  async getForecastData(
    lat: number,
    lon: number,
    days: number
  ): Promise<WeatherData[]> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      daily: 'temperature_2m_max,temperature_2m_min',
      current: 'temperature_2m',
      timezone: 'Asia/Tokyo',
      forecast_days: days.toString(),
    });

    const response = await fetch(`${this.FORECAST_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Forecast data fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseForecastResponse(data);
  }

  /**
   * 過去データと予報データを統合して取得
   */
  async getCombinedData(
    lat: number,
    lon: number,
    monthsBack: number,
    daysForward: number
  ): Promise<WeatherData[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 過去データの期間計算
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - monthsBack);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 過去データ取得（昨日まで）
    const historicalData = await this.getHistoricalData(
      lat,
      lon,
      this.formatDate(startDate),
      this.formatDate(yesterday)
    );

    // 予報データ取得（今日から未来）
    const forecastData = await this.getForecastData(lat, lon, daysForward + 1);

    // 統合（今日のデータはforecastDataに含まれる）
    return [...historicalData, ...forecastData];
  }

  /**
   * 過去データのレスポンスをパース
   */
  private parseHistoricalResponse(data: any): WeatherData[] {
    const dates = data.daily.time;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;

    return dates.map((date: string, index: number) => ({
      date,
      tempMax: tempMax[index],
      tempMin: tempMin[index],
    }));
  }

  /**
   * 予報データのレスポンスをパース
   */
  private parseForecastResponse(data: any): WeatherData[] {
    const dates = data.daily.time;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;
    const currentTemp = data.current?.temperature_2m;

    // 今日の日付
    const today = this.formatDate(new Date());

    return dates.map((date: string, index: number) => {
      const weatherData: WeatherData = {
        date,
        tempMax: tempMax[index],
        tempMin: tempMin[index],
      };

      // 今日のデータには現在気温を追加
      if (date === today && currentTemp !== undefined) {
        weatherData.tempCurrent = currentTemp;
      }

      return weatherData;
    });
  }

  /**
   * DateオブジェクトをYYYY-MM-DD形式の文字列に変換
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
