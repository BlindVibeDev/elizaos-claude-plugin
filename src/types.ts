import { Memory, IAgentRuntime, State } from "@ai16z/eliza";

export interface ClaudeCodeConfig {
  apiKey: string;
  workspace?: string;
  model?: string;
  maxTokens?: number;
}

export interface ClaudeCodeTask {
  type: 'create' | 'edit' | 'refactor' | 'review' | 'explain' | 'fix' | 'test';
  description: string;
  files?: string[];
  language?: string;
  context?: string;
}

export interface ClaudeCodeResult {
  success: boolean;
  message: string;
  files?: Array<{
    path: string;
    content: string;
    action: 'created' | 'modified' | 'deleted';
  }>;
  output?: string;
  error?: string;
}

export interface ClaudeCodeContext {
  workspace: string;
  currentDirectory: string;
  recentFiles: string[];
  sessionId: string;
}

export interface ClaudeCodeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  tasks: ClaudeCodeTask[];
  results: ClaudeCodeResult[];
  context: ClaudeCodeContext;
}
