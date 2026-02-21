import { OpenMeteoAPI } from './openmeteo';
export { OpenMeteoAPI } from './openmeteo';
export type { WeatherAPI, WeatherData } from './weatherInterface';

// デフォルトのAPIインスタンス
export const weatherAPI = new OpenMeteoAPI();
