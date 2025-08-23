import {
  ChatMessage,
  ChatDelta,
  ChatOptions,
  ProviderConfig,
  ChatModel,
} from "@pudchat/core";

export async function* parseSSE(
  readable: ReadableStream<Uint8Array>
): AsyncGenerator<string> {
  const reader = readable.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("data:")) {
          yield trimmed.slice(5).trim();
        }
      }
    }
    if (buffer) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith("data:")) {
        const data = trimmed.slice(5).trim();
        if (data) yield data;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function buildUrl(endpoint: string, path: string): string {
  return `${endpoint.replace(/\/?$/, "")}${path}`;
}

export function createChatModel(config: ProviderConfig): ChatModel {
  return {
    async *stream(
      messages: ChatMessage[],
      options: ChatOptions = {}
    ): AsyncIterable<ChatDelta> {
      const { protocol, apiKey, endpoint, model } = config;

      const baseMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const stream = options.stream !== false;
      const body: Record<string, any> = {
        model,
        stream,
      };
      if (options.temperature !== undefined)
        body.temperature = options.temperature;
      if (options.maxTokens !== undefined)
        body.max_tokens = options.maxTokens;

      let url = "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (protocol === "openai") {
        url = buildUrl(endpoint, "/v1/chat/completions");
        headers["Authorization"] = `Bearer ${apiKey}`;
        body.messages = baseMessages;
      } else {
        url = buildUrl(endpoint, "/v1/messages");
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        const sysParts: string[] = [];
        const convo = [] as { role: string; content: string }[];
        for (const m of messages) {
          if (m.role === "system") {
            sysParts.push(m.content);
          } else {
            convo.push({ role: m.role, content: m.content });
          }
        }
        if (sysParts.length) body.system = sysParts.join("\n");
        body.messages = convo;
      }

      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: options.abortSignal,
        });
      } catch (err: any) {
        yield { type: "event", value: err.message, event: "error" };
        return;
      }

      if (!response.ok || !response.body) {
        yield {
          type: "event",
          value: `HTTP ${response.status}`,
          event: "error",
        };
        return;
      }

      yield { type: "event", value: "", event: "start" };

      try {
        if (!stream) {
          const json = await response.json();
          if (protocol === "openai") {
            const msg = json.choices?.[0]?.message;
            const content = msg?.content;
            if (content) yield { type: "token", value: content };
            const reasoning = msg?.reasoning;
            if (reasoning) yield { type: "thinking", value: reasoning };
          } else {
            const content = json.content as any[] | undefined;
            if (Array.isArray(content)) {
              for (const block of content) {
                if (block.type === "text" && block.text)
                  yield { type: "token", value: block.text };
                if (block.type === "thinking" && block.text)
                  yield { type: "thinking", value: block.text };
              }
            }
          }
          yield { type: "event", value: "", event: "end" };
        } else {
          for await (const chunk of parseSSE(response.body)) {
            if (!chunk || chunk === "[DONE]") continue;
            if (protocol === "openai") {
              const json = JSON.parse(chunk);
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                yield { type: "token", value: token };
              }
              const reasoning = json.choices?.[0]?.delta?.reasoning;
              if (reasoning) yield { type: "thinking", value: reasoning };
            } else {
              const json = JSON.parse(chunk);
              if (json.type === "content_block_delta") {
                const token = json.delta?.text;
                if (token) yield { type: "token", value: token };
                const thinking = json.delta?.thinking;
                if (thinking) yield { type: "thinking", value: thinking };
              } else if (json.type === "message_delta") {
                const token = json.delta?.text;
                if (token) yield { type: "token", value: token };
                const thinking = json.delta?.thinking;
                if (thinking) yield { type: "thinking", value: thinking };
              } else if (json.type === "message_stop") {
                break;
              }
            }
          }
          yield { type: "event", value: "", event: "end" };
        }
      } catch (err: any) {
        yield { type: "event", value: err.message, event: "error" };
      }
    },
  };
}

export type { ChatMessage, ChatDelta } from "@pudchat/core";
