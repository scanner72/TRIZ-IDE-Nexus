import { knowledgeBase } from '../memory/knowledge-base.js';
import { deriveArizState } from '../state/ariz-machine.js';
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  PhysicalContradiction,
  TechnicalContradiction
} from '../models/triz.js';

function normalizeText(value: string): string {
  return value.toLowerCase();
}

export function analyzeArchitecturalConflict(input: AnalyzeRequest): {
  technical: TechnicalContradiction;
  physical: PhysicalContradiction;
} {
  const notes = normalizeText(input.code_context.architectural_notes);
  const summary = normalizeText(input.task.summary);
  const desired = normalizeText(input.task.desired_outcome);
  const combined = [notes, summary, desired].join(' ');

  if (combined.includes('latency') || combined.includes('cache') || combined.includes('memory')) {
    return {
      technical: {
        parameter_to_optimize: 'execution_speed (latency)',
        parameter_that_degrades: 'memory_footprint (ram)'
      },
      physical: {
        element: 'data_cache_layer',
        required_properties: [
          'must_be_present_for_instant_read',
          'must_be_absent_to_free_ram'
        ]
      }
    };
  }

  return {
    technical: {
      parameter_to_optimize: 'system_adaptability',
      parameter_that_degrades: 'implementation_complexity'
    },
    physical: {
      element: 'architecture_control_layer',
      required_properties: [
        'must_be_strict_to_enforce_constraints',
        'must_be_flexible_to_support_change'
      ]
    }
  };
}

export function evaluateIkr(conflict: PhysicalContradiction): string {
  if (conflict.element === 'data_cache_layer') {
    return 'Data is read instantly by using an on-demand mechanism without allocating a permanent RAM cache.';
  }

  return 'The system achieves the desired outcome by using existing resources while avoiding additional permanent architectural burden.';
}

const principleRules: Array<{
  when: (conflict: TechnicalContradiction) => boolean;
  principles: number[];
}> = [
  {
    when: (conflict) =>
      conflict.parameter_to_optimize === 'execution_speed (latency)' &&
      conflict.parameter_that_degrades === 'memory_footprint (ram)',
    principles: [2, 10, 15, 28]
  },
  {
    when: (conflict) =>
      conflict.parameter_to_optimize === 'system_adaptability' &&
      conflict.parameter_that_degrades === 'implementation_complexity',
    principles: [1, 6, 13, 15]
  }
];

export function suggestTrizPrinciples(conflict: TechnicalContradiction): number[] {
  const matchedRule = principleRules.find((rule) => rule.when(conflict));
  const principleIds = matchedRule?.principles ?? [1, 13];
  return knowledgeBase.findByIds(principleIds).map((principle) => principle.id);
}

export function buildAnalysisResponse(input: AnalyzeRequest): AnalyzeResponse {
  const { technical, physical } = analyzeArchitecturalConflict(input);
  const principles = suggestTrizPrinciples(technical);
  const ikr = evaluateIkr(physical);
  const hasTechnicalContradiction = technical.parameter_to_optimize.length > 0 && technical.parameter_that_degrades.length > 0;
  const arizState = deriveArizState(false, hasTechnicalContradiction);

  return {
    request_metadata: input.request_metadata,
    pipeline_state: {
      current_ariz_step: arizState.currentStep,
      technical_contradiction: technical,
      physical_contradiction: physical,
      ikr_formulation: ikr,
      applied_altshuller_principles: principles
    },
    validation: {
      user_approved: false,
      system_verdict: 'READY_FOR_REVIEW'
    }
  };
}
