import { prefectures } from '../data/prefectures';

interface PrefectureSelectorProps {
  value: string;
  onChange: (code: string) => void;
  dateMode: 'today' | 'custom';
  onDateModeChange: (mode: 'today' | 'custom') => void;
  customDateInput: string;
  onCustomDateInputChange: (val: string) => void;
  onCustomDateConfirm: () => void;
}

export function PrefectureSelector({
  value,
  onChange,
  dateMode,
  onDateModeChange,
  customDateInput,
  onCustomDateInputChange,
  onCustomDateConfirm,
}: PrefectureSelectorProps) {
  return (
    <div className="controls-row">
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
      <div className="date-selector">
        <label className="radio-label">
          <input
            type="radio"
            name="dateMode"
            value="today"
            checked={dateMode === 'today'}
            onChange={() => onDateModeChange('today')}
          />
          今日
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="dateMode"
            value="custom"
            checked={dateMode === 'custom'}
            onChange={() => onDateModeChange('custom')}
          />
          日付指定
        </label>
        <input
          type="text"
          className="date-input"
          value={customDateInput}
          onChange={(e) => onCustomDateInputChange(e.target.value)}
          onBlur={onCustomDateConfirm}
          onKeyDown={(e) => { if (e.key === 'Enter') onCustomDateConfirm(); }}
          placeholder="M/D"
          disabled={dateMode === 'today'}
        />
      </div>
    </div>
  );
}
