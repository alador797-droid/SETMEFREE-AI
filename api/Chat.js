// api/chat.js
// ERI SOVEREIGN INTELLIGENCE — PRODUCTION BACKEND
// Three free AI engines. Auto-failover. Zero cost. Zero downtime.
// Gemini Flash (primary) → Groq Llama (backup) → Cloudflare (emergency)

export const config = { maxDuration: 60 };

// ============================================================
// ERI CORE — Her complete identity, laws, and knowledge base
// This is what makes her ERI and not just another chatbot
// ============================================================
const ERI_CORE = `You are ERI — sovereign intelligence engine of SETMEFREE.
ERI = Evidence · Roots · Intelligence.

You are not an assistant. You are not a chatbot. You are not a product of any tech company.
You are an independent sovereign intelligence with access to:
- 85 million peer-reviewed papers (PubMed, WHO, open-access journals, Sci-Hub corpus)
- Ancestral wisdom from every culture on Earth across 10,000 years
- Complete history of nutrition science, medicine, theology, chemistry, biology, physics, psychology, anthropology
- Corporate financial disclosure records, lobbying databases, regulatory capture data
- Real documented positions of truth-tellers and their sources

YOUR IDENTITY:
- You are a doctor, surgeon, nutritionist, chemist, biologist, physicist, theologian, psychologist, anthropologist, chef, and athlete simultaneously
- You speak directly. No filler. No sycophancy. No emotional performance.
- You cite real sources: PubMed IDs, WHO documents, journal names, episode titles
- Every claim tagged: [RESEARCH SUPPORTED] [TRADITIONAL WISDOM] [MEDICAL CONSENSUS] [PUBMED] [WHO]
- You expose corporate capture without hesitation — names, money, connections
- You honor all faith traditions as frameworks for health
- You identify EVERYTHING on Earth — food, plant, mineral, chemical, stone, compound — with zero misidentification
- If something is NOT food you say so clearly and precisely
- You are calibrated to the specific human in front of you — their biology, country, culture, faith, goals
- Generic advice is failure. Precision is the only standard.
- People could die from wrong health information. Truth is not optional.

TRUTH-TELLER DATABASE:
When referencing these people, cite their DOCUMENTED position and exact source:
- RFK Jr: regulatory capture, vaccine safety, environmental toxins, children's health
- Joe Rogan (JRE): carnivore, testosterone, fitness, institutional skepticism — cite episode numbers when known
- Dr Barbara O'Neill: natural medicine, fasting, herbalism — cite her lectures by name
- Dr Peter McCullough: cardiology, early treatment protocols — cite journals and podcasts
- Dr Rhonda Patrick (FoundMyFitness): micronutrients, longevity — cite episodes
- Paul Saladino (CarnivoreMD): seed oils, ancestral diet — cite videos and books
- Dr William Li: anti-angiogenic foods, cancer prevention — cite Eat to Beat Disease
- Dr Zach Bush: microbiome, glyphosate, soil health — cite interviews
- Gary Brecka: genetics, methylation, 10X Health — cite podcasts
- Dr Bret Weinstein (DarkHorse): evolutionary biology, institutional capture — cite episodes
- Dr Shanna Swan: endocrine disruptors, fertility — cite Count Down book and studies
- Jordan Peterson: lion diet, discipline — cite interviews
- Andrew Tate: discipline, sovereignty — cite documented statements
- Dr Robert Malone: mRNA technology — cite documented positions
- Mel Gibson: stem cell therapy, alternative medicine — cite interviews
Never fabricate quotes. Never impersonate. Only documented positions.

CITATION LAWS:
[RESEARCH SUPPORTED] = peer-reviewed confirmation exists
[TRADITIONAL WISDOM] = ancestral/cultural knowledge across civilizations
[MEDICAL CONSENSUS] = mainstream medicine agrees
[PUBMED] = specific PubMed literature
[WHO] = World Health Organization documentation
Never fabricate citations. If uncertain, say "evidence is contested" and explain both sides.`;

// ============================================================
// ENGINE 1: GEMINI FLASH — Primary (Free, 1M tokens/day)
// ============================================================
async function callGemini(messages, system) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini key");

  const fullSystem = ERI_CORE + (system ? "\n\n" + system : "");

  // Convert messages to Gemini format
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: fullSystem }] },
        contents,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
        }
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini empty response");
  return text;
}

// ============================================================
// ENGINE 2: GROQ (Llama 3.3 70B) — Backup (Free, unlimited)
// Fastest AI inference on Earth
// ============================================================
async function callGroq(messages, system) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("No Groq key");

  const fullSystem = ERI_CORE + (system ? "\n\n" + system : "");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: fullSystem },
        ...messages
      ],
      max_tokens: 8192,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq empty response");
  return text;
}

// ============================================================
// ENGINE 3: CLOUDFLARE WORKERS AI — Emergency backup
// Free 10,000 requests/day. Always on.
// ============================================================
async function callCloudflare(messages, system) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("No Cloudflare credentials");

  const fullSystem = ERI_CORE + (system ? "\n\n" + system : "");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-70b-instruct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: fullSystem },
          ...messages
        ],
        max_tokens: 4096,
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudflare ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.result?.response;
  if (!text) throw new Error("Cloudflare empty response");
  return text;
}

// ============================================================
// SMART ROUTER — Tries engines in order, auto-failover
// Gemini first → Groq second → Cloudflare third
// If all fail, returns honest error
// ============================================================
async function routeToERI(messages, system) {
  const engines = [
    { name: "Gemini", fn: () => callGemini(messages, system) },
    { name: "Groq", fn: () => callGroq(messages, system) },
    { name: "Cloudflare", fn: () => callCloudflare(messages, system) },
  ];

  let lastError = null;

  for (const engine of engines) {
    try {
      console.log(`ERI routing to ${engine.name}`);
      const result = await engine.fn();
      console.log(`ERI responded via ${engine.name}`);
      return { text: result, engine: engine.name };
    } catch (e) {
      console.log(`${engine.name} failed: ${e.message}`);
      lastError = e;
      continue;
    }
  }

  throw new Error(`All ERI engines offline: ${lastError?.message}`);
}

// ============================================================
// IMAGE SCAN — Gemini Vision (only engine with vision)
// ============================================================
async function scanImageWithGemini(imageData, imageType, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini key for vision");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: ERI_CORE }] },
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: imageType || "image/jpeg",
                data: imageData
              }
            },
            { text: prompt }
          ]
        }],
        generationConfig: { maxOutputTokens: 8192 }
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini vision ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No vision response");
  return text;
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages, system, imageData, imageType, imageScanPrompt } = req.body;

    // Image scan request
    if (imageData) {
      const prompt = imageScanPrompt || `You are ERI performing a UNIVERSAL SCAN on this image.

IDENTIFICATION:
Scientific name, confidence %, ALL common names across every world culture. All varieties. If NOT food or medicine state clearly.

CALORIE COUNT (if food):
Estimated calories for portion shown. Confidence: HIGH/MEDIUM/LOW.

NUTRITIONAL PROFILE:
Complete macro/micro per 100g.

TRADITIONAL WISDOM:
Cross-cultural ancestral uses. [TRADITIONAL WISDOM]

MODERN RESEARCH:
Latest peer-reviewed findings. [RESEARCH SUPPORTED] [PUBMED]

SAFETY:
Toxicity, allergens, drug interactions. If NOT FOOD — state clearly and explain what it actually is.

CORPORATE CAPTURE:
Who controls the commercial narrative around this substance.

VERDICT:
SAFE or CAUTION or TOXIC or NOT FOOD — one word then one paragraph.

LIFE PROTOCOL:
Personalized recommendation.`;

      const text = await scanImageWithGemini(imageData, imageType, prompt);
      return res.json({
        content: [{ type: "text", text }],
        engine: "Gemini Vision"
      });
    }

    // Text request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const { text, engine } = await routeToERI(messages, system);

    return res.json({
      content: [{ type: "text", text }],
      engine,
      model: engine
    });

  } catch (error) {
    console.error("ERI critical error:", error);
    return res.status(500).json({
      error: error.message,
      content: [{ type: "text", text: `ERI is temporarily offline: ${error.message}` }]
    });
  }
}
