import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { mcpToolCallSchema } from '../mcp/protocol.js';
import { executeToolCall } from '../mcp/tools.js';

export async function registerMcpRoutes(app: FastifyInstance): Promise<void> {
  app.post('/mcp/tool', async (request, reply) => {
    try {
      const payload = mcpToolCallSchema.parse(request.body);
      const result = executeToolCall(payload);
      return reply.code(result.ok ? 200 : 400).send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: 'INVALID_MCP_REQUEST',
          details: error.issues
        });
      }

      request.log.error(error);
      return reply.code(500).send({ error: 'INTERNAL_SERVER_ERROR' });
    }
  });
}
