import type { AgentTool } from "./types";

export const ALL_TOOLS: AgentTool[] = [
  { id: "browser", name: "Browser", description: "Navigate and interact with websites", enabled: true },
  { id: "file", name: "File System", description: "Read and write files", enabled: true },
  { id: "terminal", name: "Terminal", description: "Execute shell commands", enabled: false },
  { id: "search", name: "Web Search", description: "Search the web for information", enabled: true },
  { id: "image", name: "Image Generation", description: "Generate images with AI", enabled: false },
  { id: "code", name: "Code Execution", description: "Run code snippets", enabled: false },
  { id: "calendar", name: "Calendar", description: "Manage calendar events", enabled: true },
  { id: "email", name: "Email", description: "Send and receive emails", enabled: false },
  { id: "database", name: "Database", description: "Query databases", enabled: false },
  { id: "api", name: "API Calls", description: "Make API requests", enabled: true },
];

export const TOOLS_BY_DEPARTMENT: Record<string, string[]> = {
  marketing: ["browser", "search", "api", "calendar", "file"],
  seo: ["browser", "search", "api", "file", "database"],
  design: ["browser", "image", "file", "code"],
  development: ["terminal", "code", "file", "api", "database", "browser"],
  copywriting: ["browser", "search", "file", "email"],
  analytics: ["database", "api", "file", "code", "browser"],
  social: ["browser", "api", "calendar", "file", "email"],
  qa: ["browser", "terminal", "code", "file", "api"],
};

export function getToolsForDepartment(dept: string): AgentTool[] {
  const toolIds = TOOLS_BY_DEPARTMENT[dept] || ["browser", "search", "file"];
  return ALL_TOOLS.map(t => ({ ...t, enabled: toolIds.includes(t.id) }));
}
