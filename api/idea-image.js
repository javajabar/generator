const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    sendJson(res, 503, { error: "missing_api_key" });
    return;
  }

  try {
    const context = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(context) }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: "gemini_image_error", message: text.slice(0, 500) });
      return;
    }

    const data = await response.json();
    const imagePart = data.candidates?.[0]?.content?.parts?.find((part) => part.inlineData);

    if (!imagePart?.inlineData?.data) {
      sendJson(res, 502, { error: "empty_image_response" });
      return;
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    sendJson(res, 200, { image: `data:${mimeType};base64,${imagePart.inlineData.data}` });
  } catch (error) {
    sendJson(res, 500, { error: "image_generation_failed", message: error.message });
  }
};

function buildPrompt(context) {
  return `
Create one polished editorial photo-style image for a Russian boredom idea generator card.

Idea title: ${context.title || "Необычная идея"}
Idea steps: ${context.text || ""}
Tags: ${list(context.tags) || "curiosity, creative"}
Mood: ${context.mood || "curious"}

Visual direction:
- warm minimal lifestyle photograph, not a poster
- show objects or a small scene that clearly hints at the activity
- no people faces, no readable text, no logos, no watermark
- clean composition with soft daylight, cream background, sage/ochre/peach accents
- landscape crop suitable for a website idea card
`;
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}
