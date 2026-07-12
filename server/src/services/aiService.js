/**
 * aiService.js (server-side) — this is the fix for the security note in the
 * frontend's CHANGELOG: the Gemini key now lives only here, never shipped
 * to the browser. The frontend calls our own /api/cases/:id/ai-summary and
 * /api/cases/ai-assist endpoints instead of Gemini directly.
 */

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set on the server (check server/.env).");
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini API returned no text content.");
  return text.trim();
}

export async function generateCaseSummary(medicalCase) {
  const fallback = `${medicalCase.patientName} is facing ${medicalCase.condition}. ${
    medicalCase.aiSummary?.challenge ?? ""
  } ${medicalCase.aiSummary?.solution ?? ""}`.trim();

  try {
    const prompt = `You are a medical communications assistant for CareBridge, a medical
crowdfunding platform. Translate this clinical case into a short (3-4 sentence),
warm, human-centered summary for potential donors. Preserve medical accuracy but
avoid jargon. Do not invent facts beyond what's given.

Patient: ${medicalCase.patientName}
Condition: ${medicalCase.condition}
Hospital: ${medicalCase.hospital}
Clinical challenge: ${medicalCase.aiSummary?.challenge ?? "N/A"}
Proposed solution: ${medicalCase.aiSummary?.solution ?? "N/A"}`;

    return await callGemini(prompt);
  } catch (err) {
    console.warn("[aiService] generateCaseSummary falling back to mock summary:", err.message);
    return fallback;
  }
}

export async function generateFormAssist({ patientName, condition, description }) {
  if (!description?.trim()) {
    return "Add a case description above, then request an AI-assisted rewrite.";
  }

  try {
    const prompt = `You are a medical communications assistant for CareBridge. A hospital
administrator has entered a raw clinical case description. Rewrite it as a short,
donor-friendly narrative (2-3 sentences) that preserves clinical accuracy but reads
naturally to a non-medical audience. Do not invent facts beyond what's given.

Patient: ${patientName || "the patient"}
Condition: ${condition || "not specified"}
Raw description: ${description}`;

    return await callGemini(prompt);
  } catch (err) {
    console.warn("[aiService] generateFormAssist unavailable:", err.message);
    return "AI assist is unavailable right now (check GEMINI_API_KEY on the server). Your original description will be used as-is.";
  }
}
