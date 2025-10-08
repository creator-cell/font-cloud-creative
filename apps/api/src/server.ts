import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { bootstrapProviders } from "./providers";

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
