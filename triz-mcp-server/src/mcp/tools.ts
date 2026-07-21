import { z } from 'zod';
import { analyzeArchitecturalConflict, buildAnalysisResponse, evaluateIkr, suggestTrizPrinciples } from '../core/triz-engine.js';
import { knowledgeBase } from '../memory/knowledge-base.js';
import { analyzeRequestSchema, physicalContradictionSchema, technicalContradictionSchema } from '../models/triz.js';
import type { McpToolCall } from './protocol.js';

const toolResponseSchema = z.object({
  tool: z.string(),
  ok: z.boolean(),
  result: z.unknown().optional(),
  error: z.string().optional()
});

export type McpToolResponse = z.infer<typeof toolResponseSchema>;

export function executeToolCall(call: McpToolCall): McpToolResponse {
  try {
    switch (call.tool) {
      case 'analyze_architectural_conflict': {
        const payload = analyzeRequestSchema.parse(call.input);
        return {
          tool: call.tool,
          ok: true,
          result: analyzeArchitecturalConflict(payload)
        };
      }
      case 'evaluate_ikr': {
        const payload = physicalContradictionSchema.parse(call.input);
        return {
          tool: call.tool,
          ok: true,
          result: { ikr_formulation: evaluateIkr(payload) }
        };
      }
      case 'suggest_triz_principles': {
        const payload = technicalContradictionSchema.parse(call.input);
        return {
          tool: call.tool,
          ok: true,
          result: { applied_altshuller_principles: suggestTrizPrinciples(payload) }
        };
      }
      case 'run_full_ariz_pipeline': {
        const payload = analyzeRequestSchema.parse(call.input);
        return {
          tool: call.tool,
          ok: true,
          result: buildAnalysisResponse(payload)
        };
      }
      case 'list_triz_principles': {
        return {
          tool: call.tool,
          ok: true,
          result: { principles: knowledgeBase.listPrinciples() }
        };
      }
      case 'get_triz_principle': {
        const id = Number(call.input.id);
        const principle = knowledgeBase.getById(id);

        if (!principle) {
          return {
            tool: call.tool,
            ok: false,
            error: 'Principle not found'
          };
        }

        return {
          tool: call.tool,
          ok: true,
          result: principle
        };
      }
    }
  } catch (error) {
    return {
      tool: call.tool,
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown tool execution error'
    };
  }

  return {
    tool: call.tool,
    ok: false,
    error: 'Unsupported tool'
  };
}
