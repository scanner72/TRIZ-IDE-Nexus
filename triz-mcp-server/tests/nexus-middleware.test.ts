import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnalyzePayload, createMiddlewareForward } from '../src/integration/nexus-middleware.js';

test('buildAnalyzePayload converts UI envelope into typed analysis request', () => {
  const payload = buildAnalyzePayload({
    sessionId: 'nexus-session-2026',
    repository: 'git@github.com:user/project.git',
    userPrompt: 'Resolve speed vs memory contradiction',
    codeContext: {
      language: 'typescript',
      files: ['src/cache.ts'],
      architecturalNotes: 'Need low latency without RAM-heavy cache'
    }
  });

  assert.equal(payload.request_metadata.session_id, 'nexus-session-2026');
  assert.equal(payload.code_context.language, 'typescript');
});

test('createMiddlewareForward points to local TRIZ endpoint', () => {
  const forward = createMiddlewareForward({
    sessionId: 'nexus-session-2026',
    repository: 'git@github.com:user/project.git',
    userPrompt: 'Resolve speed vs memory contradiction',
    codeContext: {
      language: 'typescript',
      files: ['src/cache.ts'],
      architecturalNotes: 'Need low latency without RAM-heavy cache'
    }
  });

  assert.equal(forward.endpoint, 'http://127.0.0.1:8787/api/v1/triz/analyze');
});
