import {
  Provider,
  IAgentRuntime,
  Memory,
  State,
  elizaLogger,
} from "@ai16z/eliza";
import { ClaudeCodeService } from "../services/claudeCodeService";

export const claudeCodeProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    try {
      const service = runtime.getService("claudeCode") as ClaudeCodeService;
      if (!service) {
        return "";
      }

      const sessions = service.getAllSessions();
      if (sessions.length === 0) {
        return "";
      }

      // Get recent sessions
      const recentSessions = sessions
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .slice(0, 3);

      let context = "Recent Claude Code Sessions:\n\n";
      
      for (const session of recentSessions) {
        context += `Session ${session.id} (${session.startTime.toLocaleString()}):\n`;
        
        for (let i = 0; i < session.tasks.length; i++) {
          const task = session.tasks[i];
          const result = session.results[i];
          
          context += `  Task: ${task.type} - ${task.description}\n`;
          if (result) {
            context += `  Result: ${result.success ? "Success" : "Failed"} - ${result.message}\n`;
          }
        }
        
        context += "\n";
      }

      return context.trim();
    } catch (error) {
      elizaLogger.error("Error in Claude Code provider:", error);
      return "";
    }
  },
};
