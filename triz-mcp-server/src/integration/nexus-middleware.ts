import { analyzeRequestSchema, type AnalyzeRequest, type AnalyzeResponse } from '../models/triz.js';

export interface NexusPromptEnvelope {
  sessionId: string;
  repository: string;
  userPrompt: string;
  codeContext: {
    language: string;
    files: string[];
    architecturalNotes: string;
  };
}

export interface MiddlewareForwardResult {
  endpoint: string;
  payload: AnalyzeRequest;
}

export function buildAnalyzePayload(envelope: NexusPromptEnvelope): AnalyzeRequest {
  return analyzeRequestSchema.parse({
    request_metadata: {
      session_id: envelope.sessionId,
      target_repository: envelope.repository
    },
    task: {
      summary: envelope.userPrompt,
      desired_outcome: 'Produce code only after TRIZ engineering passport approval'
    },
    code_context: {
      language: envelope.codeContext.language,
      files: envelope.codeContext.files,
      architectural_notes: envelope.codeContext.architecturalNotes
    }
  });
}

export function createMiddlewareForward(envelope: NexusPromptEnvelope): MiddlewareForwardResult {
  return {
    endpoint: 'http://127.0.0.1:8787/api/v1/triz/analyze',
    payload: buildAnalyzePayload(envelope)
  };
}

export function shouldReleaseToCodeGeneration(response: AnalyzeResponse): boolean {
  return response.validation.user_approved && response.validation.system_verdict === 'READY_FOR_GENERATION';
}
