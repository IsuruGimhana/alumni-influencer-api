import { useState } from "react";
import { BadgeCheck, Pencil } from "lucide-react";

export default function LicenseCard() {
  const [licenses] = useState([
    {
      title: "Professional Software Engineer License",
      awardingBody: "IEEE",
      completionDate: "2023-03-01",
      licenseUrl: "https://ieee.org/license",
    },
    {
      title: "Cloud Practitioner License",
      awardingBody: "Amazon Web Services",
      completionDate: "2022-07-01",
      licenseUrl: "https://aws.amazon.com",
    },
    {
      title: "Data Engineering License",
      awardingBody: "Google Cloud",
      completionDate: "2021-10-01",
      licenseUrl: "https://cloud.google.com",
    },
  ]);

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const visibleLicenses = licenses.slice(0, 2);
  const hasMore = licenses.length > 2;
  const isEmpty = licenses.length === 0;

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${
        isEmpty ? "bg-gray-50 border-dashed" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Licenses</h2>

        {!isEmpty && (
          <button className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition">
            +
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {isEmpty ? (
        <>
          <div className="flex gap-4 p-3 rounded-lg opacity-50">
            {/* ICON */}
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-gray-400" />
            </div>

            {/* CONTENT */}
            <div>
              <h4 className="font-bold text-gray-900">
                License title
              </h4>
              <p className="text-sm text-gray-700">
                Issuing organization
              </p>
              <p className="text-xs text-gray-500 mt-1">
                2023 - Present
              </p>
            </div>
          </div>

          <button className="mt-4 px-4 py-1 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:ring-1 hover:ring-blue-800 transition">
            + Add license
          </button>
        </>
      ) : (
        <>
          {/* LIST */}
          <div className="space-y-6">
            {visibleLicenses.map((lic, i) => (
              <div key={i}>
                <div className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition">
                  {/* ICON */}
                  <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {lic.title}
                        </h4>

                        <p className="text-sm text-gray-700">
                          {lic.awardingBody}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Issued: {formatDate(lic.completionDate)}
                        </p>

                        {lic.licenseUrl && (
                          <a
                            href={lic.licenseUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View license
                          </a>
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
                {i !== visibleLicenses.length - 1 && (
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