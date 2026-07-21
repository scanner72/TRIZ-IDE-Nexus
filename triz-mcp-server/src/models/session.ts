import { z } from 'zod';
import { analyzeResponseSchema } from './triz.js';

export const approveRequestSchema = z.object({
  session_id: z.string().min(1),
  user_approved: z.literal(true)
});

export const sessionRecordSchema = z.object({
  session_id: z.string().min(1),
  prompt_hash: z.string().min(1),
  response: analyzeResponseSchema,
  updated_at: z.string().min(1)
});

export type ApproveRequest = z.infer<typeof approveRequestSchema>;
export type SessionRecord = z.infer<typeof sessionRecordSchema>;
