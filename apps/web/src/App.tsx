import { useEffect, useMemo, useState } from "react";
import { ModelDropdown } from "./components/ModelDropdown";
import { ProvidersManager } from "./components/ProvidersManager";
import { RoleEditorModal } from "./components/RoleEditorModal";
import { RoleList } from "./components/RoleList";
import { ChatArea } from "./components/ChatArea";
import { RolePanel } from "./components/RolePanel";
import { useLocalStorage } from "./utils/storage";
import { toModelKey, toModelLabel } from "./utils/models";
import type { Provider, Role } from "./types";
import { Cog } from "lucide-react";

export default function App() {
  const [roles, setRoles] = useLocalStorage<Role[]>("pudchat.roles.v3", []);
  const [providers, setProviders] = useLocalStorage<Provider[]>(
    "pudchat.providers",
    []
  );
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [showProviders, setShowProviders] = useState(false);
  const [editing, setEditing] = useState<Role | undefined>();

  const activeRole = roles.find((r) => r.id === activeRoleId);

  const modelOptions = useMemo(() => {
    return providers
      .filter((p) => p.enabled)
      .flatMap((p) =>
        (p.models || []).map((m) => ({
          value: `${p.id}:${toModelKey(m)}`,
          label: `${p.name} · ${toModelLabel(m)}`,
        }))
      );
  }, [providers]);

  useEffect(() => {
    const body = document.body.style.overflow;
    const html = document.documentElement.style.overflow;
    const lock = showProviders || !!editing;
    if (lock) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = body;
      document.documentElement.style.overflow = html;
    };
  }, [showProviders, editing]);

  const upsertRole = (r: Role) => {
    setRoles((prev) => {
      const idx = prev.findIndex((x) => x.id === r.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = r;
        return next;
      }
      return [...prev, r];
    });
    setEditing(undefined);
    setActiveRoleId(r.id);
  };

  const deleteRole = (id: string) => {
    if (!window.confirm("确认删除此角色？")) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    if (activeRoleId === id) setActiveRoleId(null);
  };

  const modelValue = modelOptions.find((o) => o.value === model)?.value || "";

  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/80 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <ModelDropdown
            value={modelValue}
            onChange={setModel}
            options={modelOptions}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProviders(true)}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
              aria-label="模型服务"
            >
              <Cog className="w-4 h-4" />
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
            >
              账户
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <RoleList
            roles={roles}
            activeId={activeRoleId}
            onSelect={setActiveRoleId}
            onAdd={() => setEditing({
              id: "",
              name: "",
              avatar: "😀",
              summary: "",
              prompt: "",
              longMemory: false,
              images: [],
              conversations: [],
            })}
            onDelete={deleteRole}
          />
        </aside>
        <section className="col-span-6 rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col">
          <ChatArea
            role={activeRole}
            onChange={(r) => {
              setRoles((prev) => prev.map((x) => (x.id === r.id ? r : x)));
            }}
          />
        </section>
        <aside className="col-span-3 rounded-2xl border border-white/10 bg-white/5">
          <RolePanel role={activeRole} />
        </aside>
      </main>

      <ProvidersManager
        open={showProviders}
        providers={providers}
        setProviders={(fn) => setProviders(fn)}
        onClose={() => setShowProviders(false)}
      />
      <RoleEditorModal
        open={!!editing}
        initial={editing}
        onSave={upsertRole}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
}
