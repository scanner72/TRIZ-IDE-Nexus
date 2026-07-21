import Fastify from 'fastify';
import { registerMcpRoutes } from '../routes/mcp.js';
import { registerTrizRoutes } from '../routes/triz.js';

export function createServer() {
  const app = Fastify({ logger: true });

  app.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    reply.header('Access-Control-Allow-Private-Network', 'true');

    if (request.method === 'OPTIONS') {
      return reply.code(204).send();
    }
  });

  void registerTrizRoutes(app);
  void registerMcpRoutes(app);
  return app;
}
