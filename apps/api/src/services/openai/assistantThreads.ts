import { getOpenAIClient } from "./client.js";

export const createAssistantThread = async (): Promise<string> => {
  const client = getOpenAIClient();
  const thread = await client.beta.threads.create();
  return thread.id;
};

export const deleteAssistantThread = async (threadId: string | null | undefined): Promise<void> => {
  if (!threadId) {
    return;
  }

  try {
    const client = getOpenAIClient();
    await client.beta.threads.del(threadId);
  } catch (error) {
    console.error("[openai] failed to delete assistant thread", { threadId, error });
  }
};

export const createAssistantVectorStore = async (): Promise<string> => {
  const client = getOpenAIClient();
  const vectorStore = await client.vectorStores.create({ name: `project-store-${Date.now()}` });
  return vectorStore.id;
};

export const deleteAssistantVectorStore = async (
  vectorStoreId: string | null | undefined
): Promise<void> => {
  if (!vectorStoreId) {
    return;
  }

  try {
    const client = getOpenAIClient();
    await client.vectorStores.del(vectorStoreId);
  } catch (error) {
    console.error("[openai] failed to delete assistant vector store", {
      vectorStoreId,
      error
    });
  }
};
