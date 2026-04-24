// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, Users, Download, Loader2, TrendingUp, 
//   PieChart as PieIcon, BarChart3, Map, Filter, Save 
// } from 'lucide-react';
// import { 
//   Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, 
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
//   LineChart, Line, PieChart, Pie, Cell, Sector, CartesianGrid, Legend, ReferenceLine, Label
// } from 'recharts';
// import { mockData } from './mockData';

// // --- SHARED COMPONENTS ---
// const Sidebar = () => (
//   <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:block fixed h-full shadow-xl">
//     <div className="flex items-center gap-2 text-blue-400 font-bold text-2xl mb-10">
//       <BarChart3 /> <span>UniStats</span>
//     </div>
//     <nav className="space-y-4">
//       <Link to="/" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition">
//         <LayoutDashboard size={20} /> Overview
//       </Link>
//       <Link to="/directory" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition">
//         <Users size={20} /> Alumni Directory
//       </Link>
//     </nav>
//   </aside>
// );

// const transformForRadarChart = (backendSkills) => {
//   // 1. Find the highest count to normalize the scale (0-100)
//   const maxVal = Math.max(...backendSkills.map(s => s.count));

//   return backendSkills.map(skill => ({
//     subject: skill.title,
//     // Normalize backend count to a 0-100 score
//     ind: Math.round((skill.count / maxVal) * 100), 
//     // This is the "University" side (Dummy value for now)
//     curr: 50 
//   }));
// };

// const analyzeIndustryDemand = (skillsData) => {
//   if (!skillsData || skillsData.length === 0) return null;

//   const sorted = [...skillsData].sort((a, b) => b.count - a.count);
//   const topSkill = sorted[0];

//   const restAvg = sorted.length > 1
//     ? sorted.slice(1).reduce((sum, s) => sum + s.count, 0) / (sorted.length - 1)
//     : topSkill.count;

//   const growthFactor = (((topSkill.count / restAvg) - 1) * 100).toFixed(0);

//   return {
//     chartData: sorted.slice(0, 6),
//     topSkillName: topSkill.title,
//     percentageLabel: `${growthFactor}% higher than others`
//   };
// };

// // --- 1. DASHBOARD PAGE ---
// const AnalyticsDashboard = () => {
//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

//   return (
//     <div className="space-y-8">
//       {/* KPI Row  - key performance indicators */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {[
//           { label: "Employment Rate", val: "94.2%", color: "text-emerald-600" },
//           { label: "Top Skill Gap", val: "Cloud", color: "text-amber-500" },
//           { label: "Avg. Salary", val: "£45k", color: "text-blue-600" },
//           { label: "Top Region", val: "London", color: "text-slate-800" },
//         ].map((kpi, i) => (
//           <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
//             <p className="text-slate-400 text-xs font-bold uppercase">{kpi.label}</p>
//             <h3 className={`text-2xl font-bold ${kpi.color}`}>{kpi.val}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Charts Grid - 6 Interactive Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
//         {/* 1. Radar: Skills Gap */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={18}/> Curriculum Skills Gap</h3>
//           <div className="h-64">
//             <ResponsiveContainer>
//               {/* Transform the backend-style data here */}
//               <RadarChart data={transformForRadarChart(mockData.skills)}>
//                 <PolarGrid />
//                 <PolarAngleAxis dataKey="subject" />
//                 <RadarArea 
//                   name="Industry Demand" 
//                   dataKey="ind" 
//                   stroke="#10b981" 
//                   fill="#10b981" 
//                   fillOpacity={0.5} 
//                 />
//                 <RadarArea 
//                   name="Uni Curriculum" 
//                   dataKey="curr" 
//                   stroke="#3b82f6" 
//                   fill="#3b82f6" 
//                   fillOpacity={0.5} 
//                 />
//                 <Tooltip />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="font-bold text-slate-700 flex items-center gap-2">
//                 <TrendingUp className="text-blue-500" size={20} />
//                 Industry Demand Tracking
//               </h3>
//               <p className="text-xs text-slate-500 mt-1">Real-time alumni certification volume</p>
//             </div>
//             <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
//               {analyzeIndustryDemand(mockData.skills)?.percentageLabel}
//             </span>
//           </div>

//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart 
//                 layout="vertical" 
//                 data={analyzeIndustryDemand(mockData.skills)?.chartData} 
//                 margin={{ left: 40, right: 30 }}
//               >
//                 <XAxis type="number" hide />
//                 <YAxis 
//                   dataKey="title" 
//                   type="category" 
//                   tick={{fontSize: 10, fill: '#64748b'}} 
//                   width={120}
//                 />
//                 <Tooltip 
//                   cursor={{fill: 'transparent'}}
//                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//                 />
//                 <Bar 
//                   dataKey="count" 
//                   fill="#3b82f6" 
//                   radius={[0, 4, 4, 0]} 
//                   barSize={20}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="mt-4 p-3 border-l-4 border-blue-500 bg-slate-50">
//             <p className="text-[11px] text-slate-600 leading-relaxed">
//               <strong>Automatic Insight:</strong> {analyzeIndustryDemand(mockData.skills)?.topSkillName} is currently the most 
//               sought-after certification among graduates. This indicates a primary industry pathway.
//             </p>
//           </div>
//         </div>

//         {/* 2. Bar: Top Employers */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">Top Alumni Employers</h3>
//           <div className="h-64"><ResponsiveContainer>
//             <BarChart data={mockData.employers}>
//               <XAxis dataKey="name" /><YAxis /><Tooltip />
//               <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer></div>
//         </div>

//         {/* 3. Pie: Industry Distribution */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">Employment by Sector</h3>
//           <div className="h-64"><ResponsiveContainer>
//             <PieChart>
//               <Pie data={mockData.industries} innerRadius={60} outerRadius={80} dataKey="value" label>
//                 {mockData.industries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer></div>
//         </div>

//         {/* 4. Line: Employment Trends */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">Employment Rate Trend (%)</h3>
//           <div className="h-64"><ResponsiveContainer>
//             <LineChart data={mockData.trends}>
//               <XAxis dataKey="year" /><YAxis domain={[80, 100]} /><Tooltip />
//               <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- 2. ALUMNI DIRECTORY PAGE ---
// const AlumniDirectory = () => {
//   const [filter, setFilter] = useState('');

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//       <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
//             <input 
//               type="text" placeholder="Filter by Programme or Industry..." 
//               className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
//               onChange={(e) => setFilter(e.target.value)}
//             />
//           </div>
//           <button className="flex items-center gap-2 text-blue-600 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition">
//             <Save size={18}/> Save Preset
//           </button>
//         </div>
//         <div className="flex gap-2">
//           <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 shadow-md">
//             <Download size={18}/> Export CSV
//           </button>
//         </div>
//       </div>

//       <table className="w-full text-left">
//         <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
//           <tr>
//             <th className="px-6 py-4">Full Name</th>
//             <th className="px-6 py-4">Programme</th>
//             <th className="px-6 py-4">Graduation</th>
//             <th className="px-6 py-4">Industry</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100">
//           {mockData.alumni
//             .filter(a => a.prog.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || a.industry.includes(filter.toLocaleLowerCase()))
//             .map(person => (
//             <tr key={person.id} className="hover:bg-slate-50 transition">
//               <td className="px-6 py-4 font-medium text-slate-700">{person.name}</td>
//               <td className="px-6 py-4 text-slate-600">{person.prog}</td>
//               <td className="px-6 py-4 text-slate-600">{person.year}</td>
//               <td className="px-6 py-4">
//                 <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
//                   {person.industry}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // --- MAIN APP ---
// export default function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1200);
//   }, []);

//   if (loading) return (
//     <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
//       <Loader2 className="animate-spin text-blue-600 mb-2" size={48} />
//       <p className="text-slate-500 font-medium animate-pulse">Initializing Dashboard...</p>
//     </div>
//   );

//   return (
//     <Router>
//       <div className="flex min-h-screen bg-slate-50">
//         <Sidebar />
//         <main className="flex-1 lg:ml-64 p-8">
//           <header className="mb-10 flex justify-between items-end">
//             <div>
//               <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Analytics</h1>
//               <p className="text-slate-500">Visualization & Data Management Client</p>
//             </div>
//           </header>

//           <Routes>
//             <Route path="/" element={<AnalyticsDashboard />} />
//             <Route path="/directory" element={<AlumniDirectory />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, Users, Download, Loader2, TrendingUp, Filter, Save 
// } from 'lucide-react';

// import {
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
//   LineChart, Line, PieChart, Pie, Cell,
//   RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area, Legend
// } from 'recharts';

// import { mockData } from './mockData';

// // ---------- HELPERS ----------
// const transformForRadarChart = (skills) => {
//   const max = Math.max(...skills.map(s => s.count));

//   return skills.map(s => ({
//     subject: s.title,
//     industry: Math.round((s.count / max) * 100),
//     curriculum: 40 // assumed baseline
//   }));
// };

// const analyzeIndustryDemand = (skills) => {
//   if (!skills?.length) return null;

//   const sorted = [...skills].sort((a, b) => b.count - a.count);
//   const top = sorted[0];

//   const restAvg = sorted.length > 1
//     ? sorted.slice(1).reduce((sum, s) => sum + s.count, 0) / (sorted.length - 1)
//     : top.count;

//   const percentage = (((top.count / restAvg) - 1) * 100).toFixed(0);

//   return {
//     chartData: sorted.slice(0, 6),
//     topSkill: top.title,
//     percentage
//   };
// };

// const getInsightLevel = (val) => {
//   if (val > 150) return { label: "Critical", color: "bg-red-100 text-red-600" };
//   if (val > 80) return { label: "Significant", color: "bg-amber-100 text-amber-600" };
//   return { label: "Emerging", color: "bg-green-100 text-green-600" };
// };

// // ---------- SIDEBAR ----------
// const Sidebar = () => (
//   <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:block fixed h-full">
//     <h2 className="text-xl font-bold mb-8">UniStats</h2>
//     <nav className="space-y-3">
//       <Link to="/" className="block p-2 hover:bg-slate-800 rounded">Dashboard</Link>
//       <Link to="/directory" className="block p-2 hover:bg-slate-800 rounded">Directory</Link>
//     </nav>
//   </aside>
// );

// // ---------- DASHBOARD ----------
// const Dashboard = () => {
//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

//   const demand = analyzeIndustryDemand(mockData.skills);
//   const insight = getInsightLevel(Number(demand?.percentage));

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//       {/* 1. SKILLS GAP (RADAR) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <h3 className="font-bold mb-4">Curriculum Skills Gap</h3>
//         <ResponsiveContainer height={250}>
//           <RadarChart data={transformForRadarChart(mockData.skills)}>
//             <PolarGrid />
//             <PolarAngleAxis dataKey="subject" />
//             <Radar dataKey="industry" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
//             <Radar dataKey="curriculum" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
//             <Tooltip />
//           </RadarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 2. INDUSTRY DEMAND (HORIZONTAL BAR) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <div className="flex justify-between mb-3">
//           <h3 className="font-bold">Industry Demand</h3>
//           <span className={`px-2 py-1 text-xs rounded ${insight.color}`}>
//             {insight.label}
//           </span>
//         </div>

//         <ResponsiveContainer height={250}>
//           <BarChart layout="vertical" data={demand.chartData}>
//             <XAxis type="number" />
//             <YAxis dataKey="title" type="category" />
//             <Tooltip />
//             <Bar dataKey="count" fill="#3b82f6" />
//           </BarChart>
//         </ResponsiveContainer>

//         <p className="text-xs mt-3 text-slate-600">
//           <b>{demand.topSkill}</b> demand is {demand.percentage}% higher than others.
//         </p>
//       </div>

//       {/* 3. DEMAND TREND (AREA CHART) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <h3 className="font-bold mb-4">Cloud Demand Growth</h3>
//         <ResponsiveContainer height={250}>
//           <AreaChart data={mockData.demandTrend}>
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Area type="monotone" dataKey="cloud" stroke="#3b82f6" fill="#93c5fd" />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 4. CAREER SHIFT (PIE CHART) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <h3 className="font-bold mb-4">Career Path Shift</h3>
//         <ResponsiveContainer height={250}>
//           <PieChart>
//             <Pie data={mockData.careerShift} dataKey="value" outerRadius={80} label>
//               {mockData.careerShift.map((_, i) => (
//                 <Cell key={i} fill={COLORS[i]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 5. CERTIFICATIONS (DOUGHNUT) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <h3 className="font-bold mb-4">Professional Certifications</h3>
//         <ResponsiveContainer height={250}>
//           <PieChart>
//             <Pie
//               data={mockData.certifications}
//               innerRadius={50}
//               outerRadius={80}
//               dataKey="value"
//             >
//               {mockData.certifications.map((_, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 6. TOP EMPLOYERS (BAR) */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <h3 className="font-bold mb-4">Top Employers</h3>
//         <ResponsiveContainer height={250}>
//           <BarChart data={mockData.employers}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="count" fill="#10b981" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 7. STACKED BAR (BAR) */}
//       <div className="bg-white p-5 rounded-xl shadow col-span-1 xl:col-span-2">
//         <h3 className="font-bold mb-4">Multi-Skill Adoption by Programme</h3>
//         <ResponsiveContainer height={300}>
//           <BarChart data={[
//             { name: "CS", cloud: 80, data: 40 },
//             { name: "Business", cloud: 30, data: 70 }
//           ]}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="cloud" stackId="a" fill="#3b82f6" />
//             <Bar dataKey="data" stackId="a" fill="#10b981" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// // ---------- DIRECTORY ----------
// const Directory = () => {
//   const [filter, setFilter] = useState('');

//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <input
//         placeholder="Filter..."
//         className="border p-2 mb-4 w-full"
//         onChange={(e) => setFilter(e.target.value)}
//       />

//       {mockData.alumni
//         .filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
//         .map(a => (
//           <div key={a.id} className="border-b py-2">
//             {a.name} - {a.prog}
//           </div>
//         ))}
//     </div>
//   );
// };

// // ---------- MAIN ----------
// export default function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 800);
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <Loader2 className="animate-spin" size={40} />
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-6 lg:ml-64 bg-slate-50 min-h-screen">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/directory" element={<Directory />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, TrendingUp, GraduationCap, MapPin, Globe, Briefcase 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { mockData } from './mockData';

// Helper to handle Sequelize string counts
const toNum = (val) => Number(val) || 0;

// --- PAGES ---

const DashboardOverview = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-400 text-xs font-bold uppercase">Top Employer</p>
        <h3 className="text-2xl font-bold">
          {mockData.employers?.[0]?.company || "N/A"}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-400 text-xs font-bold uppercase">Primary Location</p>
        <h3 className="text-2xl font-bold">
          {mockData.geography?.[0]?.city || "N/A"}
        </h3>
      </div>
    </div>
  </div>
);

const GraphsPages = () => {
  // Logic for Scenario 3: Calculate Demand Surge from the certTrends data
  const latest = toNum(mockData.certTrends?.[mockData.certTrends?.length - 1]?.count);
  const previous = toNum(mockData.certTrends?.[0]?.count);

  const surge =
    previous !== 0
      ? (((latest - previous) / previous) * 100).toFixed(0)
      : 0;

  return (
    <div className="space-y-8">
      {/* 1. Radar Chart: Skills Gap (getSkillsGapData) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Curriculum Skills Gap</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={mockData.skillsGap.map(d => ({ 
                subject: d.title, 
                A: toNum(d.count), 
                B: 50 
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
                <RadarArea name="Alumni" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <RadarArea name="Curriculum" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Line Chart: Certification Trends (getCertificationTrend) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700">Demand Tracking (Surge: {surge}%)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={mockData.certTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Bar Chart: Job Titles (getJobTitleTrends) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Common Job Titles</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={mockData.jobTrends}>
                <XAxis type="number" hide />
                <YAxis dataKey="jobTitle" type="category" width={100} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Pie Chart: Geography (getGeographicalDist) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4 text-center">Global Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={mockData.geography.map(d => ({
                    ...d,
                    count: toNum(d.count)
                  }))} 
                  dataKey="count" 
                  nameKey="city" 
                  cx="50%" cy="50%" 
                  outerRadius={80} 
                  label
                >
                  {mockData.geography.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Doughnut Chart: Top Employers */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4 text-center">
            Top Employers
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={mockData.employers.map(d => ({
                    ...d,
                    count: toNum(d.count)
                  }))}
                  dataKey="count"
                  nameKey="company"
                  innerRadius={50}
                  outerRadius={80}
                  label
                >
                  {mockData.employers.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Bar Chart: Programme Distribution */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">
            Alumni by Programme
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={mockData.programmeDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                
                <XAxis 
                  dataKey="programme" 
                  tick={{ fontSize: 10 }} 
                />
                
                <YAxis tick={{ fontSize: 10 }} />
                
                <Tooltip />
                
                <Bar 
                  dataKey="count" 
                  fill="#f59e0b" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewAlumni = () => (
  <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b text-[10px] uppercase text-slate-500 font-bold">
        <tr>
          <th className="p-4">Alumni Name</th>
          <th className="p-4">Programme</th>
          <th className="p-4">Current Role</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {mockData.alumniDirectory.map(alumnus => (
          <tr key={alumnus.id} className="border-b hover:bg-slate-50 transition">
            <td className="p-4 font-medium">{alumnus.firstName} {alumnus.lastName}</td>
            <td className="p-4">{alumnus.Profile?.Degrees?.[0]?.title || 'N/A'}</td>
            <td className="p-4">{alumnus.Profile?.Work?.[0]?.jobTitle || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- MAIN LAYOUT ---

const Sidebar = () => (
  <aside className="w-64 bg-slate-900 text-white p-6 fixed h-full">
    <div className="flex items-center gap-2 text-blue-400 font-bold text-2xl mb-10">
      <GraduationCap size={28}/> <span>UniStats</span>
    </div>
    <nav className="space-y-2">
      <Link to="/" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition"><LayoutDashboard size={18}/> Dashboard</Link>
      <Link to="/analytics" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition"><BarChart3 size={18}/> Graphs Pages</Link>
      <Link to="/directory" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition"><Users size={18}/> View Alumni</Link>
    </nav>
  </aside>
);

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="ml-64 flex-1 p-10">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/analytics" element={<GraphsPages />} />
            <Route path="/directory" element={<ViewAlumni />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}