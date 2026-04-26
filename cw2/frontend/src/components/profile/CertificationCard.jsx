import { useState } from "react";
import { Award, Pencil } from "lucide-react";

export default function CertificationCard() {
  const [certifications] = useState([
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      completionDate: "2023-08-01",
      certificationUrl: "https://aws.amazon.com/certification",
    },
    {
      title: "Google Cloud Associate Engineer",
      issuer: "Google Cloud",
      completionDate: "2022-05-01",
      certificationUrl: "https://cloud.google.com/certification",
    },
    {
      title: "React Developer Certification",
      issuer: "Meta",
      completionDate: "2021-11-01",
      certificationUrl: "https://meta.com/cert",
    },
  ]);

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const visibleCerts = certifications.slice(0, 2);
  const hasMore = certifications.length > 2;
  const isEmpty = certifications.length === 0;

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${
        isEmpty ? "bg-gray-50 border-dashed" : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Certifications</h2>

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
              <Award className="w-6 h-6 text-gray-400" />
            </div>

            {/* CONTENT */}
            <div>
              <h4 className="font-bold text-gray-900">
                Certification title
              </h4>
              <p className="text-sm text-gray-700">Issuing organization</p>
              <p className="text-xs text-gray-500 mt-1">
                2023 - Present
              </p>
            </div>
          </div>

          <button className="mt-4 px-4 py-1 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:ring-1 hover:ring-blue-800 transition">
            + Add certification
          </button>
        </>
      ) : (
        <>
          {/* LIST */}
          <div className="space-y-6">
            {visibleCerts.map((cert, i) => (
              <div key={i}>
                <div className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition">
                  {/* ICON */}
                  <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded flex items-center justify-center">
                    <Award className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {cert.title}
                        </h4>

                        <p className="text-sm text-gray-700">
                          {cert.issuer}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {formatDate(cert.completionDate)}
                        </p>

                        {cert.certificationUrl && (
                          <a
                            href={cert.certificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View certificate
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
                {i !== visibleCerts.length - 1 && (
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