import {
  Action,
  ActionExample,
  IAgentRuntime,
  Memory,
  State,
  elizaLogger,
  composeContext,
  generateObject,
  ModelClass,
} from "@ai16z/eliza";
import { ClaudeCodeService } from "../services/claudeCodeService";
import { ClaudeCodeTask } from "../types";
import { z } from "@ai16z/eliza";

const claudeCodeTaskSchema = z.object({
  type: z.enum(['create', 'edit', 'refactor', 'review', 'explain', 'fix', 'test']),
  description: z.string(),
  files: z.array(z.string()).optional(),
  language: z.string().optional(),
  context: z.string().optional(),
});

export const claudeCodeAction: Action = {
  name: "CLAUDE_CODE",
  description: "Use Claude Code to perform coding tasks like creating, editing, refactoring, reviewing, explaining, fixing, or testing code",
  
  examples: [
    [
      {
        user: "user",
        content: {
          text: "Create a Python script that calculates fibonacci numbers",
        },
      },
      {
        user: "assistant",
        content: {
          text: "I'll create a Python script to calculate Fibonacci numbers using Claude Code.",
          action: "CLAUDE_CODE",
        },
      },
    ],
    [
      {
        user: "user",
        content: {
          text: "Refactor this JavaScript code to use modern ES6+ features",
        },
      },
      {
        user: "assistant",
        content: {
          text: "I'll refactor your JavaScript code to use modern ES6+ features with Claude Code.",
          action: "CLAUDE_CODE",
        },
      },
    ],
  ] as ActionExample[][],

  similes: [
    "code with claude",
    "use claude code",
    "claude coding",
    "ai coding",
    "claude help code",
    "delegate to claude",
  ],

  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    const content = message.content.text.toLowerCase();
    
    // Check if the message contains coding-related keywords
    const codingKeywords = [
      "code", "script", "function", "class", "program",
      "refactor", "review", "fix", "debug", "test",
      "create", "build", "implement", "develop",
      "python", "javascript", "typescript", "java", "c++",
      "html", "css", "react", "vue", "angular",
    ];
    
    return codingKeywords.some(keyword => content.includes(keyword));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    options?: any,
    callback?: any
  ): Promise<boolean> => {
    try {
      elizaLogger.info("Claude Code action triggered");
      
      // Get or initialize the service
      let service = runtime.getService("claudeCode") as ClaudeCodeService;
      if (!service) {
        service = new ClaudeCodeService(runtime);
        await service.initialize();
        runtime.registerService("claudeCode", service);
      }

      // Parse the task from the message
      const taskTemplate = `Given the user's request, extract the coding task details.
      
User request: "${message.content.text}"

Extract:
- type: What kind of task is this? (create/edit/refactor/review/explain/fix/test)
- description: A clear description of what needs to be done
- files: Any specific files mentioned (optional)
- language: Programming language if specified (optional)
- context: Any additional context provided (optional)`;

      const context = composeContext({
        state,
        template: taskTemplate,
      });

      const taskResponse = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
        schema: claudeCodeTaskSchema,
      });

      const task: ClaudeCodeTask = taskResponse.object;

      // Execute the task
      const result = await service.executeTask(task);

      if (callback) {
        const responseText = result.success
          ? `✅ ${result.message}\n\n${result.output || "Task completed successfully."}`
          : `❌ ${result.message}\n\nError: ${result.error || "Unknown error occurred."}`;
        
        callback({
          text: responseText,
          success: result.success,
          data: result,
        });
      }

      return result.success;
    } catch (error) {
      elizaLogger.error("Error in Claude Code action:", error);
      
      if (callback) {
        callback({
          text: `Failed to execute Claude Code task: ${error.message}`,
          success: false,
          error: error.message,
        });
      }
      
      return false;
    }
  },
};
