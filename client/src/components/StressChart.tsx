import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { format } from "date-fns";

type DataPoint = {
  date: string | Date;
  score: number;
};

interface StressChartProps {
  data: DataPoint[];
  height?: number;
}

export function StressChart({ data, height = 300 }: StressChartProps) {
  const chartData = data.map(d => ({
    ...d,
    formattedDate: format(new Date(d.date), "MMM d, HH:mm"),
    // Invert score visual if needed, but usually higher stress = higher line
  }));

  return (
    <div style={{ width: '100%', height }} className="bg-white rounded-xl border border-border/50 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Wellbeing Trends (Stress Level)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#94A3B8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#FFF", 
              borderRadius: "8px", 
              border: "1px solid #E2E8F0", 
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
            }}
          />
          <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: 'High Stress', fill: '#EF4444', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#FFF" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
