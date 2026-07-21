import { ARIZ_STEPS, type ArizState, type ArizStep } from '../models/ariz.js';

export function createInitialArizState(): ArizState {
  return {
    currentStep: 'PART_1_PROBLEM_ANALYSIS',
    history: ['PART_1_PROBLEM_ANALYSIS'],
    blockers: []
  };
}

export function advanceArizState(state: ArizState, nextStep: ArizStep): ArizState {
  const currentIndex = ARIZ_STEPS.indexOf(state.currentStep);
  const nextIndex = ARIZ_STEPS.indexOf(nextStep);

  if (nextIndex === -1) {
    return {
      ...state,
      blockers: [...state.blockers, `Unknown step: ${nextStep}`]
    };
  }

  if (nextIndex < currentIndex) {
    return {
      ...state,
      blockers: [...state.blockers, `Backward transition denied: ${state.currentStep} -> ${nextStep}`]
    };
  }

  if (nextIndex === currentIndex) {
    return state;
  }

  return {
    currentStep: nextStep,
    history: [...state.history, nextStep],
    blockers: state.blockers
  };
}

export function deriveArizState(userApproved: boolean, hasTechnicalContradiction: boolean): ArizState {
  let state = createInitialArizState();

  if (!hasTechnicalContradiction) {
    return {
      ...state,
      blockers: ['Technical contradiction is required to proceed']
    };
  }

  state = advanceArizState(state, 'PART_2_CONTRADICTION_MODEL');
  state = advanceArizState(state, 'PART_3_IKR_FORMULATION');
  state = advanceArizState(state, 'PART_4_RESOURCE_ANALYSIS');
  state = advanceArizState(state, 'PART_5_PRINCIPLE_SELECTION');

  if (userApproved) {
    state = advanceArizState(state, 'READY_FOR_GENERATION');
  }

  return state;
}
