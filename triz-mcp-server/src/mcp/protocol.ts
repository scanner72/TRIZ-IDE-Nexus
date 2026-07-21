import { z } from 'zod';

export const mcpToolCallSchema = z.object({
  tool: z.enum([
    'analyze_architectural_conflict',
    'evaluate_ikr',
    'suggest_triz_principles',
    'run_full_ariz_pipeline',
    'list_triz_principles',
    'get_triz_principle'
  ]),
  input: z.record(z.string(), z.unknown())
});

export type McpToolCall = z.infer<typeof mcpToolCallSchema>;
