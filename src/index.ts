import { Plugin, IAgentRuntime } from "@ai16z/eliza";
import { claudeCodeAction } from "./actions/claudeCode";
import { claudeCodeProvider } from "./providers/claudeCodeProvider";
import { claudeCodeEvaluator } from "./evaluators/claudeCodeEvaluator";
import { ClaudeCodeService } from "./services/claudeCodeService";

export * from "./types";
export * from "./environment";
export { ClaudeCodeService };

const claudeCodePlugin: Plugin = {
  name: "claude-code",
  description: "ElizaOS plugin for integrating Claude Code - AI-powered coding assistant",
  
  actions: [claudeCodeAction],
  providers: [claudeCodeProvider],
  evaluators: [claudeCodeEvaluator],
  services: [],
  
  // Initialize the plugin
  init: async (config: Record<string, any>, runtime: IAgentRuntime) => {
    const service = new ClaudeCodeService(runtime);
    await service.initialize();
    runtime.registerService("claudeCode", service);
  },
  
  // Plugin configuration schema
  config: {
    ANTHROPIC_API_KEY: {
      type: "string",
      required: true,
      description: "Anthropic API key for Claude Code authentication",
    },
    CLAUDE_CODE_WORKSPACE: {
      type: "string",
      required: false,
      description: "Default workspace directory for Claude Code operations",
    },
    CLAUDE_CODE_MODEL: {
      type: "string",
      required: false,
      default: "claude-3-5-sonnet-20241022",
      description: "Claude model to use",
    },
    CLAUDE_CODE_MAX_TOKENS: {
      type: "number",
      required: false,
      default: 4096,
      description: "Maximum tokens for Claude responses",
    },
  },
};

export default claudeCodePlugin;
