import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function FilterDropdown({ label, value, options, onChange, width = "w-full" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${width}`}>
      
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-sm shadow-sm hover:border-slate-400 transition"
      >
        <span className={value ? "text-slate-700" : "text-slate-400"}>
          {value || label}
        </span>

        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-white shadow-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="max-h-60 overflow-y-auto py-1">

            <div
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              All
            </div>

            {options.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {opt}
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}