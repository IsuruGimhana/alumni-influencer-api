import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function JobTitleChart ({ data }) {
  const formattedData = data?.map(d => ({
    name: d.jobTitle || d.role,
    value: Number(d.count) || 0
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart layout="vertical" data={formattedData} margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 10, fill: '#475569' }} 
            axisLine={false}
          />
          <Tooltip cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};