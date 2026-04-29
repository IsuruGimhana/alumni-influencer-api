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
import { FilterDropdown } from "../../components/common/FilterDropdown";
import { toPng } from "html-to-image";
import { Download, BarChart3 } from "lucide-react";

export default function DashboardHomePage() {
  const {
    skillsGap,
    jobTrends,
    employers,
    geo,
    certificationTrends,
    programmeDistribution,
    generateReport,
    filters,
    setFilters,
    programmes,
    years
  } = useContext(DashboardContext);

  const toNum = (v) => Number(v) || 0;
  const safe = (arr) => Array.isArray(arr) ? arr : [];

  // -----------------------------
  // REFS
  // -----------------------------
  const skillsRef = useRef();
  const certRef = useRef();
  const jobRef = useRef();
  const geoRef = useRef();
  const empRef = useRef();
  const progRef = useRef();

  // -----------------------------
  // DOWNLOAD CHART
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
  // DATA
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
  // STYLES
  // -----------------------------
  const card =
    "bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition";

  const header =
    "flex justify-between items-center mb-4";

  const btn =
    "p-2 rounded-lg border border-black text-slate-700 bg-white hover:bg-slate-100 transition";

  return (
    <div className="space-y-6 p-4">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Alumni Analytics
          </h1>

          <p className="text-sm text-gray-500">
            Insights on skills, jobs, certifications & global alumni trends
          </p>
        </div>

        <button
          onClick={generateReport}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex gap-4">

        <FilterDropdown
          label="All Programmes"
          value={filters.programme}
          options={programmes}
          onChange={(val) =>
            setFilters({ ...filters, programme: val })
          }
        />

        <FilterDropdown
          label="All Years"
          value={filters.gradDate}
          options={years}
          width="w-44"
          onChange={(val) =>
            setFilters({ ...filters, gradDate: val })
          }
        />

      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SKILLS GAP */}
        <div ref={skillsRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Skills Gap</h3>
            <button onClick={() => downloadChart(skillsRef, "skills-gap")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={skillsGapData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6}/>
                <Radar dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3}/>
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CERT TREND */}
        <div ref={certRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Certification Trend ({surge}%)</h3>
            <button onClick={() => downloadChart(certRef, "cert-trend")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={certData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }}/>
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#10b981" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* JOBS */}
        <div ref={jobRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Job Trends</h3>
            <button onClick={() => downloadChart(jobRef, "jobs")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={jobData}>
                <XAxis type="number"/>
                <YAxis dataKey="jobTitle" type="category" width={140}/>
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GEO */}
        <div ref={geoRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Geography</h3>
            <button onClick={() => downloadChart(geoRef, "geo")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={geoData} dataKey="count" nameKey="city" outerRadius={80}>
                  {geoData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EMPLOYERS */}
        <div ref={empRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Employers</h3>
            <button onClick={() => downloadChart(empRef, "employers")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={empData} dataKey="count" nameKey="company" innerRadius={50} outerRadius={80}>
                  {empData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROGRAMME */}
        <div ref={progRef} className={card}>
          <div className={header}>
            <h3 className="font-bold">Programme Distribution</h3>
            <button onClick={() => downloadChart(progRef, "programme")} className={btn}>
              <Download size={16}/>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={progData}>
                <XAxis dataKey="programme"/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}