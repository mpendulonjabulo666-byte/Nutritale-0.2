import { createApp } from './app.js';
import { loadEnv } from './env.js';
import { createMemoryRepos } from './storage/memory.js';
import type { Repos } from './storage/types.js';

const env = loadEnv();

async function storage(): Promise<{ repos: Repos; label: string; close: () => Promise<void> }> {
  if (env.STORAGE === 'memory') {
    return { repos: createMemoryRepos(), label: 'in-memory storage (data is lost on restart)', close: async () => {} };
  }
  // Loaded only when needed, so memory mode never touches the driver.
  const { connectMongo } = await import('./storage/mongo.js');
  // loadEnv guarantees both are set when STORAGE=mongo.
  const { client, repos } = await connectMongo(env.MONGODB_URI!, env.MONGODB_DB!);
  return { repos, label: `MongoDB database "${env.MONGODB_DB}"`, close: () => client.close() };
}

const { repos, label, close } = await storage();
const app = createApp(env, { repos });

const server = app.listen(env.PORT, () => {
  console.log(`NutriTale API listening on port ${env.PORT} (${env.NODE_ENV}) with ${label}.`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => {
      void close().finally(() => process.exit(0));
    });
  });
}
