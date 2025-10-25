interface FootVisualizationProps {
  sensor1: number;
  sensor2: number;
  sensor3: number;
  sensor4: number;
  sensor5: number;
}

const FootVisualization = ({ sensor1, sensor2, sensor3, sensor4, sensor5 }: FootVisualizationProps) => {
  // Updated: ESP32 now sends percentages (0 - 100)
  const maxValue = 100;

  const getPressureColor = (value: number) => {
    const intensity = Math.max(0, Math.min(1, value / maxValue));
    if (intensity < 0.2) return '#1e293b'; // Very low - dark slate
    if (intensity < 0.4) return '#3b82f6'; // Low - blue
    if (intensity < 0.6) return '#22c55e'; // Medium - green
    if (intensity < 0.8) return '#eab308'; // High - yellow
    return '#ef4444'; // Very high - red
  };

  const getPressureOpacity = (value: number) => {
    const intensity = Math.max(0, Math.min(1, value / maxValue));
    return 0.3 + (intensity * 0.7); // Range from 0.3 to 1.0
  };

  const SensorPoint = ({ value, x, y, label }: { value: number; x: number; y: number; label: string }) => {
    const color = getPressureColor(value);
    const opacity = getPressureOpacity(value);
    // Scale radius from 16 to 48 based on percentage
    const radius = 16 + (Math.max(0, Math.min(1, value / maxValue))) * 32; // 16 - 48

    return (
      <g>
        {/* Glow effect */}
        <circle
          cx={x}
          cy={y}
          r={radius + 10}
          fill={color}
          opacity={opacity * 0.3}
          className="transition-all duration-300"
        />
        {/* Main sensor point */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={color}
          opacity={opacity}
          className="transition-all duration-300"
        />
        {/* Label */}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold fill-white"
        >
          {label}
        </text>
        {/* Value display (percentage) */}
        <text
          x={x}
          y={y + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-semibold fill-white"
        >
          {value.toFixed ? value.toFixed(1) : value}%
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Foot SVG Visualization */}
      <div className="relative w-full max-w-md aspect-[2/3]">
        <svg
          viewBox="0 0 300 450"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Foot outline */}
          <path
            d="M 150 50
               Q 180 50 200 70
               Q 220 90 220 120
               L 220 280
               Q 220 320 200 350
               Q 180 380 150 400
               Q 140 410 130 420
               Q 120 430 110 435
               Q 100 440 90 440
               Q 75 440 65 430
               Q 55 420 50 400
               L 50 280
               Q 50 200 60 150
               Q 70 100 90 70
               Q 110 50 150 50
               Z"
            fill="#334155"
            stroke="#475569"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Sensor positions mapped to foot anatomy:
              Sensor 1: Heel
              Sensor 2: Arch (mid-foot)
              Sensor 3: Ball of foot (metatarsal)
              Sensor 4: Big toe
              Sensor 5: Little toe side
          */}

          {/* Sensor 1 - Heel */}
          <SensorPoint value={sensor1} x={135} y={360} label="S1" />

          {/* Sensor 2 - Arch */}
          <SensorPoint value={sensor2} x={135} y={250} label="S2" />

          {/* Sensor 3 - Ball of foot */}
          <SensorPoint value={sensor3} x={135} y={150} label="S3" />

          {/* Sensor 4 - Big toe */}
          <SensorPoint value={sensor4} x={150} y={80} label="S4" />

          {/* Sensor 5 - Little toe side */}
          <SensorPoint value={sensor5} x={180} y={100} label="S5" />
        </svg>
      </div>

      {/* Pressure Scale Legend */}
      <div className="w-full max-w-md bg-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Pressure Scale</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Low</span>
          <div className="flex-1 h-6 rounded-lg overflow-hidden flex">
            <div className="flex-1 bg-slate-800"></div>
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="flex-1 bg-red-500"></div>
          </div>
          <span className="text-xs text-slate-400">High</span>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>

      {/* Sensor Location Labels */}
      <div className="w-full max-w-md bg-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Sensor Locations</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">S1</div>
            <span className="text-slate-300">Heel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">S2</div>
            <span className="text-slate-300">Arch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">S3</div>
            <span className="text-slate-300">Ball of Foot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">S4</div>
            <span className="text-slate-300">Big Toe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">S5</div>
            <span className="text-slate-300">Little Toe Side</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootVisualization;
