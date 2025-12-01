import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { bootstrapProviders } from "./providers/index.js";

const start = async (): Promise<void> => {
  await connectDatabase();
  try {
    bootstrapProviders();
  } catch (err) {
    console.error("Failed to bootstrap providers", err);
  }

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
