import { createServer } from './api/server.js';

const port = 8787;
const host = '127.0.0.1';

const app = createServer();

app.listen({ port, host }).then(() => {
  app.log.info(`TRIZ MCP Server listening at http://${host}:${port}`);
}).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
