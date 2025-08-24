import { useRef, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Emotion, Role, RoleImage } from "../types";

const EMOTIONS: Emotion[] = [
  "默认",
  "开心",
  "伤心",
  "生气",
  "害羞",
  "惊讶",
  "疲惫",
  "认真",
];

export function RoleEditorModal({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Role;
  onSave: (r: Role) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [avatar, setAvatar] = useState(initial?.avatar || "😀");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [prompt, setPrompt] = useState(initial?.prompt || "");
  const [longMemory, setLongMemory] = useState(initial?.longMemory || false);
  const [images, setImages] = useState<RoleImage[]>(initial?.images || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const readPromptFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPrompt(String(reader.result || ""));
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur overscroll-contain overflow-y-auto">
      <div className="w-[min(700px,96vw)] max-h-[92vh] overflow-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">角色编辑</div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-16 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-center"
              placeholder="😀"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="角色名称"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={longMemory}
                onChange={(e) => setLongMemory(e.target.checked)}
                className="mr-1"
              />
              长期记忆
            </label>
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="角色简介（对用户可见）"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">系统提示词</span>
              <input
                ref={fileRef}
                type="file"
                accept=".md,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) readPromptFile(f);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10 text-xs"
              >
                导入 .md/.txt
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="系统提示词（不会在右侧面板显示）"
              className="w-full h-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm">立绘与情绪</div>
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2"
              >
                <img src={img.src} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <input
                  value={img.label}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((x) =>
                        x.id === img.id ? { ...x, label: e.target.value } : x
                      )
                    )
                  }
                  placeholder="描述"
                  className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 outline-none text-sm"
                />
                <select
                  value={img.emotion}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((x) =>
                        x.id === img.id
                          ? { ...x, emotion: e.target.value as Emotion }
                          : x
                      )
                    )
                  }
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm"
                >
                  {EMOTIONS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((x) => x.id !== img.id))
                  }
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/10"
                  aria-label="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImages((prev) => [
                      ...prev,
                      {
                        id: "img_" + Math.random().toString(36).slice(2, 8),
                        src: String(reader.result),
                        label: file.name,
                        emotion: "默认",
                      },
                    ]);
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm"
            >
              <Plus className="w-4 h-4" /> 添加立绘
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm"
          >
            取消
          </button>
          <button
            onClick={() => {
              const id = initial?.id || "role_" + Math.random().toString(36).slice(2, 8);
              onSave({
                id,
                name,
                avatar,
                summary,
                prompt,
                longMemory,
                images,
                conversations: initial?.conversations || [],
              });
            }}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 text-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
