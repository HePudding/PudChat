import { Plus, Trash2 } from "lucide-react";
import type { Role } from "../types";

export function RoleList({
  roles,
  activeId,
  onSelect,
  onAdd,
  onDelete,
}: {
  roles: Role[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">角色</div>
        <button
          onClick={onAdd}
          className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto space-y-1 pr-1">
        {roles.map((r) => (
          <div
            key={r.id}
            className={`group flex items-center gap-2 px-2 py-2 rounded-lg border text-sm cursor-pointer ${
              r.id === activeId
                ? "bg-white/10 border-white/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            onClick={() => onSelect(r.id)}
          >
            <span className="text-lg">{r.avatar}</span>
            <span className="flex-1 truncate">{r.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(r.id);
              }}
              className="p-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-white/10"
              aria-label="删除角色"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {!roles.length && (
          <div className="text-xs text-slate-400">新建角色</div>
        )}
      </div>
    </div>
  );
}
