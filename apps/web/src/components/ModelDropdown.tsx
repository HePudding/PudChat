import { useMemo, useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import { toModelKey, toModelLabel } from "../utils/models";

export function ModelDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: any[];
}) {
  const [open, setOpen] = useState(false);
  const safe = useMemo(
    () =>
      (Array.isArray(options) ? options : [])
        .filter(Boolean)
        .map((o: any) => ({
          value: o?.value ?? toModelKey(o),
          label: o?.label ?? toModelLabel(o),
        })),
    [options]
  );
  const current = safe.find((o) => o.value === value) ?? safe[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FolderOpen className="w-4 h-4" />
        <span className="truncate max-w-[180px]">
          {current?.label || "选择模型"}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute mt-2 w-72 z-20 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur p-1 shadow-2xl max-h-72 overflow-auto"
        >
          {safe.map((o) => (
            <button
              key={o.value}
              role="option"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                o.value === value ? "bg-white/10 text-cyan-200" : "hover:bg-white/5"
              }`}
            >
              {o.label}
            </button>
          ))}
          {!safe.length && (
            <div className="px-3 py-2 text-xs text-slate-400">
              暂无可用模型，请先添加供应商与模型
            </div>
          )}
        </div>
      )}
    </div>
  );
}
