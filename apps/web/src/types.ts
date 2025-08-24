export type Emotion =
  | "默认"
  | "开心"
  | "伤心"
  | "生气"
  | "害羞"
  | "惊讶"
  | "疲惫"
  | "认真";

export interface RoleImage {
  id: string;
  src: string;
  label: string;
  emotion: Emotion;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface Role {
  id: string;
  name: string;
  avatar: string;
  summary: string;
  prompt: string;
  longMemory: boolean;
  images: RoleImage[];
  conversations: Conversation[];
}

export type Adapter = "OpenAI" | "Anthropic" | "Gemini" | "Custom";
export type ModelEntry = string | { id?: string; label?: string; value?: string; name?: string };

export interface Provider {
  id: string;
  name: string;
  adapter: Adapter;
  baseUrl: string;
  apiKey: string;
  note?: string;
  enabled: boolean;
  models: ModelEntry[];
}
