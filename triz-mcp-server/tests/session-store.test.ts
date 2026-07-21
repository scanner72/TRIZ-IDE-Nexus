import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionStore } from '../src/memory/session-store.js';
import type { AnalyzeResponse } from '../src/models/triz.js';

test('session store approves an analyzed session', () => {
  const response: AnalyzeResponse = {
    request_metadata: {
      session_id: 'session-approve-1',
      target_repository: 'git@github.com:user/project.git'
    },
    pipeline_state: {
      current_ariz_step: 'PART_3_IKR_FORMULATION',
      technical_contradiction: {
        parameter_to_optimize: 'execution_speed (latency)',
        parameter_that_degrades: 'memory_footprint (ram)'
      },
      physical_contradiction: {
        element: 'data_cache_layer',
        required_properties: [
          'must_be_present_for_instant_read',
          'must_be_absent_to_free_ram'
        ]
      },
      ikr_formulation: 'Data is read instantly without a permanent RAM cache.',
      applied_altshuller_principles: [2, 10, 15, 28]
    },
    validation: {
      user_approved: false,
      system_verdict: 'READY_FOR_REVIEW'
    }
  };

  sessionStore.upsert(response);
  const approved = sessionStore.approve('session-approve-1');

  assert.equal(approved?.response.validation.user_approved, true);
  assert.equal(approved?.response.validation.system_verdict, 'READY_FOR_GENERATION');
  assert.equal(approved?.response.pipeline_state.current_ariz_step, 'READY_FOR_GENERATION');
});
