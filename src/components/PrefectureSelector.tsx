import { prefectures } from '../data/prefectures';

interface PrefectureSelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export function PrefectureSelector({ value, onChange }: PrefectureSelectorProps) {
  return (
    <div className="prefecture-selector">
      <label htmlFor="prefecture-select">都道府県</label>
      <select
        id="prefecture-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {prefectures.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
