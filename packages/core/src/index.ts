export type Role = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  abortSignal?: AbortSignal;
  stream?: boolean;
}

export interface ChatDelta {
  type: "token" | "event" | "thinking";
  value: string;
  event?: "start" | "end" | "error";
}

export interface ChatModelMeta {
  id: string;
  displayName: string;
}

export interface ProviderConfig {
  protocol: "openai" | "anthropic";
  apiKey: string;
  endpoint: string;
  model: string;
}

export interface ChatModel {
  stream(
    messages: ChatMessage[],
    options?: ChatOptions,
    config?: ProviderConfig
  ): AsyncIterable<ChatDelta>;
}
