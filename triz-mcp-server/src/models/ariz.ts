export const ARIZ_STEPS = [
  'PART_1_PROBLEM_ANALYSIS',
  'PART_2_CONTRADICTION_MODEL',
  'PART_3_IKR_FORMULATION',
  'PART_4_RESOURCE_ANALYSIS',
  'PART_5_PRINCIPLE_SELECTION',
  'READY_FOR_GENERATION'
] as const;

export type ArizStep = (typeof ARIZ_STEPS)[number];

export interface ArizState {
  currentStep: ArizStep;
  history: ArizStep[];
  blockers: string[];
}
