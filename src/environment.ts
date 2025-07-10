import { z } from "@ai16z/eliza";
import { IAgentRuntime } from "@ai16z/eliza";

const claudeCodeEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "Anthropic API key is required"),
  CLAUDE_CODE_WORKSPACE: z.string().optional(),
  CLAUDE_CODE_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
  CLAUDE_CODE_MAX_TOKENS: z.number().default(4096),
});

export type ClaudeCodeEnv = z.infer<typeof claudeCodeEnvSchema>;

export async function validateClaudeCodeConfig(
  runtime: IAgentRuntime
): Promise<ClaudeCodeEnv> {
  try {
    const config = {
      ANTHROPIC_API_KEY: runtime.getSetting("ANTHROPIC_API_KEY") || process.env.ANTHROPIC_API_KEY,
      CLAUDE_CODE_WORKSPACE: runtime.getSetting("CLAUDE_CODE_WORKSPACE") || process.env.CLAUDE_CODE_WORKSPACE || process.cwd(),
      CLAUDE_CODE_MODEL: runtime.getSetting("CLAUDE_CODE_MODEL") || process.env.CLAUDE_CODE_MODEL,
      CLAUDE_CODE_MAX_TOKENS: Number(runtime.getSetting("CLAUDE_CODE_MAX_TOKENS") || process.env.CLAUDE_CODE_MAX_TOKENS || 4096),
    };

    return claudeCodeEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(
        `Claude Code configuration validation failed: ${errorMessages}`
      );
    }
    throw error;
  }
}
