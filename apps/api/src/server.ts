import { createApp } from './app.js';
import { loadEnv } from './env.js';

const env = loadEnv();
const app = createApp(env);

app.listen(env.PORT, () => {
  console.log(`NutriTale API listening on port ${env.PORT} (${env.NODE_ENV}). No database connected yet.`);
});
