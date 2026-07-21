import { createMiddlewareForward, type NexusPromptEnvelope } from './nexus-middleware.js';

export interface VoidInterceptResult {
  intercepted: true;
  target: string;
  body: unknown;
}

export function interceptVoidAiRequest(envelope: NexusPromptEnvelope): VoidInterceptResult {
  const forward = createMiddlewareForward(envelope);

  return {
    intercepted: true,
    target: forward.endpoint,
    body: forward.payload
  };
}
