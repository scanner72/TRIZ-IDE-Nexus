import type { AnalyzeResponse } from '../models/triz.js';
import type { SessionRecord } from '../models/session.js';

function createPromptHash(response: AnalyzeResponse): string {
  return JSON.stringify({
    session_id: response.request_metadata.session_id,
    target_repository: response.request_metadata.target_repository,
    pipeline_state: response.pipeline_state
  });
}

export class SessionStore {
  private readonly records = new Map<string, SessionRecord>();

  upsert(response: AnalyzeResponse): SessionRecord {
    const record: SessionRecord = {
      session_id: response.request_metadata.session_id,
      prompt_hash: createPromptHash(response),
      response,
      updated_at: new Date().toISOString()
    };

    this.records.set(record.session_id, record);
    return record;
  }

  get(sessionId: string): SessionRecord | undefined {
    return this.records.get(sessionId);
  }

  approve(sessionId: string): SessionRecord | undefined {
    const existing = this.records.get(sessionId);

    if (!existing) {
      return undefined;
    }

    const updated: SessionRecord = {
      ...existing,
      response: {
        ...existing.response,
        pipeline_state: {
          ...existing.response.pipeline_state,
          current_ariz_step: 'READY_FOR_GENERATION'
        },
        validation: {
          user_approved: true,
          system_verdict: 'READY_FOR_GENERATION'
        }
      },
      updated_at: new Date().toISOString()
    };

    this.records.set(sessionId, updated);
    return updated;
  }
}

export const sessionStore = new SessionStore();
