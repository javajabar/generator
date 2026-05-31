const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT) || 8090;
loadEnv(path.join(root, ".env"));

const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const imageModel = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const apiKey = process.env.GEMINI_API_KEY;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/idea") {
      await handleIdeaRequest(req, res);
      return;
    }

    if (url.pathname === "/api/idea-image") {
      await handleIdeaImageRequest(req, res);
      return;
    }

    serveStatic(url.pathname, res);
  } catch (error) {
    sendJson(res, 500, { error: "internal_error", message: error.message });
  }
});

server.listen(port, () => {
  console.log(`Idea generator: http://127.0.0.1:${port}`);
});

async function handleIdeaRequest(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!apiKey) {
    sendJson(res, 503, { error: "missing_api_key" });
    return;
  }

  const body = await readJson(req);
  const prompt = buildPrompt(body);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
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
}

async function handleIdeaImageRequest(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!apiKey) {
    sendJson(res, 503, { error: "missing_api_key" });
    return;
  }

  const body = await readJson(req);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${imageModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildImagePrompt(body) }] }],
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
}

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
    text: String(idea.text || "Попробуй маленький эксперимент на 10 минут и запиши, что изменилось.").slice(0, 520),
    tags: tags.map((tag) => String(tag).toLowerCase()).slice(0, 3),
    energy: Math.min(5, Math.max(1, Number(idea.energy) || 3)),
    source: "gemini",
  };
}

function buildImagePrompt(context) {
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

function serveStatic(urlPath, res) {
  const cleanPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  const filePath = path.normalize(path.join(root, cleanPath));

  if (!filePath.startsWith(root)) {
    sendJson(res, 403, { error: "forbidden" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: "not_found" });
      return;
    }

    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        req.destroy();
        reject(new Error("request_too_large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
