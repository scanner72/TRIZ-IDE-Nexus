import { z } from 'zod';

export const requestMetadataSchema = z.object({
  session_id: z.string().min(1),
  target_repository: z.string().min(1)
});

export const taskSchema = z.object({
  summary: z.string().min(1),
  desired_outcome: z.string().min(1),
  constraints: z.array(z.string()).optional()
});

export const codeContextSchema = z.object({
  language: z.string().min(1),
  files: z.array(z.string()).default([]),
  architectural_notes: z.string().min(1),
  snippets: z.array(z.string()).optional()
});

export const analyzeRequestSchema = z.object({
  request_metadata: requestMetadataSchema,
  task: taskSchema,
  code_context: codeContextSchema
});

export const technicalContradictionSchema = z.object({
  parameter_to_optimize: z.string().min(1),
  parameter_that_degrades: z.string().min(1)
});

export const physicalContradictionSchema = z.object({
  element: z.string().min(1),
  required_properties: z.array(z.string()).min(2)
});

export const pipelineStateSchema = z.object({
  current_ariz_step: z.enum([
    'PART_1_PROBLEM_ANALYSIS',
    'PART_2_CONTRADICTION_MODEL',
    'PART_3_IKR_FORMULATION',
    'PART_4_RESOURCE_ANALYSIS',
    'PART_5_PRINCIPLE_SELECTION',
    'READY_FOR_GENERATION'
  ]),
  technical_contradiction: technicalContradictionSchema,
  physical_contradiction: physicalContradictionSchema,
  ikr_formulation: z.string().min(1),
  applied_altshuller_principles: z.array(z.number().int().positive()).min(1)
});

export const validationSchema = z.object({
  user_approved: z.boolean(),
  system_verdict: z.enum([
    'READY_FOR_REVIEW',
    'READY_FOR_GENERATION',
    'INSUFFICIENT_CONTEXT'
  ])
});

export const analyzeResponseSchema = z.object({
  request_metadata: requestMetadataSchema,
  pipeline_state: pipelineStateSchema,
  validation: validationSchema
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type TechnicalContradiction = z.infer<typeof technicalContradictionSchema>;
export type PhysicalContradiction = z.infer<typeof physicalContradictionSchema>;
