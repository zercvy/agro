import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet } from 'lucide-react'; // или любая другая иконка

interface Props {
  data: { hour: string; humidity: number }[];
}

const WeatherHumidityChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow">
      <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
        <Droplet className="w-5 h-5" />
        <span>Влажность в течение дня</span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
          <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherHumidityChart;
