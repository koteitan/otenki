/**
 * 都道府県情報
 */
export interface Prefecture {
  /** 都道府県コード */
  code: string;
  /** 都道府県名 */
  name: string;
  /** 代表都市の緯度 */
  lat: number;
  /** 代表都市の経度 */
  lon: number;
}

/**
 * 都道府県一覧
 * 各都道府県の代表都市（県庁所在地）の座標
 */
export const prefectures: Prefecture[] = [
  { code: '01', name: '北海道', lat: 43.0642, lon: 141.3469 }, // 札幌
  { code: '02', name: '青森県', lat: 40.8244, lon: 140.7400 }, // 青森
  { code: '03', name: '岩手県', lat: 39.7036, lon: 141.1527 }, // 盛岡
  { code: '04', name: '宮城県', lat: 38.2682, lon: 140.8694 }, // 仙台
  { code: '05', name: '秋田県', lat: 39.7186, lon: 140.1024 }, // 秋田
  { code: '06', name: '山形県', lat: 38.2404, lon: 140.3633 }, // 山形
  { code: '07', name: '福島県', lat: 37.7503, lon: 140.4676 }, // 福島
  { code: '08', name: '茨城県', lat: 36.3418, lon: 140.4468 }, // 水戸
  { code: '09', name: '栃木県', lat: 36.5658, lon: 139.8836 }, // 宇都宮
  { code: '10', name: '群馬県', lat: 36.3911, lon: 139.0608 }, // 前橋
  { code: '11', name: '埼玉県', lat: 35.8569, lon: 139.6489 }, // さいたま
  { code: '12', name: '千葉県', lat: 35.6074, lon: 140.1065 }, // 千葉
  { code: '13', name: '東京都', lat: 35.6762, lon: 139.6503 }, // 東京
  { code: '14', name: '神奈川県', lat: 35.4478, lon: 139.6425 }, // 横浜
  { code: '15', name: '新潟県', lat: 37.9022, lon: 139.0232 }, // 新潟
  { code: '16', name: '富山県', lat: 36.6959, lon: 137.2137 }, // 富山
  { code: '17', name: '石川県', lat: 36.5946, lon: 136.6256 }, // 金沢
  { code: '18', name: '福井県', lat: 36.0652, lon: 136.2216 }, // 福井
  { code: '19', name: '山梨県', lat: 35.6642, lon: 138.5684 }, // 甲府
  { code: '20', name: '長野県', lat: 36.6513, lon: 138.1810 }, // 長野
  { code: '21', name: '岐阜県', lat: 35.3912, lon: 136.7223 }, // 岐阜
  { code: '22', name: '静岡県', lat: 34.9769, lon: 138.3831 }, // 静岡
  { code: '23', name: '愛知県', lat: 35.1802, lon: 136.9066 }, // 名古屋
  { code: '24', name: '三重県', lat: 34.7303, lon: 136.5086 }, // 津
  { code: '25', name: '滋賀県', lat: 35.0045, lon: 135.8686 }, // 大津
  { code: '26', name: '京都府', lat: 35.0116, lon: 135.7681 }, // 京都
  { code: '27', name: '大阪府', lat: 34.6937, lon: 135.5023 }, // 大阪
  { code: '28', name: '兵庫県', lat: 34.6901, lon: 135.1955 }, // 神戸
  { code: '29', name: '奈良県', lat: 34.6851, lon: 135.8329 }, // 奈良
  { code: '30', name: '和歌山県', lat: 34.2261, lon: 135.1675 }, // 和歌山
  { code: '31', name: '鳥取県', lat: 35.5014, lon: 134.2381 }, // 鳥取
  { code: '32', name: '島根県', lat: 35.4723, lon: 133.0505 }, // 松江
  { code: '33', name: '岡山県', lat: 34.6617, lon: 133.9350 }, // 岡山
  { code: '34', name: '広島県', lat: 34.3853, lon: 132.4553 }, // 広島
  { code: '35', name: '山口県', lat: 34.1861, lon: 131.4714 }, // 山口
  { code: '36', name: '徳島県', lat: 34.0658, lon: 134.5595 }, // 徳島
  { code: '37', name: '香川県', lat: 34.3401, lon: 134.0434 }, // 高松
  { code: '38', name: '愛媛県', lat: 33.8416, lon: 132.7657 }, // 松山
  { code: '39', name: '高知県', lat: 33.5597, lon: 133.5311 }, // 高知
  { code: '40', name: '福岡県', lat: 33.6064, lon: 130.4181 }, // 福岡
  { code: '41', name: '佐賀県', lat: 33.2495, lon: 130.2988 }, // 佐賀
  { code: '42', name: '長崎県', lat: 32.7448, lon: 129.8737 }, // 長崎
  { code: '43', name: '熊本県', lat: 32.7898, lon: 130.7417 }, // 熊本
  { code: '44', name: '大分県', lat: 33.2382, lon: 131.6126 }, // 大分
  { code: '45', name: '宮崎県', lat: 31.9077, lon: 131.4202 }, // 宮崎
  { code: '46', name: '鹿児島県', lat: 31.5602, lon: 130.5581 }, // 鹿児島
  { code: '47', name: '沖縄県', lat: 26.2124, lon: 127.6809 }, // 那覇
];

/**
 * 都道府県コードから都道府県情報を取得
 */
export const getPrefectureByCode = (code: string): Prefecture | undefined => {
  return prefectures.find((p) => p.code === code);
};

/**
 * 都道府県名から都道府県情報を取得
 */
export const getPrefectureByName = (name: string): Prefecture | undefined => {
  return prefectures.find((p) => p.name === name);
};
