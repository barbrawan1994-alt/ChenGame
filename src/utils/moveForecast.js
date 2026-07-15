const FORECAST_LABELS = {
  status: '变化',
  immune: '无效',
  resisted: '抵抗',
  effective: '克制',
  neutral: '普通',
};

const toFiniteNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const formatCompactNumber = (value) => {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2)));
};

const formatMultiplier = (value) => {
  const compactValue = Number(formatCompactNumber(value));
  const crossesLowerBoundary = value > 0 && value < 1
    && (compactValue <= 0 || compactValue >= 1);
  const crossesNeutralBoundary = value > 1 && compactValue <= 1;

  return crossesLowerBoundary || crossesNeutralBoundary
    ? String(value)
    : String(compactValue);
};

export const buildMoveForecast = ({
  multiplier,
  power,
  accuracy,
  alwaysHit = false,
  isStab = false,
  targetName,
} = {}) => {
  const parsedMultiplier = toFiniteNumber(multiplier);
  const safeMultiplier = parsedMultiplier !== null && parsedMultiplier >= 0
    ? (Object.is(parsedMultiplier, -0) ? 0 : parsedMultiplier)
    : 1;
  const parsedPower = toFiniteNumber(power);
  const isStatus = parsedPower !== null && parsedPower <= 0;

  let kind = 'neutral';
  if (isStatus) kind = 'status';
  else if (safeMultiplier === 0) kind = 'immune';
  else if (safeMultiplier < 1) kind = 'resisted';
  else if (safeMultiplier > 1) kind = 'effective';

  const parsedAccuracy = toFiniteNumber(accuracy);
  const hitsWithoutCheck = Boolean(alwaysHit) || parsedAccuracy === 0;
  const safeAccuracy = parsedAccuracy === null
    ? 100
    : Math.min(100, Math.max(1, parsedAccuracy));
  const accuracyLabel = hitsWithoutCheck
    ? '必中'
    : `${formatCompactNumber(safeAccuracy)}%`;
  const multiplierLabel = isStatus ? '' : `×${formatMultiplier(safeMultiplier)}`;
  const label = FORECAST_LABELS[kind];
  const target = typeof targetName === 'string' && targetName.trim()
    ? targetName.trim()
    : '目标';
  const accuracySummary = hitsWithoutCheck ? '必中' : `命中 ${accuracyLabel}`;
  const summary = isStatus
    ? `${target} · ${accuracySummary}`
    : `${target} · ${isStab ? '本系' : '非本系'} · 倍率 ${multiplierLabel} · ${accuracySummary}`;
  const a11yLabel = isStatus
    ? `对${target}，变化技能，${hitsWithoutCheck ? '必中' : `命中率 ${accuracyLabel}`}。`
    : `对${target}，${label}，${isStab ? '本系加成' : '无本系加成'}，属性倍率 ${multiplierLabel}，${hitsWithoutCheck ? '必中' : `命中率 ${accuracyLabel}`}。`;

  return {
    kind,
    label,
    multiplier: safeMultiplier,
    multiplierLabel,
    accuracyLabel,
    summary,
    a11yLabel,
  };
};
