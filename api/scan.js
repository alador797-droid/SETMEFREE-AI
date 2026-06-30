// api/scan.js
// ERI vision scanner — handles image uploads for food/calorie scanning
// Called when user uploads a photo in the scanner

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageData, imageType, prompt, profile } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "ERI not configured" });
    if (!imageData) return res.status(400).json({ error: "No image data" });

    const profileCtx = profile
      ? `User: ${profile.age||"?"}yo ${profile.sex||""}, ${profile.country||""}, faith:${profile.faith||"none"}, goals:${profile.goals||"?"}, conditions:${profile.conditions||"none"}.`
      : "No profile.";

    const scanPrompt = prompt || `${profileCtx}

You are ERI performing a UNIVERSAL SCAN on this image.

IDENTIFICATION:
Scientific name, confidence %, common names in every language and culture. If multiple possibilities list all with confidence %. NEVER say unrecognized or not found.

CALORIE COUNT (if food):
Estimated calories for portion shown. Confidence: HIGH/MEDIUM/LOW.

NUTRITIONAL PROFILE:
Complete macro/micro breakdown per 100g.

TRADITIONAL WISDOM:
How every major culture has used this. [TRADITIONAL WISDOM]

MODERN RESEARCH:
Latest peer-reviewed findings. [RESEARCH SUPPORTED] [PUBMED]

SAFETY:
Toxicity, allergens, interactions. If NOT FOOD — state clearly.

CORPORATE CAPTURE:
Who controls the commercial narrative around this substance.

VERDICT:
SAFE or CAUTION or TOXIC or NOT FOOD — one word then one sentence.

LIFE PROTOCOL:
Personalized recommendation for the user profile above.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageType || "image/jpeg",
                data: imageData,
              }
            },
            { type: "text", text: scanPrompt }
          ]
        }]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    res.json({ result: text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
