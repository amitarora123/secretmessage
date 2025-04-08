import model from "@/utils/gemini";

const humanDelay = async (char: string) => {
  let base = 1;

  if (/[.,!?]/.test(char)) {
    base = 15; // longer delay after punctuation
  } else if (char === " ") {
    base = 5;
  }

  const jitter = Math.random() * 3; // random small variation
  await new Promise((res) => setTimeout(res, base + jitter));
};

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const prompt =
          "Generate a brand-new, never-before-used set of three open-ended questions that would spark curiosity, self-reflection, or playful banter on an anonymous social Q&A platform like Qooh.me. Avoid repeating question structures, topics, or tones used in previous answers. Include a mix of lighthearted, deep, and unexpected questions. Format the output as a single string with each question separated by '||'. Make the content feel fresh, unpredictable, and fun for a diverse audience.";

        const result = await model.generateContentStream(prompt);

        const fullText = (await result.response).text();

        // 1. Collect the full response (usually comes as one chunk)
        for (const chunk of fullText) {
          const message = `data: ${chunk}\n\n`;
          controller.enqueue(encoder.encode(message));
          await humanDelay(chunk);
        }
        controller.enqueue(encoder.encode("event: end\ndata: done\n\n"));
        controller.close();
        // 2. Create a manual stream to send one question at a time
      } catch (error) {
        console.error("Error in streaming:", error);
        controller.enqueue(encoder.encode(`data: Error occurred.\n\n`));
        controller.enqueue(encoder.encode("event: end\ndata: error\n\n"));
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
