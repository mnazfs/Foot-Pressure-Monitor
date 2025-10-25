import { TrendingUp } from 'lucide-react';

interface SensorReadingsProps {
  sensor1: number;
  sensor2: number;
  sensor3: number;
  sensor4: number;
  sensor5: number;
  timestamp: string;
}

const SensorReadings = ({ sensor1, sensor2, sensor3, sensor4, sensor5, timestamp }: SensorReadingsProps) => {
  // ESP32 sends percentage values (0-100)
  const maxValue = 100;

  const sensors = [
    { id: 1, name: 'Heel', value: sensor1, location: 'Heel' },
    { id: 2, name: 'Arch', value: sensor2, location: 'Mid-foot Arch' },
    { id: 3, name: 'Ball', value: sensor3, location: 'Ball of Foot' },
    { id: 4, name: 'Big Toe', value: sensor4, location: 'Big Toe' },
    { id: 5, name: 'Outer', value: sensor5, location: 'Little Toe Side' },
  ];

  // Values are already percentages; clamp and format
  const getPercentage = (value: number) => {
    const pct = Math.max(0, Math.min(100, value));
    return pct.toFixed(1);
  };

  const getPressureLevel = (value: number) => {
    const intensity = value / maxValue;
    if (intensity < 0.2) return { label: 'Very Low', color: 'text-slate-400' };
    if (intensity < 0.4) return { label: 'Low', color: 'text-blue-400' };
    if (intensity < 0.6) return { label: 'Medium', color: 'text-green-400' };
    if (intensity < 0.8) return { label: 'High', color: 'text-yellow-400' };
    return { label: 'Very High', color: 'text-red-400' };
  };

  const getBarColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity < 0.2) return 'bg-slate-500';
    if (intensity < 0.4) return 'bg-blue-500';
    if (intensity < 0.6) return 'bg-green-500';
    if (intensity < 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalPressure = sensor1 + sensor2 + sensor3 + sensor4 + sensor5;
  const averagePressure = (totalPressure / 5).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Total Pressure</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalPressure.toFixed ? totalPressure.toFixed(1) : totalPressure}</div>
          <div className="text-xs text-slate-500 mt-1">Sum of all sensors (%)</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-white">{averagePressure}%</div>
          <div className="text-xs text-slate-500 mt-1">Mean pressure (%)</div>
        </div>
      </div>

      {/* Individual Sensor Readings */}
      <div className="space-y-4">
        {sensors.map((sensor) => {
          const percentage = getPercentage(sensor.value);
          const pressureLevel = getPressureLevel(sensor.value);
          const barColor = getBarColor(sensor.value);

          return (
            <div key={sensor.id} className="bg-slate-700/50 rounded-xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">S{sensor.id}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{sensor.name}</div>
                    <div className="text-xs text-slate-400">{sensor.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{sensor.value.toFixed ? sensor.value.toFixed(1) : sensor.value}</div>
                  <div className={`text-xs font-medium ${pressureLevel.color}`}>
                    {pressureLevel.label}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-500">0%</span>
                  <span className="text-xs font-medium text-slate-300">{percentage}%</span>
                  <span className="text-xs text-slate-500">100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timestamp */}
      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
        <div className="text-xs text-slate-400 mb-1">Last Updated</div>
        <div className="text-sm font-mono font-semibold text-cyan-400">{timestamp}</div>
      </div>
    </div>
  );
};

export default SensorReadings;
