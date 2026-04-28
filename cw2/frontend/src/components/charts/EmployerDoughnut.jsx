export default function EmployerDoughnut ({ data }) {
  const COLORS = ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="company"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >
            {data?.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};