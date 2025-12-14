'use client';

interface QualityScoreGaugeProps {
  score: number;
  label?: string;
}

export default function QualityScoreGauge({ score, label = 'Quality Score' }: QualityScoreGaugeProps) {
  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#22c55e', bg: 'bg-green-900/20', text: 'text-green-400' };
    if (score >= 60) return { stroke: '#eab308', bg: 'bg-yellow-900/20', text: 'text-yellow-400' };
    if (score >= 40) return { stroke: '#f97316', bg: 'bg-orange-900/20', text: 'text-orange-400' };
    return { stroke: '#ef4444', bg: 'bg-red-900/20', text: 'text-red-400' };
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const colors = getColor(score);
  const grade = getGrade(score);

  // SVG circle properties
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`${colors.bg} rounded-2xl p-6 border border-neutral-800`}>
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#262626"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-neutral-500 text-sm mt-1">out of 100</span>
            <span className={`text-2xl font-bold mt-2 ${colors.text}`}>{grade}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-4">{label}</h3>
        <p className="text-neutral-500 text-sm text-center mt-1">
          {score >= 80 && 'Excellent data quality'}
          {score >= 60 && score < 80 && 'Good, but needs improvement'}
          {score >= 40 && score < 60 && 'Fair - review flagged issues'}
          {score < 40 && 'Poor - immediate attention required'}
        </p>
      </div>
    </div>
  );
}
