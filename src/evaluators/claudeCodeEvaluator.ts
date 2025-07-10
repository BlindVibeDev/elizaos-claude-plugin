import {
  Evaluator,
  IAgentRuntime,
  Memory,
  State,
  elizaLogger,
} from "@ai16z/eliza";

export const claudeCodeEvaluator: Evaluator = {
  name: "claudeCodeTaskRelevance",
  
  description: "Evaluates if a message is relevant for Claude Code assistance",
  
  similes: ["code relevance", "coding task detector"],
  
  examples: [
    {
      context: "User asks about creating a new function",
      messages: [
        {
          user: "user",
          content: { text: "Can you help me write a function to sort an array?" },
        },
      ],
      expectedOutcome: true,
    },
    {
      context: "User asks about the weather",
      messages: [
        {
          user: "user",
          content: { text: "What's the weather like today?" },
        },
      ],
      expectedOutcome: false,
    },
  ],
  
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    return true; // Always valid to check
  },
  
  handler: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<number> => {
    try {
      const content = message.content.text.toLowerCase();
      
      // Keywords that strongly indicate a coding task
      const strongIndicators = [
        "write code", "create function", "implement", "refactor",
        "debug", "fix bug", "review code", "test code",
        "optimize", "class", "method", "algorithm",
      ];
      
      // Programming language mentions
      const languages = [
        "python", "javascript", "typescript", "java", "c++",
        "rust", "go", "ruby", "php", "swift", "kotlin",
      ];
      
      // Check for strong indicators
      const hasStrongIndicator = strongIndicators.some(indicator => 
        content.includes(indicator)
      );
      
      // Check for language mentions
      const hasLanguageMention = languages.some(lang => 
        content.includes(lang)
      );
      
      // Score based on indicators
      if (hasStrongIndicator && hasLanguageMention) {
        return 0.95;
      } else if (hasStrongIndicator) {
        return 0.8;
      } else if (hasLanguageMention) {
        return 0.6;
      } else if (content.includes("code") || content.includes("function")) {
        return 0.4;
      }
      
      return 0.1;
    } catch (error) {
      elizaLogger.error("Error in Claude Code evaluator:", error);
      return 0;
    }
  },
};
