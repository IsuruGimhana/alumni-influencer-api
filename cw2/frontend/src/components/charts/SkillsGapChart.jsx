import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Radar as RadarArea } from 'recharts';

export default function SkillsGapChart ({ data }) {
  // Ensure data is numeric and provide a baseline for 'Curriculum' if not in DB
  const formattedData = data?.map(d => ({
    subject: d.title || d.skill_name,
    industry: Number(d.count) || 0,
    curriculum: d.curriculum_score || 50 // Default baseline
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <RadarChart data={formattedData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
          <RadarArea name="Industry" dataKey="industry" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          <RadarArea name="Curriculum" dataKey="curriculum" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};