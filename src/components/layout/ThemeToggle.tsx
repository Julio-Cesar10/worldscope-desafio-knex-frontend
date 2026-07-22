import { useTranslation } from 'react-i18next';
import { useTheme, type ThemePreference } from '@/contexts/ThemeContext';

const OPTIONS: { value: ThemePreference; icon: string }[] = [
  { value: 'light', icon: '☀️' },
  { value: 'dark', icon: '🌙' },
  { value: 'system', icon: '💻' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="segmented-control" role="group" aria-label="Theme">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented-control__option ${preference === option.value ? 'is-active' : ''}`}
          onClick={() => setPreference(option.value)}
          aria-pressed={preference === option.value}
          title={t(`theme.${option.value}`)}
        >
          <span aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
