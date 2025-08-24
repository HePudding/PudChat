import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Message, Role } from "../types";

export function ChatArea({
  role,
  onChange,
}: {
  role?: Role;
  onChange: (r: Role) => void;
}) {
  const [convId, setConvId] = useState<string | null>(
    role?.conversations[0]?.id || null
  );
  const [input, setInput] = useState("");
  const [warnClosed, setWarnClosed] = useState(false);

  if (!role) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        请选择或创建角色
      </div>
    );
  }

  const conv = role.conversations.find((c) => c.id === convId);

  const updateRole = (updater: (r: Role) => Role) => {
    onChange(updater(role));
  };

  const sendMessage = () => {
    if (!conv || !input.trim()) return;
    const msg: Message = {
      id: "m_" + Math.random().toString(36).slice(2, 8),
      role: "user",
      content: input.trim(),
    };
    const reply: Message = {
      id: "m_" + Math.random().toString(36).slice(2, 8),
      role: "assistant",
      content: "（未实现）",
    };
    updateRole((r) => ({
      ...r,
      conversations: r.conversations.map((c) =>
        c.id === conv.id
          ? { ...c, messages: [...c.messages, msg, reply] }
          : c
      ),
    }));
    setInput("");
  };

  const addConversation = () => {
    const id = "c_" + Math.random().toString(36).slice(2, 8);
    updateRole((r) => ({
      ...r,
      conversations: [...r.conversations, { id, title: "新会话", messages: [] }],
    }));
    setConvId(id);
  };

  const deleteConversation = (id: string) => {
    updateRole((r) => ({
      ...r,
      conversations: r.conversations.filter((c) => c.id !== id),
    }));
    if (convId === id) setConvId(role.conversations[0]?.id || null);
  };

  const deleteMessage = (id: string) => {
    if (role.longMemory || !conv) return;
    updateRole((r) => ({
      ...r,
      conversations: r.conversations.map((c) =>
        c.id === conv.id
          ? { ...c, messages: c.messages.filter((m) => m.id !== id) }
          : c
      ),
    }));
  };

  const clearAll = () => {
    if (!window.confirm("确定要清除全部记忆吗？")) return;
    updateRole((r) => ({ ...r, conversations: [] }));
    setConvId(null);
  };

  return (
    <div className="h-full flex flex-col">
      {!role.longMemory && (
        <div className="flex items-center gap-2 mb-2 overflow-x-auto">
          {role.conversations.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl border cursor-pointer text-sm ${
                c.id === convId
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setConvId(c.id)}
            >
              <span className="truncate max-w-[100px]">{c.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(c.id);
                }}
                className="p-1 rounded-md border border-white/10 hover:bg-white/10"
                aria-label="删除会话"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={addConversation}
            className="p-1 rounded-lg border border-white/10 hover:bg-white/10"
            aria-label="新增会话"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      {role.longMemory && !warnClosed && (
        <div className="mb-2 bg-yellow-200/20 text-yellow-200 border border-yellow-200/30 px-3 py-2 rounded-xl flex items-start justify-between text-xs">
          <span>长期记忆模式：会话将自动合并并上传（占位），无法撤销。</span>
          <button
            onClick={() => setWarnClosed(true)}
            className="ml-2 p-1 rounded-md hover:bg-yellow-200/20"
            aria-label="关闭提示"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto space-y-2">
        {conv?.messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && <span>🤖</span>}
            <div className="relative max-w-[70%] px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm whitespace-pre-wrap">
              {m.content}
              {!role.longMemory && (
                <button
                  onClick={() => deleteMessage(m.id)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-700 border border-white/10 hover:bg-slate-600"
                  aria-label="删除消息"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            {m.role === "user" && <span>🧑</span>}
          </div>
        ))}
      </div>
      {role.longMemory && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div>同步状态：未连接</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="px-2 py-1 rounded border border-white/10 hover:bg-white/10"
            >
              合并会话
            </button>
            <button
              onClick={clearAll}
              className="px-2 py-1 rounded border border-white/10 hover:bg-white/10"
            >
              清除全部记忆
            </button>
          </div>
        </div>
      )}
      <div className="mt-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={role ? "输入消息" : "请先选择角色"}
          disabled={!role}
          className="w-full h-24 resize-none px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
        />
        <div className="text-xs text-slate-500 mt-1">
          Enter 发送，Shift+Enter 换行
        </div>
      </div>
    </div>
  );
}
