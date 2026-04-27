import { useState } from "react";
import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import ProfileFormModal from "../ProfileFormModal";
import DegreeForm from "./DegreeForm";
import { useProfile } from "../../../hooks/useProfile";

export default function DegreeCard() {
  const { profile, addDegree, updateDegree, deleteDegree } = useProfile();

  const degrees = profile?.Degrees || [];

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const visibleDegrees = expanded ? degrees : degrees.slice(0, 2);
  const hasMore = degrees.length > 2;
  const isEmpty = degrees.length === 0;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // ---------------- ADD ----------------
  const handleAdd = () => {
    setEditId(null);
    setError([]);
    setOpen(true);
  };

  // ---------------- EDIT ----------------
  const handleEdit = (deg) => {
    setEditId(deg.id);
    setError([]);
    setOpen(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      await deleteDegree(id);
    } catch (err) {
      setError(
        err?.response?.data?.errors || [
          { msg: err?.response?.data?.msg || "Delete failed" },
        ]
      );
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (data) => {
    setLoading(true);
    setError([]);

    try {
      if (editId) {
        await updateDegree(editId, data);
      } else {
        await addDegree(data);
      }

      setOpen(false);
      setEditId(null);
    } catch (err) {
      setError(
        err?.response?.data?.errors || [
          { msg: err?.response?.data?.msg || "Something went wrong" },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const currentEditData = editId
    ? degrees.find((d) => d.id === editId)
    : null;

  return (
    <>
      <div
        className={`rounded-xl border p-6 shadow-sm ${
          isEmpty ? "bg-gray-50 border-dashed" : "bg-white border-gray-200"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Degrees</h2>

          {!isEmpty && (
            <button
              onClick={handleAdd}
              className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition"
            >
              +
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {isEmpty ? (
          <>
            <div className="flex gap-4 group p-3 rounded-lg opacity-50">
              <div className="w-12 h-12 flex-shrink-0 rounded flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Degree title</h4>
                <p className="text-sm text-gray-700">Institution</p>
                <p className="text-xs text-gray-500 mt-1">
                  2023 - Present
                </p>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-1 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 hover:ring-1 hover:ring-blue-800 transition"
            >
              + Add degree
            </button>
          </>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-6">
              {visibleDegrees.map((deg, i) => (
                <div key={deg.id}>
                  <div className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition">
                    
                    {/* ICON */}
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {deg.title}
                          </h4>

                          <p className="text-sm text-gray-700">
                            {deg.institution}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(deg.completionDate)}
                          </p>

                          {deg.officialUrl && (
                            <p className="text-sm text-gray-600 mt-2">
                              <a
                                href={deg.officialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View official page
                              </a>
                            </p>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(deg)}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(deg.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  {i !== visibleDegrees.length - 1 && (
                    <div className="border-t border-gray-100 mt-4" />
                  )}
                </div>
              ))}
            </div>

            {/* SHOW MORE */}
            {hasMore && (
              <div className="mt-6 text-center border-t border-gray-100 pt-4">
                <button
                  onClick={toggleExpanded}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {expanded ? "Show less ↑" : `Show all (${degrees.length}) →`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      <ProfileFormModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Degree" : "Add Degree"}
      >
        <DegreeForm
          initialData={currentEditData}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </ProfileFormModal>
    </>
  );
}