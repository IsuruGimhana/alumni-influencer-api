import { useContext, useRef } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// convert string counts safely
const toNum = (v) => Number(v) || 0;

// reusable export
const exportChart = async (ref, name) => {
  const canvas = await html2canvas(ref.current);
  const link = document.createElement("a");
  link.download = `${name}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

export default function DashboardPage() {
  const {
    filters,
    setFilters,
    programmes,
    years,
    skillsGap,
    jobTrends,
    employers,
    geo,
    certTrends,
    programmeDist
  } = useContext(DashboardContext);

  // refs for export
  const refs = {
    skills: useRef(),
    jobs: useRef(),
    employers: useRef(),
    geo: useRef(),
    certs: useRef(),
    programmes: useRef()
  };

  return (
    <div className="space-y-8">

      {/* ---------------- FILTERS ---------------- */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4 flex-wrap">
        <select
          className="border p-2 rounded"
          value={filters.programme}
          onChange={(e) =>
            setFilters((f) => ({ ...f, programme: e.target.value }))
          }
        >
          <option value="">All Programmes</option>
          {programmes.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.gradDate}
          onChange={(e) =>
            setFilters((f) => ({ ...f, gradDate: e.target.value }))
          }
        >
          <option value="">All Years</option>
          {years.map((y, i) => (
            <option key={i} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ---------------- CHART GRID ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* 1. SKILLS GAP */}
        <ChartCard title="Skills Gap" refObj={refs.skills} onExport={() => exportChart(refs.skills, "skills-gap")}>
          <ResponsiveContainer height={250}>
            <RadarChart data={skillsGap.map(s => ({
              subject: s.title,
              value: toNum(s.count)
            }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar dataKey="value" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. JOB TRENDS */}
        <ChartCard title="Top Job Roles" refObj={refs.jobs} onExport={() => exportChart(refs.jobs, "job-trends")}>
          <ResponsiveContainer height={250}>
            <BarChart layout="vertical" data={jobTrends}>
              <XAxis type="number" />
              <YAxis dataKey="jobTitle" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. EMPLOYERS */}
        <ChartCard title="Top Employers" refObj={refs.employers} onExport={() => exportChart(refs.employers, "employers")}>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Pie
                data={employers.map(e => ({ ...e, count: toNum(e.count) }))}
                dataKey="count"
                nameKey="company"
                outerRadius={80}
                label
              >
                {employers.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. GEOGRAPHY */}
        <ChartCard title="Geographical Distribution" refObj={refs.geo} onExport={() => exportChart(refs.geo, "geo")}>
          <ResponsiveContainer height={250}>
            <BarChart data={geo}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. CERTIFICATION TRENDS */}
        <ChartCard title="Certification Trends" refObj={refs.certs} onExport={() => exportChart(refs.certs, "cert-trends")}>
          <ResponsiveContainer height={250}>
            <LineChart data={certTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. PROGRAMME DISTRIBUTION */}
        <ChartCard title="Programme Distribution" refObj={refs.programmes} onExport={() => exportChart(refs.programmes, "programme-dist")}>
          <ResponsiveContainer height={250}>
            <BarChart data={programmeDist}>
              <XAxis dataKey="programme" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ---------- REUSABLE CARD ---------- */
const ChartCard = ({ title, children, onExport, refObj }) => (
  <div className="bg-white p-5 rounded-xl shadow" ref={refObj}>
    <div className="flex justify-between mb-3">
      <h3 className="font-bold">{title}</h3>
      <button
        onClick={onExport}
        className="flex items-center gap-1 text-xs text-blue-600"
      >
        <Download size={14}/> PNG
      </button>
    </div>
    {children}
  </div>
);

// export default function DashboardPage() {
//   return (
//     <div>
//       dashboard
//     </div>
//   );
// }