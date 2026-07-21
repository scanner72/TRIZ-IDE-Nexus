import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveArizState } from '../src/state/ariz-machine.js';

test('deriveArizState reaches generation when user approved and contradiction exists', () => {
  const state = deriveArizState(true, true);

  assert.equal(state.currentStep, 'READY_FOR_GENERATION');
  assert.deepEqual(state.blockers, []);
});

test('deriveArizState reports blocker when contradiction is missing', () => {
  const state = deriveArizState(false, false);

  assert.equal(state.currentStep, 'PART_1_PROBLEM_ANALYSIS');
  assert.equal(state.blockers[0], 'Technical contradiction is required to proceed');
});
