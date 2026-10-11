export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageData, imageType, profile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ERI not configured" });
    if (!imageData) return res.status(400).json({ error: "No image data" });

    const pc = profile ? `User: ${profile.age||"?"}yo ${profile.sex||""}, ${profile.country||""}, faith:${profile.faith||"none"}, goals:${profile.goals||""}.` : "";

    const prompt = `${pc}

You are ERI performing a UNIVERSAL SCAN on this image.

IDENTIFICATION:
Scientific name, confidence %, all common names globally. If NOT food state clearly.

CALORIE COUNT:
Estimated calories for portion shown. Confidence: HIGH/MEDIUM/LOW.

NUTRITIONAL PROFILE:
Complete macro/micro per 100g.

TRADITIONAL WISDOM:
Cross-cultural ancestral uses. [TRADITIONAL WISDOM]

MODERN RESEARCH:
Latest peer-reviewed findings. [RESEARCH SUPPORTED] [PUBMED]

SAFETY:
Toxicity, allergens, interactions. If NOT FOOD state clearly.

CORPORATE CAPTURE:
Who controls the mainstream narrative around this.

VERDICT:
SAFE or CAUTION or TOXIC or NOT FOOD. One word then one paragraph.

LIFE PROTOCOL:
Personalized recommendation for this user.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: imageType || "image/jpeg", data: imageData } },
              { text: prompt }
            ]
          }],
          generationConfig: { maxOutputTokens: 8192 }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ result: text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
