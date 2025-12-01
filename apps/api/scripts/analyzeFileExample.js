import OpenAI from "openai";
import { toFile } from "openai/uploads";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? process.env.OPENAI_KEY
});
const SUPPORTED_EXTENSIONS = new Set([".pdf", ".xlsx", ".xls", ".jpg", ".jpeg", ".png"]);
export async function analyzeFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const stat = await fs.promises.stat(absolutePath);
    if (!stat.isFile()) {
        throw new Error(`Path ${absolutePath} is not a file`);
    }
    const ext = path.extname(absolutePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
        throw new Error(`Unsupported file extension ${ext}. Supported extensions: ${Array.from(SUPPORTED_EXTENSIONS).join(", ")}`);
    }
    const fileForUpload = await toFile(absolutePath);
    const uploaded = await client.files.create({
        file: fileForUpload,
        purpose: "assistants"
    });
    const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze this file and summarize key business insights. Highlight trends, risks, and opportunities."
                    },
                    {
                        type: "file_reference",
                        file_id: uploaded.id
                    }
                ]
            }
        ],
        temperature: 0.2
    });
    const message = completion.choices[0]?.message?.content;
    if (!message || typeof message !== "string") {
        throw new Error("GPT-4o did not return a textual response.");
    }
    return message.trim();
}
if (import.meta.url === fileURLToPath(import.meta.url)) {
    const [, , inputPath] = process.argv;
    if (!inputPath) {
        console.error("Usage: pnpm tsx apps/api/scripts/analyzeFileExample.ts <path-to-file>");
        process.exit(1);
    }
    analyzeFile(inputPath)
        .then((result) => {
        console.log("GPT-4o analysis:\n");
        console.log(result);
    })
        .catch((error) => {
        console.error("Failed to analyze file:", error);
        process.exit(1);
    });
}
