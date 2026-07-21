import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnalysisResponse } from '../src/core/triz-engine.js';
import type { AnalyzeRequest } from '../src/models/triz.js';

test('buildAnalysisResponse returns latency vs memory contradiction for cache tasks', () => {
  const input: AnalyzeRequest = {
    request_metadata: {
      session_id: 'nexus-session-2026',
      target_repository: 'git@github.com:user/project.git'
    },
    task: {
      summary: 'Optimize cache behavior for lower latency',
      desired_outcome: 'Fast reads without persistent RAM-heavy cache'
    },
    code_context: {
      language: 'typescript',
      files: ['src/cache.ts'],
      architectural_notes: 'Cache improves speed but increases memory usage'
    }
  };

  const result = buildAnalysisResponse(input);

  assert.equal(
    result.pipeline_state.technical_contradiction.parameter_to_optimize,
    'execution_speed (latency)'
  );
  assert.equal(
    result.pipeline_state.technical_contradiction.parameter_that_degrades,
    'memory_footprint (ram)'
  );
  assert.deepEqual(result.pipeline_state.applied_altshuller_principles, [2, 10, 15, 28]);
  assert.equal(result.validation.system_verdict, 'READY_FOR_REVIEW');
});
