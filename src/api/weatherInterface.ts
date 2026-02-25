/**
 * 降水確率データ（時刻単位）
 */
export interface PrecipitationPoint {
  /** 日時 (ISO 8601形式) */
  time: string;
  /** 降水確率 (0-100%) */
  value: number | null;
}

/**
 * 天気データインターフェース
 */
export interface WeatherData {
  /** 日付 (YYYY-MM-DD形式) */
  date: string;
  /** 最低気温 (℃) */
  tempMin: number;
  /** 最高気温 (℃) */
  tempMax: number;
  /** 現在気温 (℃、当日のみ) */
  tempCurrent?: number;
}

/**
 * 天気API共通インターフェース
 */
export interface WeatherAPI {
  /**
   * 過去の天気データを取得
   * @param lat 緯度
   * @param lon 経度
   * @param startDate 開始日 (YYYY-MM-DD)
   * @param endDate 終了日 (YYYY-MM-DD)
   */
  getHistoricalData(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): Promise<WeatherData[]>;

  /**
   * 天気予報データを取得
   * @param lat 緯度
   * @param lon 経度
   * @param days 予報日数
   */
  getForecastData(
    lat: number,
    lon: number,
    days: number
  ): Promise<WeatherData[]>;

  /**
   * 過去データと予報データを統合して取得
   * @param lat 緯度
   * @param lon 経度
   * @param monthsBack 過去何ヶ月分
   * @param daysForward 未来何日分
   */
  getCombinedData(
    lat: number,
    lon: number,
    monthsBack: number,
    daysForward: number
  ): Promise<WeatherData[]>;

  /**
   * 降水確率予報データを取得（16日間・時間単位）
   * @param lat 緯度
   * @param lon 経度
   */
  getPrecipitationForecast(
    lat: number,
    lon: number
  ): Promise<PrecipitationPoint[]>;
}
