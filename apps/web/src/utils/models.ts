export const toModelLabel = (m: any) => {
  if (typeof m === "string") return m;
  if (!m || typeof m !== "object") return String(m ?? "");
  return m.label ?? m.name ?? m.id ?? m.value ?? "";
};

export const toModelKey = (m: any) => {
  if (typeof m === "string") return m;
  if (!m || typeof m !== "object") return String(m ?? "");
  return m.value ?? m.id ?? m.label ?? m.name ?? "";
};
