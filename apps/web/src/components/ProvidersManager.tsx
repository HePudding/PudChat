import { useMemo, useState } from "react";
import { Cog, Trash2, X } from "lucide-react";
import { toModelLabel } from "../utils/models";
import type { Provider } from "../types";

const ADAPTERS = ["OpenAI", "Anthropic", "Gemini", "Custom"] as const;

export function ProvidersManager({
  open,
  providers,
  setProviders,
  onClose,
}: {
  open: boolean;
  providers: Provider[];
  setProviders: (updater: (prev: Provider[]) => Provider[]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(
    providers[0]?.id ?? null
  );
  const [form, setForm] = useState({
    name: "",
    adapter: ADAPTERS[0],
    baseUrl: "",
    apiKey: "",
    note: "",
  });
  const [newModel, setNewModel] = useState("");

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  const active = providers.find((p) => p.id === activeId);

  const grouped = useMemo(() => {
    const g: Record<string, string[]> = {};
    const list = active?.models ?? [];
    for (const m of list) {
      const name = toModelLabel(m);
      const key = /reasoner/i.test(name)
        ? "Reasoner"
        : /chat/i.test(name)
        ? "Chat"
        : "默认分类";
      (g[key] ||= []).push(name);
    }
    return g;
  }, [active]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur overscroll-contain overflow-y-auto">
      <div className="w-[min(1100px,96vw)] max-h-[92vh] overflow-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4 grid grid-cols-12 gap-4">
        <aside className="col-span-4 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Cog className="w-4 h-4" /> 模型服务
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索模型平台…"
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
          />
          <div className="mt-2 space-y-1 overflow-auto pr-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`w-full text-left px-2 py-2 rounded-lg border flex items-center justify-between ${
                  p.id === activeId
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-sm truncate">{p.name}</span>
                <input
                  type="checkbox"
                  checked={!!p.enabled}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((x) =>
                        x.id === p.id ? { ...x, enabled: e.target.checked } : x
                      )
                    )
                  }
                  aria-label="启用"
                />
              </button>
            ))}
            {!filtered.length && (
              <div className="text-xs text-slate-400">尚无供应商，请在下方添加。</div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-white/10 space-y-2">
            <div className="text-xs text-slate-400">新增供应商</div>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="名称，如：OpenAI"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
            <select
              value={form.adapter}
              onChange={(e) =>
                setForm({ ...form, adapter: e.target.value as any })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            >
              {ADAPTERS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              placeholder="Base URL（手动填写）"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
            <input
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder="API Key"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="备注（可选）"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
            <button
              onClick={() => {
                if (!form.name.trim()) return;
                const id = "prov_" + Math.random().toString(36).slice(2, 8);
                setProviders((prev) => [
                  { id, ...form, models: [], enabled: true },
                  ...prev,
                ]);
                setActiveId(id);
                setForm({
                  name: "",
                  adapter: ADAPTERS[0],
                  baseUrl: "",
                  apiKey: "",
                  note: "",
                });
              }}
              className="w-full px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm"
            >
              添加供应商
            </button>
          </div>
        </aside>

        <section className="col-span-8 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">
              {active?.name || "未选择"} {active ? (
                <span className="text-xs text-slate-400">· {active.adapter}</span>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {active ? (
            <div className="mt-3 space-y-3 overflow-auto">
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Base URL</div>
                <input
                  value={active.baseUrl}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((x) =>
                        x.id === active.id
                          ? { ...x, baseUrl: e.target.value }
                          : x
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
                />
                <div className="text-xs text-slate-400">API Key</div>
                <input
                  value={active.apiKey}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((x) =>
                        x.id === active.id
                          ? { ...x, apiKey: e.target.value }
                          : x
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
                />
                <div className="text-xs text-slate-400">备注</div>
                <input
                  value={active.note || ""}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((x) =>
                        x.id === active.id ? { ...x, note: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
                />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  模型（分组展示，可新增）
                </div>
                {Object.entries(grouped).map(([g, list]) => (
                  <div
                    key={g}
                    className="rounded-lg border border-white/10 bg-slate-900/50 p-2 mb-2"
                  >
                    <div className="text-sm font-medium">
                      {active.name} {g}
                    </div>
                    <div className="mt-1 space-y-1">
                      {list.map((name, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-2 py-1 rounded-md bg-white/5 border border-white/10 text-sm"
                        >
                          <span className="truncate mr-2">{name}</span>
                          <button
                            onClick={() =>
                              setProviders((prev) =>
                                prev.map((x) =>
                                  x.id === active.id
                                    ? {
                                        ...x,
                                        models: (x.models || []).filter(
                                          (m: any) => toModelLabel(m) !== name
                                        ),
                                      }
                                    : x
                                )
                              )
                            }
                            className="p-1 rounded-md border border-white/10 hover:bg-white/10"
                            title="删除此模型"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {!list.length && (
                        <div className="text-xs text-slate-400 px-2 py-1">
                          该组暂无模型
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="例如：gpt-4o 或 claude-3"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
                  />
                  <button
                    onClick={() => {
                      if (!newModel.trim()) return;
                      setProviders((prev) =>
                        prev.map((x) =>
                          x.id === active.id
                            ? { ...x, models: [...(x.models || []), newModel.trim()] }
                            : x
                        )
                      );
                      setNewModel("");
                    }}
                    className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm"
                  >
                    添加模型
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-4">
              请选择左侧一个提供商查看详情。
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
