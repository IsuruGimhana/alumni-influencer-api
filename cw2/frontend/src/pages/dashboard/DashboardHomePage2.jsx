// import {
//   ResponsiveContainer,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   Tooltip,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from "recharts";

// import { useContext } from "react";
// import { DashboardContext } from "../../context/DashboardContext";

// export default function DashboardHomePage() {
//   const {
//     skillsGap,
//     jobTrends,
//     employers,
//     geo,
//     certificationTrends,
//     programmeDistribution
//   } = useContext(DashboardContext);

//   // -----------------------------
//   // SAFE NUMBER CONVERSION
//   // -----------------------------
//   const toNum = (val) => Number(val) || 0;

//   const safe = (arr) => Array.isArray(arr) ? arr : [];

//   // -----------------------------
//   // RADAR DATA (Skills Gap)
//   // -----------------------------
//   const skillsGapData = safe(skillsGap).map(d => ({
//     subject: d.title,
//     A: toNum(d.count),
//     B: 50 // curriculum baseline (static for now)
//   }));

//   // -----------------------------
//   // JOB TRENDS
//   // -----------------------------
//   const jobTrendsData = safe(jobTrends).map(d => ({
//     jobTitle: d.jobTitle,
//     count: toNum(d.count)
//   }));

//   // -----------------------------
//   // EMPLOYERS
//   // -----------------------------
//   const employersData = safe(employers).map(d => ({
//     company: d.company,
//     count: toNum(d.count)
//   }));

//   // -----------------------------
//   // GEOGRAPHY
//   // -----------------------------
//   const geoData = safe(geo).map(d => ({
//     city: d.city,
//     count: toNum(d.count)
//   }));

//   // -----------------------------
//   // CERTIFICATION TRENDS
//   // -----------------------------
//   const certData = safe(certificationTrends).map(d => ({
//     month: d.month,
//     count: toNum(d.count)
//   }));

//   // surge calculation
//   const latest = certData.at(-1)?.count || 0;
//   const previous = certData[0]?.count || 0;

//   const surge =
//     previous !== 0
//       ? (((latest - previous) / previous) * 100).toFixed(0)
//       : 0;

//   // -----------------------------
//   // PROGRAMME DISTRIBUTION
//   // -----------------------------
//   const programmeData = safe(programmeDistribution).map(d => ({
//     programme: d.programme,
//     count: toNum(d.count)
//   }));

//   // -----------------------------
//   // COLORS
//   // -----------------------------
//   const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

//   return (
//     <div className="space-y-8">

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//         {/* ===================== SKILLS GAP ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">
//             Curriculum Skills Gap
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <RadarChart data={skillsGapData}>
//                 <PolarGrid />
//                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />

//                 <Radar
//                   name="Alumni Demand"
//                   dataKey="A"
//                   stroke="#3b82f6"
//                   fill="#3b82f6"
//                   fillOpacity={0.6}
//                 />

//                 <Radar
//                   name="Curriculum Baseline"
//                   dataKey="B"
//                   stroke="#94a3b8"
//                   fill="#94a3b8"
//                   fillOpacity={0.3}
//                 />

//                 <Tooltip />
//                 <Legend />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>

//           <p className="text-xs text-slate-500 mt-3">
//             Shows certification demand vs curriculum baseline coverage.
//           </p>
//         </div>

//         {/* ===================== CERT TREND ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700">
//             Demand Tracking (Surge: {surge}%)
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <LineChart data={certData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" tick={{ fontSize: 10 }} />
//                 <YAxis tick={{ fontSize: 10 }} />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#10b981"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ===================== JOB TRENDS ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">
//             Common Job Titles
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <BarChart layout="vertical" data={jobTrendsData}>
//                 <XAxis type="number" />
//                 <YAxis dataKey="jobTitle" type="category" width={120} />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#6366f1" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ===================== GEOGRAPHY ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700 text-center">
//             Global Distribution
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={geoData}
//                   dataKey="count"
//                   nameKey="city"
//                   outerRadius={80}
//                   label
//                 >
//                   {geoData.map((_, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ===================== EMPLOYERS ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700 text-center">
//             Top Employers
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={employersData}
//                   dataKey="count"
//                   nameKey="company"
//                   innerRadius={50}
//                   outerRadius={80}
//                   label
//                 >
//                   {employersData.map((_, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ===================== PROGRAMME ===================== */}
//         <div className="bg-white p-6 rounded-2xl border shadow-sm">
//           <h3 className="font-bold text-slate-700 mb-4">
//             Alumni by Programme
//           </h3>

//           <div className="h-64">
//             <ResponsiveContainer>
//               <BarChart data={programmeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="programme" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#f59e0b" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { useContext, useRef } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { toPng } from "html-to-image";
import { Download, BarChart3 } from "lucide-react";

export default function DashboardHomePage() {
  const {
    skillsGap,
    jobTrends,
    employers,
    geo,
    certificationTrends,
    programmeDistribution
  } = useContext(DashboardContext);

  const toNum = (v) => Number(v) || 0;
  const safe = (arr) => Array.isArray(arr) ? arr : [];

  // -----------------------------
  // REFS (each chart)
  // -----------------------------
  const skillsRef = useRef();
  const certRef = useRef();
  const jobRef = useRef();
  const geoRef = useRef();
  const empRef = useRef();
  const progRef = useRef();

  // -----------------------------
  // DOWNLOAD FUNCTION
  // -----------------------------
  const downloadChart = async (ref, filename) => {
    if (!ref.current) return;

    const dataUrl = await toPng(ref.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  };

  // -----------------------------
  // DATA TRANSFORMS
  // -----------------------------
  const skillsGapData = safe(skillsGap).map(d => ({
    subject: d.title,
    A: toNum(d.count),
    B: 50
  }));

  const certData = safe(certificationTrends).map(d => ({
    month: d.month,
    count: toNum(d.count)
  }));

  const jobData = safe(jobTrends).map(d => ({
    jobTitle: d.jobTitle,
    count: toNum(d.count)
  }));

  const geoData = safe(geo).map(d => ({
    city: d.city,
    count: toNum(d.count)
  }));

  const empData = safe(employers).map(d => ({
    company: d.company,
    count: toNum(d.count)
  }));

  const progData = safe(programmeDistribution).map(d => ({
    programme: d.programme,
    count: toNum(d.count)
  }));

  const latest = certData.at(-1)?.count || 0;
  const previous = certData[0]?.count || 0;

  const surge =
    previous ? (((latest - previous) / previous) * 100).toFixed(0) : 0;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // -----------------------------
  // UI CARD WRAPPER STYLE
  // -----------------------------
  const card =
    "bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200";

  const header =
    "flex justify-between items-center mb-4";

  // const btn =
  //   "flex items-center gap-2 text-xs px-3 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition";
  const btn =
  "p-2 rounded-lg border border-black text-slate-700 bg-white hover:bg-slate-100 transition";

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Alumni Analytics
          </h1>

          <p className="text-sm text-gray-500">
            Insights on skills, jobs, certifications & global alumni trends
          </p>
        </div>

        {/* RIGHT SIDE (optional action button like directory page) */}
        <button
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <Download size={18} />
          Export Report
        </button>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= SKILLS GAP ================= */}
        <div ref={skillsRef} className={card}>
          <div className={header}>
            <div>
              <h3 className="font-bold text-slate-700">Skills Gap</h3>
              <p className="text-xs text-gray-500 mt-1">
                Compares certification demand from alumni vs baseline curriculum coverage
              </p>
            </div>

            <button
              onClick={() => downloadChart(skillsRef, "skills-gap")}
              className={btn}
            >
              <Download size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={skillsGapData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                {/* <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} /> */}
                  <Radar
                    name="Alumni Demand"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />

                  <Radar
                    name="Curriculum Coverage"
                    dataKey="B"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.3}
                  />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= CERT TREND ================= */}
        <div ref={certRef} className={card}>
          <div className={header}>
            <div>
              <h3 className="font-bold text-slate-700">
                Certification Trend (Surge: {surge}%)
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Tracks monthly growth in certifications completed by alumni
              </p>
            </div>

            <button onClick={() => downloadChart(certRef, "certification-trend")} className={btn}>
              <Download size={16} strokeWidth={2}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={certData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= JOB TRENDS ================= */}
        <div ref={jobRef} className={card}>
          <div className={header}>
            <div>
            <h3 className="font-bold text-slate-700">Job Trends</h3>
            <p className="text-xs text-gray-500 mt-1">
              Shows the most common job roles held by alumni in the workforce
            </p>
            </div>

            <button
              onClick={() => downloadChart(jobRef, "job-trends")}
              className={btn}
            >
              <Download size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={jobData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                <XAxis type="number" tick={{ fontSize: 10 }} />
                
                <YAxis
                  dataKey="jobTitle"
                  type="category"
                  width={140}
                  tick={{ fontSize: 10 }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= GEOGRAPHY ================= */}
        <div ref={geoRef} className={card}>
          <div className={header}>
            <div>
              <h3 className="font-bold text-slate-700">Geography</h3>
              <p className="text-xs text-gray-500 mt-1">
                Displays where alumni are currently located around the world
              </p>
            </div>

            <button
              onClick={() => downloadChart(geoRef, "geography")}
              className={btn}
            >
              <Download size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={geoData} dataKey="count" nameKey="city" outerRadius={80}>
                  {geoData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= EMPLOYERS ================= */}
        <div ref={empRef} className={card}>
          <div className={header}>
            <div>
              <h3 className="font-bold text-slate-700">Employers</h3>
              <p className="text-xs text-gray-500 mt-1">
                Highlights top companies hiring or employing alumni graduates
              </p>
            </div>

            <button
              onClick={() => downloadChart(empRef, "employers")}
              className={btn}
            >
              <Download size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={empData} dataKey="count" nameKey="company" innerRadius={50} outerRadius={80}>
                  {empData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= PROGRAMME ================= */}
        <div ref={progRef} className={card}>
          <div className={header}>
            <div>
              <h3 className="font-bold text-slate-700">Programme Distribution</h3>
              <p className="text-xs text-gray-500 mt-1">
                Breaks down alumni distribution across academic programmes
              </p>
            </div>

            <button
              onClick={() => downloadChart(progRef, "programme")}
              className={btn}
            >
              <Download size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={progData}>
                <XAxis dataKey="programme" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}