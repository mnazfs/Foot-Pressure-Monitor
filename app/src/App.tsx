import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import FootVisualization from './components/FootVisualization';
import SensorReadings from './components/SensorReadings';

interface SensorData {
  sensor1: number;
  sensor2: number;
  sensor3: number;
  sensor4: number;
  sensor5: number;
  timestamp: string;
}

function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    // ESP32 now sends scaled percentages (0-100)
    sensor1: 0,
    sensor2: 0,
    sensor3: 0,
    sensor4: 0,
    sensor5: 0,
    timestamp: new Date().toLocaleTimeString()
  });

  const [isConnected, setIsConnected] = useState(false);
  const [esp32Ip, setEsp32Ip] = useState('10.11.129.150');

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Try to parse JSON first (ESP32 returns JSON percentages: {"sensor1":12.3,...})
        const response = await fetch(`http://${esp32Ip}`, { cache: 'no-store' });
        let values = null as any;

        try {
          const json = await response.json();
          // Expect numeric keys sensor1..sensor5 in 0-100 range
          if (
            json &&
            typeof json.sensor1 === 'number' &&
            typeof json.sensor2 === 'number' &&
            typeof json.sensor3 === 'number' &&
            typeof json.sensor4 === 'number' &&
            typeof json.sensor5 === 'number'
          ) {
            values = {
              sensor1: json.sensor1,
              sensor2: json.sensor2,
              sensor3: json.sensor3,
              sensor4: json.sensor4,
              sensor5: json.sensor5,
            };
          }
        } catch (e) {
          // Not JSON, fall back to text parsing below
        }

        if (!values) {
          const text = await response.text();
          // Fallback: try to parse numbers from a plain text response (legacy support)
          const parsed = parseSensorData(text);
          values = parsed;
        }

        setSensorData({
          ...values,
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsConnected(false);
      }
    };

    const interval = setInterval(fetchSensorData, 1000);
    fetchSensorData(); // Initial fetch

    return () => clearInterval(interval);
  }, [esp32Ip]);

  const parseSensorData = (text: string): Omit<SensorData, 'timestamp'> => {
    // Try to parse comma-separated values or extract numbers from text
    const numbers = text.match(/\d+/g);

    if (numbers && numbers.length >= 5) {
      return {
        sensor1: parseInt(numbers[0]) || 0,
        sensor2: parseInt(numbers[1]) || 0,
        sensor3: parseInt(numbers[2]) || 0,
        sensor4: parseInt(numbers[3]) || 0,
        sensor5: parseInt(numbers[4]) || 0,
      };
    }

    // Return zeros if parsing fails
    return { sensor1: 0, sensor2: 0, sensor3: 0, sensor4: 0, sensor5: 0 };
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Activity className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Foot Pressure Monitor</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time sensor data visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Foot Visualization */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Foot Pressure Map</h2>
            <FootVisualization
              sensor1={sensorData.sensor1}
              sensor2={sensorData.sensor2}
              sensor3={sensorData.sensor3}
              sensor4={sensorData.sensor4}
              sensor5={sensorData.sensor5}
            />
          </div>

          {/* Sensor Readings */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Sensor Readings</h2>
            <SensorReadings
              sensor1={sensorData.sensor1}
              sensor2={sensorData.sensor2}
              sensor3={sensorData.sensor3}
              sensor4={sensorData.sensor4}
              sensor5={sensorData.sensor5}
              timestamp={sensorData.timestamp}
            />
          </div>
        </div>

        {/* ESP32 IP Configuration */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-4">
            <label htmlFor="esp32-ip" className="text-white font-medium">ESP32 IP Address:</label>
            <input
              id="esp32-ip"
              type="text"
              value={esp32Ip}
              onChange={(e) => setEsp32Ip(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="172.28.58.188"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
