import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * @param {Array} data - Expects objects like { programme: string, count: string|number }
 */
const ProgrammeDistChart = ({ data }) => {
  // Backend integration: Ensure counts are numbers and handle nulls
  const formattedData = data?.map(d => ({
    name: d.programme || 'Unknown',
    count: Number(d.count) || 0
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar 
            dataKey="count" 
            fill="#f59e0b" // Amber color used in the provided mock UI
            radius={[6, 6, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgrammeDistChart;