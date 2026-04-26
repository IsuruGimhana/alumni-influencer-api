import { useState } from "react";
import { Briefcase, Pencil } from "lucide-react";

export default function ExperienceCard() {
  const [workExp] = useState([
    {
      jobTitle: "Lead Developer",
      company: "Tech Global Solutions",
      startDate: "2021-01-01",
      endDate: null,
      description:
        "Leading frontend architecture and mentoring junior developers.",
    },
    {
      jobTitle: "Junior Developer",
      company: "Innova Soft",
      startDate: "2018-06-01",
      endDate: "2020-12-31",
      description: "Worked on backend APIs and UI development.",
    },
    {
      jobTitle: "Intern Developer",
      company: "Code Labs",
      startDate: "2017-01-01",
      endDate: "2017-06-30",
      description: "Assisted in frontend development and bug fixes.",
    },
  ]);

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const visibleExp = workExp.slice(0, 2);
  const hasMore = workExp.length > 2;
  const isEmpty = workExp.length === 0;

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${
        isEmpty ? "bg-gray-50 border-dashed" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Experience</h2>

        {!isEmpty && (
        <button className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition">
          +
        </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {isEmpty ? (
        <>
          <div className="flex gap-4 group p-3 rounded-lg opacity-50">
            {/* ICON */}
            <div className="w-12 h-12 flex-shrink-0 rounded flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-400" />
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">
                    Job title
                  </h4>

                  <p className="text-sm text-gray-700">
                    Organization
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    2023 - Present
                  </p>
                </div>

              </div>
            </div>
          </div>
          <button className="mt-4 px-4 py-1 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:ring-1 hover:ring-blue-800 transition">
            + Add experience
          </button>
        </>
      ) : (
        <>
          {/* LIST */}
          <div className="space-y-6">
            {visibleExp.map((work, i) => (
              <div key={i}>
                <div className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition">
                  {/* ICON */}
                  <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {work.jobTitle}
                        </h4>

                        <p className="text-sm text-gray-700">
                          {work.company}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(work.startDate)} -{" "}
                          {formatDate(work.endDate)}
                        </p>

                        {work.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {work.description}
                          </p>
                        )}
                      </div>

                      {/* EDIT ICON */}
                      <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition">
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}
                {i !== visibleExp.length - 1 && (
                  <div className="border-t border-gray-100 mt-4" />
                )}
              </div>
            ))}
          </div>

          {/* SHOW MORE */}
          {hasMore && (
            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <button className="text-blue-600 font-semibold hover:underline">
                Show all →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}