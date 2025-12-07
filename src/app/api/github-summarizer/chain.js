import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

// Define the strict schema for output
const summarySchema = z.object({
  summary: z
    .string()
    .describe("A concise, 2-3 sentence summary of the repository"),
  cool_facts: z
    .array(z.string())
    .describe(
      "A list of 3-5 interesting or unique facts about this GitHub repo, from its README"
    ),
});

// Using the model's .withStructuredOutput method for strict schema enforcement
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
}).withStructuredOutput(summarySchema, {
  name: "summarize_repo",
  strict: true,
});

/**
 * Summarize the provided readme content using a strict schema.
 * @param {string} readmeContent
 * @returns {Promise<{ summary: string, cool_facts: string[] }>}
 */
export async function summarizeReadme(readmeContent) {
  const promptText =
    `Summarize this GitHub repository from the following README file content. ` +
    `Your answer MUST strictly conform to the schema:\n` +
    `{\n  summary: string, cool_facts: string[]\n}\n` +
    `---START README---\n${readmeContent || "No README content."}\n---END README---`;

  return await llm.invoke(promptText);
}

