import { Service, IAgentRuntime, elizaLogger } from "@ai16z/eliza";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import * as fs from "fs-extra";
import * as path from "path";
import * as tmp from "tmp";
import which from "which";
import { 
  ClaudeCodeConfig, 
  ClaudeCodeTask, 
  ClaudeCodeResult,
  ClaudeCodeSession,
  ClaudeCodeContext 
} from "../types";
import { validateClaudeCodeConfig } from "../environment";

const execAsync = promisify(exec);

export class ClaudeCodeService implements Service {
  private config: ClaudeCodeConfig;
  private sessions: Map<string, ClaudeCodeSession> = new Map();
  private isInstalled: boolean = false;

  constructor(private runtime: IAgentRuntime) {}

  async initialize(): Promise<void> {
    try {
      const envConfig = await validateClaudeCodeConfig(this.runtime);
      this.config = {
        apiKey: envConfig.ANTHROPIC_API_KEY,
        workspace: envConfig.CLAUDE_CODE_WORKSPACE,
        model: envConfig.CLAUDE_CODE_MODEL,
        maxTokens: envConfig.CLAUDE_CODE_MAX_TOKENS,
      };

      // Check if Claude Code is installed
      this.isInstalled = await this.checkClaudeCodeInstallation();
      
      if (!this.isInstalled) {
        elizaLogger.warn("Claude Code CLI is not installed. Some features may be limited.");
      } else {
        elizaLogger.info("Claude Code service initialized successfully");
      }
    } catch (error) {
      elizaLogger.error("Failed to initialize Claude Code service:", error);
      throw error;
    }
  }

  private async checkClaudeCodeInstallation(): Promise<boolean> {
    try {
      const claudeCodePath = await which("claude-code");
      return !!claudeCodePath;
    } catch (error) {
      return false;
    }
  }

  async executeTask(task: ClaudeCodeTask): Promise<ClaudeCodeResult> {
    if (!this.isInstalled) {
      return await this.executeTaskViaAPI(task);
    }

    try {
      const sessionId = this.createSession(task);
      const result = await this.runClaudeCode(task);
      this.updateSession(sessionId, result);
      return result;
    } catch (error) {
      elizaLogger.error("Error executing Claude Code task:", error);
      return {
        success: false,
        message: "Failed to execute task",
        error: error.message,
      };
    }
  }

  private async executeTaskViaAPI(task: ClaudeCodeTask): Promise<ClaudeCodeResult> {
    // Fallback implementation using Anthropic API directly
    try {
      const prompt = this.buildPrompt(task);
      const response = await this.callAnthropicAPI(prompt);
      
      return {
        success: true,
        message: "Task completed using API",
        output: response,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to execute task via API",
        error: error.message,
      };
    }
  }

  private async runClaudeCode(task: ClaudeCodeTask): Promise<ClaudeCodeResult> {
    const tempDir = tmp.dirSync({ unsafeCleanup: true });
    const taskFile = path.join(tempDir.name, "task.md");
    
    // Write task description to file
    await fs.writeFile(taskFile, this.formatTaskDescription(task));
    
    const args = [
      "--task", taskFile,
      "--workspace", this.config.workspace || process.cwd(),
      "--model", this.config.model,
      "--max-tokens", this.config.maxTokens.toString(),
    ];

    if (task.files && task.files.length > 0) {
      args.push("--files", ...task.files);
    }

    return new Promise((resolve) => {
      const process = spawn("claude-code", args, {
        env: { ...process.env, ANTHROPIC_API_KEY: this.config.apiKey },
      });

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        tempDir.removeCallback();
        
        if (code === 0) {
          resolve({
            success: true,
            message: "Task completed successfully",
            output: stdout,
          });
        } else {
          resolve({
            success: false,
            message: "Task failed",
            error: stderr || stdout,
          });
        }
      });
    });
  }

  private buildPrompt(task: ClaudeCodeTask): string {
    let prompt = `Task: ${task.type}\n`;
    prompt += `Description: ${task.description}\n`;
    
    if (task.language) {
      prompt += `Language: ${task.language}\n`;
    }
    
    if (task.context) {
      prompt += `Context: ${task.context}\n`;
    }
    
    return prompt;
  }

  private async callAnthropicAPI(prompt: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private formatTaskDescription(task: ClaudeCodeTask): string {
    let description = `# Claude Code Task\n\n`;
    description += `**Type:** ${task.type}\n\n`;
    description += `**Description:** ${task.description}\n\n`;
    
    if (task.language) {
      description += `**Language:** ${task.language}\n\n`;
    }
    
    if (task.context) {
      description += `**Context:**\n${task.context}\n\n`;
    }
    
    if (task.files && task.files.length > 0) {
      description += `**Files:**\n${task.files.map(f => `- ${f}`).join('\n')}\n\n`;
    }
    
    return description;
  }

  private createSession(task: ClaudeCodeTask): string {
    const sessionId = Date.now().toString();
    const session: ClaudeCodeSession = {
      id: sessionId,
      startTime: new Date(),
      tasks: [task],
      results: [],
      context: {
        workspace: this.config.workspace || process.cwd(),
        currentDirectory: process.cwd(),
        recentFiles: task.files || [],
        sessionId,
      },
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  private updateSession(sessionId: string, result: ClaudeCodeResult): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.results.push(result);
      session.endTime = new Date();
    }
  }

  getSession(sessionId: string): ClaudeCodeSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ClaudeCodeSession[] {
    return Array.from(this.sessions.values());
  }

  clearSessions(): void {
    this.sessions.clear();
  }
}
