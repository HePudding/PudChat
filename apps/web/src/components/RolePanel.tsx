import type { Role } from "../types";

export function RolePanel({ role }: { role?: Role }) {
  if (!role) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        未选择角色
      </div>
    );
  }
  return (
    <div className="h-full overflow-auto p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{role.avatar}</span>
        <div className="text-lg font-medium">{role.name}</div>
      </div>
      <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
        {role.summary || "暂无简介"}
      </div>
    </div>
  );
}
