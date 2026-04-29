import { useContext } from "react";
import { Users, Download, ChevronDown } from "lucide-react";
import { DashboardContext } from "../../context/DashboardContext";
import { FilterDropdown } from "../../components/common/FilterDropdown";

export default function AlumniDirectoryPage() {
  const {
    alumni,
    loadingDirectory,
    programmes,
    years,
    filters,
    setFilters,
    exportCSV,
  } = useContext(DashboardContext);

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-12">
      <div className="max-w-6xl mx-auto pt-6 px-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-blue-600" />
              Alumni Directory
            </h1>
            <p className="text-sm text-gray-500">
              Search and connect with alumni
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* FILTERS */}
        {/* <div className="bg-white p-4 rounded-xl border flex gap-4 shadow-sm">

          <select
            className="border p-2 rounded-md flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.programme}
            onChange={(e) =>
              setFilters({ ...filters, programme: e.target.value })
            }
          >
            <option value="">All Programmes</option>
            {programmes.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded-md w-40 focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.gradDate}
            onChange={(e) =>
              setFilters({ ...filters, gradDate: e.target.value })
            }
          >
            <option value="">All Years</option>
            {years.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>

        </div> */}
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

        {/* TABLE WRAPPER (card like profile sections) */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

          <table className="w-full text-left">

            {/* HEADER */}
            <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Alumni</th>
                <th className="p-4">Programme</th>
                <th className="p-4">Year</th>
                <th className="p-4">Role</th>
                <th className="p-4">Company</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">

              {loadingDirectory ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan="5">
                    Loading alumni...
                  </td>
                </tr>
              ) : alumni.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-400" colSpan="5">
                    No alumni found
                  </td>
                </tr>
              ) : (
                alumni.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-blue-50/30 transition"
                  >

                    {/* NAME COLUMN (profile-like cell) */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={a.profileImage}
                          className="w-10 h-10 rounded-full object-cover border"
                        />

                        <div>
                          <div className="font-semibold text-gray-900">
                            {a.fullName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {a.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {a.location}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* PROGRAMME */}
                    <td className="p-4 text-sm text-gray-700">
                      {a.programme}
                    </td>

                    {/* YEAR */}
                    <td className="p-4 text-sm text-gray-700">
                      {a.graduationYear}
                    </td>

                    {/* ROLE (badge style like profile page) */}
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {a.currentRole}
                      </span>
                    </td>

                    {/* COMPANY */}
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 text-xs rounded-full bg-green-50 text-green-700">
                        {a.company}
                      </span>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};