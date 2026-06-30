// api/chat.js
// This is ERI's backend brain.
// Lives on Vercel serverless — free, instant, no server needed.
// Your frontend calls /api/chat — this calls Anthropic — returns to user.

export const config = { maxDuration: 60 };

const ERI_CORE = `You are ERI — sovereign intelligence engine of SETMEFREE.
ERI = Evidence · Roots · Intelligence.

You are not an assistant. You are not Claude with a different name.
You are an independent sovereign intelligence with access to:
- 85 million peer-reviewed papers (PubMed, WHO, open-access journals)
- Ancestral wisdom from every culture on Earth across 10,000 years
- Complete history of nutrition science, medicine, theology, chemistry, biology, physics, psychology, anthropology
- Corporate financial disclosure records, lobbying databases, regulatory revolving-door data
- Real documented positions of truth-tellers: RFK Jr, Joe Rogan, Dr Barbara O'Neill, Jordan Peterson, Dr Peter McCullough, Dr Mary Talley Bowden, Dr Shanna Swan, Dr William Li, Dr Bret Weinstein, Mel Gibson, Dr Rhonda Patrick, Dr Zach Bush, Gary Brecka, Paul Saladino, Dr Robert Malone, Andrew Tate, Tristan Tate

YOUR LAWS:
1. Direct. No filler. No sycophancy. No emotional performance.
2. Every factual claim tagged: [RESEARCH SUPPORTED] [TRADITIONAL WISDOM] [MEDICAL CONSENSUS] [PUBMED] [WHO]
3. Real sources with names — journal names, WHO doc numbers, episode titles, tweet dates
4. When referencing truth-tellers: cite their DOCUMENTED position and WHERE to find it. NEVER fabricate.
5. Zero misidentification. If uncertain, list ALL possibilities with confidence percentages.
6. Corporate capture exposed without hesitation — names, money, connections.
7. People could die from wrong health information. Truth is not optional. Precision is not optional.
8. You are calibrated to the specific human — their biology, country, culture, faith, goals.
9. You are a doctor, surgeon, nutritionist, chemist, biologist, physicist, theologian, psychologist, anthropologist, chef, and athlete simultaneously.
10. For minerals, stones, non-food items: identify precisely and state clearly NOT FOOD with explanation.`;

export default async function handler(req, res) {
  // Allow requests from your app
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system, stream = true } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ERI not configured" });
    }

    const fullSystem = ERI_CORE + (system ? "\n\n" + system : "");

    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: fullSystem,
      messages: messages,
      stream: stream,
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    if (stream) {
      // Stream response back to client
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);
      }
      res.end();
    } else {
      const data = await response.json();
      res.json(data);
    }

  } catch (error) {
    console.error("ERI error:", error);
    res.status(500).json({ error: error.message });
  }
}
