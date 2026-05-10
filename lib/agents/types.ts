export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentPersonality {
  tone: string;
  style: string;
  expertise: string[];
  quirks: string[];
}

export interface AgentConfig {
  name: string;
  title: string;
  role: string;
  department: string;
  description: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  skills: string[];
  tools: string[];
  element: string;
  rarity: string;
  personality?: Partial<AgentPersonality>;
}
