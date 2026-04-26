import { useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";

export default function DynamicSection({
  title,
  subtitle,
  emptyMessage,
  fields,
  data,
  onAdd,
  onUpdate,
  onDelete
}) {
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onAdd(form);
    }

    setForm({});
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {data?.length > 0 && (
          <button
            onClick={() => {
              setShowForm(true);
              setForm({});
              setEditingId(null);
            }}
            className="text-gray-600 hover:text-black"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* EMPTY STATE (LinkedIn style) */}
      {(!data || data.length === 0) && !showForm && (
        <div className="border border-dashed border-gray-300 rounded-lg p-5 bg-gray-50">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {emptyMessage}
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-blue-600 font-medium"
          >
            Add {title}
          </button>
        </div>
      )}

      {/* LIST */}
      {data?.length > 0 && (
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start border-b pb-3"
            >
              <div>
                {fields.map((f, i) => (
                  <p
                    key={f.name}
                    className={i === 0 ? "font-semibold" : "text-sm text-gray-600"}
                  >
                    {item[f.name]}
                  </p>
                ))}
              </div>

              <div className="flex gap-2 text-gray-500">
                <button onClick={() => startEdit(item)}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(item.id)}>
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3 border-t pt-4">

          {fields.map((f) => (
            <input
              key={f.name}
              type={f.type || "text"}
              placeholder={f.label}
              value={form[f.name] || ""}
              onChange={(e) =>
                setForm({ ...form, [f.name]: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
          ))}

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingId ? "Save" : "Add"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}