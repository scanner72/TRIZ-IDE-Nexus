import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { buildAnalysisResponse } from '../core/triz-engine.js';
import { knowledgeBase } from '../memory/knowledge-base.js';
import { sessionStore } from '../memory/session-store.js';
import { approveRequestSchema } from '../models/session.js';
import { analyzeRequestSchema } from '../models/triz.js';

export async function registerTrizRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok', service: 'triz-mcp-server' }));

  app.get('/api/v1/triz/principles', async (request, reply) => {
    const query = typeof (request.query as { q?: unknown }).q === 'string'
      ? (request.query as { q?: string }).q
      : undefined;

    const principles = query ? knowledgeBase.searchPrinciples(query) : knowledgeBase.listPrinciples();
    return reply.code(200).send({ principles });
  });

  app.get('/api/v1/triz/principles/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    const principle = knowledgeBase.getById(id);

    if (!principle) {
      return reply.code(404).send({ error: 'PRINCIPLE_NOT_FOUND' });
    }

    return reply.code(200).send(principle);
  });

  app.post('/api/v1/triz/analyze', async (request, reply) => {
    try {
      const payload = analyzeRequestSchema.parse(request.body);
      const result = buildAnalysisResponse(payload);
      sessionStore.upsert(result);
      return reply.code(200).send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: 'INVALID_REQUEST',
          details: error.issues
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  });

  app.post('/api/v1/triz/approve', async (request, reply) => {
    try {
      const payload = approveRequestSchema.parse(request.body);
      const record = sessionStore.approve(payload.session_id);

      if (!record) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }

      return reply.code(200).send(record.response);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: 'INVALID_REQUEST',
          details: error.issues
        });
      }

      request.log.error(error);
      return reply.code(500).send({ error: 'INTERNAL_SERVER_ERROR' });
    }
  });
}
