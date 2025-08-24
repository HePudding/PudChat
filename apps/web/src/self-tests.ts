import { toModelKey, toModelLabel } from "./utils/models";

(function runSelfTests() {
  try {
    const sample = {
      models: [
        "DeepSeek Chat",
        { id: "reasoner", label: "DeepSeek Reasoner" },
        "foo-model",
      ],
    };
    const g: Record<string, string[]> = {};
    (sample.models || []).forEach((m: any) => {
      const name = toModelLabel(m);
      const key = /reasoner/i.test(name)
        ? "Reasoner"
        : /chat/i.test(name)
        ? "Chat"
        : "默认分类";
      (g[key] ||= []).push(name);
    });
    console.assert(
      g.Chat?.length === 1 &&
        g.Reasoner?.length === 1 &&
        g["默认分类"]?.length === 1,
      "[TEST] grouping failed",
      g
    );

    const input = [{ id: "m2", label: "Model 2" }, "m1"];
    const normalized = input.map((o) => ({
      value: (o as any).value ?? toModelKey(o),
      label: (o as any).label ?? toModelLabel(o),
    }));
    console.assert(
      normalized.every((o) => o.value && o.label),
      "[TEST] normalization failed",
      normalized
    );

    const u1 = "t" + Math.random().toString(36).slice(2, 8);
    const u2 = "t" + Math.random().toString(36).slice(2, 8);
    console.assert(u1 !== u2, "[TEST] uid not unique", u1, u2);

    const canDelete = (longMem: boolean) => !longMem;
    console.assert(canDelete(false) && !canDelete(true), "[TEST] rule failed");

    const enabled = ([] as any[])
      .filter((p) => (p as any).enabled)
      .flatMap((p) => (p as any).models || []);
    console.assert(enabled.length === 0, "[TEST] default providers not empty");

    console.log("✅ Self-tests passed");
  } catch (e) {
    console.error("❌ Self-tests failed", e);
  }
})();
