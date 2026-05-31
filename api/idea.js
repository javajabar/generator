const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
    const prompt = buildPrompt(context);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 1.05,
            topP: 0.92,
            maxOutputTokens: 420,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: "gemini_error", message: text.slice(0, 500) });
      return;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      sendJson(res, 502, { error: "empty_gemini_response" });
      return;
    }

    sendJson(res, 200, { idea: normalizeIdea(JSON.parse(rawText)) });
  } catch (error) {
    sendJson(res, 500, { error: "idea_generation_failed", message: error.message });
  }
};

function buildPrompt(context) {
  const recentTitles = list(context.history) || "нет";
  const dislikedTitles = list(context.disliked) || "нет";
  const excluded = list(context.excludeTitles) || "нет";
  const modeHint = context.avoidCurrentTags
    ? "Сильно смени направление и формат."
    : "Попади точнее в контекст.";

  return `
Ты генератор небанальных идей, когда человеку скучно. Нужна одна конкретная идея на русском языке.

Контекст:
- интересы: ${list(context.interests) || "любые"}
- время: ${context.time || "quick"}
- настроение: ${context.mood || "curious"}
- энергия: ${context.energy || 3}/5
- желательно одному: ${context.solo ? "да" : "не обязательно"}
- недавно были: ${recentTitles}
- не понравились: ${dislikedTitles}
- исключить прямо сейчас: ${excluded}
- режим: ${modeHint}

Правила:
- не предлагай банальности вроде "почитай книгу", "посмотри фильм", "погуляй" без необычного задания;
- идея должна быть маленьким экспериментом, челленджем, сценарием или игрой;
- не нужно покупать дорогие вещи;
- не давай опасных, незаконных или унизительных заданий;
- ответ строго JSON без markdown.

Формат:
{
  "title": "короткое название до 55 символов",
  "text": "2-3 предложения с конкретными шагами",
  "tags": ["один", "два", "три"],
  "energy": 1
}
`;
}

function normalizeIdea(idea) {
  const tags = Array.isArray(idea.tags) && idea.tags.length > 0 ? idea.tags : ["gemini", "идея"];

  return {
    title: String(idea.title || "Необычная идея").slice(0, 80),
    text: String(
      idea.text || "Попробуй маленький эксперимент на 10 минут и запиши, что изменилось."
    ).slice(0, 520),
    tags: tags.map((tag) => String(tag).toLowerCase()).slice(0, 3),
    energy: Math.min(5, Math.max(1, Number(idea.energy) || 3)),
    source: "gemini",
  };
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}
