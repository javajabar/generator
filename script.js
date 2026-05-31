const interests = [
  "музыка",
  "еда",
  "город",
  "творчество",
  "технологии",
  "спорт",
  "люди",
  "дом",
  "саморазвитие",
  "кино",
  "игры",
  "природа",
];

const ideaBank = [
  {
    title: "Собери саундтрек чужого дня",
    text: "Выбери случайного прохожего из окна или памяти и составь для него плейлист из 5 треков: утро, дорога, конфликт, пауза, титры.",
    tags: ["музыка", "творчество", "люди"],
    time: ["quick", "medium"],
    moods: ["curious", "quiet"],
    energy: 2,
    solo: true,
  },
  {
    title: "Устрой ревизию вкуса",
    text: "Возьми три обычных продукта дома и придумай из них мини-закуску с ресторанным названием. Главное правило: красиво подать, даже если это абсурдно.",
    tags: ["еда", "дом", "творчество"],
    time: ["quick", "medium"],
    moods: ["tired", "curious"],
    energy: 2,
    solo: true,
  },
  {
    title: "Пройди маршрут наоборот",
    text: "Построй короткую прогулку так, будто ты турист в своем районе: один двор, одна вывеска, одна странная деталь, один кадр на память.",
    tags: ["город", "природа", "творчество"],
    time: ["medium", "deep"],
    moods: ["restless", "curious"],
    energy: 4,
    solo: true,
  },
  {
    title: "Сделай трейлер к обычному предмету",
    text: "Выбери вещь рядом и сними 20-секундный драматичный трейлер: крупный план, поворот, тайна, финальный кадр. Без монтажа тоже считается.",
    tags: ["кино", "творчество", "дом"],
    time: ["quick"],
    moods: ["restless", "curious"],
    energy: 3,
    solo: true,
  },
  {
    title: "Запусти микро-лабораторию",
    text: "Проверь маленькую гипотезу: какая чашка дольше держит тепло, какой свет делает комнату уютнее, какой порядок иконок быстрее. Запиши результат в одну строку.",
    tags: ["технологии", "дом", "саморазвитие"],
    time: ["quick", "medium"],
    moods: ["curious", "quiet"],
    energy: 2,
    solo: true,
  },
  {
    title: "Сделай карту своих 10 минут",
    text: "Поставь таймер на 10 минут и нарисуй карту всего, что слышишь, видишь и чувствуешь. Не красиво, а точно.",
    tags: ["творчество", "саморазвитие", "дом"],
    time: ["quick"],
    moods: ["tired", "quiet"],
    energy: 1,
    solo: true,
  },
  {
    title: "Собери челлендж для друга",
    text: "Отправь человеку три варианта маленького задания на выбор: снять цвет дня, найти самую смешную вывеску, придумать название своей текущей главы.",
    tags: ["люди", "город", "творчество"],
    time: ["quick", "medium"],
    moods: ["social", "restless"],
    energy: 3,
    solo: false,
  },
  {
    title: "Пересобери комнату одним жестом",
    text: "Поменяй только один элемент: свет, запах, музыку, плед, расположение стула. Задача - чтобы комната стала похожа на другое время суток.",
    tags: ["дом", "творчество"],
    time: ["quick"],
    moods: ["tired", "quiet"],
    energy: 1,
    solo: true,
  },
  {
    title: "Сделай игру из реальности",
    text: "Придумай себе 5 достижений на сегодня: найти красный объект, пройти 1000 шагов, сказать кому-то теплую фразу, выкинуть одну лишнюю вещь.",
    tags: ["игры", "спорт", "саморазвитие"],
    time: ["medium", "deep"],
    moods: ["restless", "curious"],
    energy: 3,
    solo: true,
  },
  {
    title: "Проведи переговоры с будущим собой",
    text: "Запиши голосовое на 60 секунд человеку, которым ты будешь через месяц: что ему стоит помнить, что проверить, чему не верить.",
    tags: ["саморазвитие", "творчество"],
    time: ["quick"],
    moods: ["quiet", "tired"],
    energy: 1,
    solo: true,
  },
  {
    title: "Собери слепой рейтинг",
    text: "Попроси друга назвать 5 случайных слов, а потом преврати их в рейтинг: названия групп, странные суперсилы или блюда будущего.",
    tags: ["люди", "игры", "творчество"],
    time: ["quick"],
    moods: ["social", "restless"],
    energy: 2,
    solo: false,
  },
  {
    title: "Сделай тренировку как квест",
    text: "Выбери 4 точки дома или во дворе. На каждой выполни другое действие: баланс, приседания, растяжка, быстрый шаг. Вернись как после миссии.",
    tags: ["спорт", "дом", "игры"],
    time: ["quick", "medium"],
    moods: ["restless", "tired"],
    energy: 4,
    solo: true,
  },
  {
    title: "Придумай интерфейс для эмоции",
    text: "Нарисуй экран приложения для своего текущего настроения: какие там кнопки, ошибки, уведомления и режим энергосбережения?",
    tags: ["технологии", "творчество", "саморазвитие"],
    time: ["medium"],
    moods: ["curious", "quiet"],
    energy: 2,
    solo: true,
  },
  {
    title: "Сними одну сцену без сюжета",
    text: "Найди место, где что-то движется само: пар, шторы, тени, вода, люди на расстоянии. Сними 15 секунд так, будто это начало фильма.",
    tags: ["кино", "город", "природа"],
    time: ["quick", "medium"],
    moods: ["quiet", "curious"],
    energy: 2,
    solo: true,
  },
  {
    title: "Сделай музей одного ящика",
    text: "Открой любой ящик и разложи 7 предметов как экспонаты. Дай каждому название, год и драматичное описание в одну фразу.",
    tags: ["дом", "творчество", "игры"],
    time: ["quick"],
    moods: ["tired", "curious"],
    energy: 2,
    solo: true,
  },
  {
    title: "Поймай цвет дня",
    text: "Выбери один цвет и найди вокруг 8 его оттенков. Последний должен быть самым неожиданным. Сохрани фото-коллаж или просто список.",
    tags: ["творчество", "город", "природа"],
    time: ["quick", "medium"],
    moods: ["quiet", "curious"],
    energy: 2,
    solo: true,
  },
];

const storageKey = "boredomIdeaGenerator";
let state = {
  interests: [],
  time: "quick",
  mood: "curious",
  energy: 3,
  solo: true,
  history: [],
  disliked: [],
  onboarded: false,
};
let currentIdea = null;

const els = {
  ideaMeta: document.querySelector("#ideaMeta"),
  ideaTitle: document.querySelector("#ideaTitle"),
  ideaText: document.querySelector("#ideaText"),
  generateBtn: document.querySelector("#generateBtn"),
  skipBtn: document.querySelector("#skipBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  settingsToggle: document.querySelector("#settingsToggle"),
  closeSettings: document.querySelector("#closeSettings"),
  settingsPanel: document.querySelector("#settingsPanel"),
  settingsForm: document.querySelector("#settingsForm"),
  interestChips: document.querySelector("#interestChips"),
  onboarding: document.querySelector("#onboarding"),
  onboardingChips: document.querySelector("#onboardingChips"),
  finishOnboarding: document.querySelector("#finishOnboarding"),
  timeSelect: document.querySelector("#timeSelect"),
  moodSelect: document.querySelector("#moodSelect"),
  energyRange: document.querySelector("#energyRange"),
  soloToggle: document.querySelector("#soloToggle"),
  historyList: document.querySelector("#historyList"),
  clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
  toast: document.querySelector("#toast"),
};

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  try {
    state = { ...state, ...JSON.parse(saved) };
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderChips(container, selected, onToggle) {
  container.innerHTML = "";
  interests.forEach((interest) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${selected.includes(interest) ? "is-selected" : ""}`;
    button.textContent = interest;
    button.addEventListener("click", () => onToggle(interest));
    container.append(button);
  });
}

function syncForm() {
  els.timeSelect.value = state.time;
  els.moodSelect.value = state.mood;
  els.energyRange.value = state.energy;
  els.soloToggle.checked = state.solo;

  renderChips(els.interestChips, state.interests, (interest) => {
    toggleInterest(interest);
    syncForm();
  });
}

function toggleInterest(interest) {
  state.interests = state.interests.includes(interest)
    ? state.interests.filter((item) => item !== interest)
    : [...state.interests, interest];
  saveState();
}

function scoreIdea(idea) {
  const interestScore = idea.tags.filter((tag) => state.interests.includes(tag)).length * 5;
  const timeScore = idea.time.includes(state.time) ? 3 : 0;
  const moodScore = idea.moods.includes(state.mood) ? 3 : 0;
  const soloScore = state.solo || idea.solo ? 2 : -5;
  const energyScore = 4 - Math.abs(Number(state.energy) - idea.energy);
  const dislikedPenalty = state.disliked.includes(idea.title) ? -100 : 0;
  const recentPenalty = state.history.slice(0, 5).some((item) => item.title === idea.title) ? -40 : 0;
  return interestScore + timeScore + moodScore + soloScore + energyScore + dislikedPenalty + recentPenalty;
}

function pickIdea() {
  const scored = ideaBank
    .map((idea) => ({ idea, score: scoreIdea(idea) + Math.random() * 2 }))
    .sort((a, b) => b.score - a.score);

  return scored[0].score < -20
    ? ideaBank[Math.floor(Math.random() * ideaBank.length)]
    : scored[0].idea;
}

function showIdea(idea, addToHistory = true) {
  currentIdea = idea;
  els.ideaMeta.textContent = `${idea.tags.slice(0, 3).join(" / ")} · энергия ${idea.energy}/5`;
  els.ideaTitle.textContent = idea.title;
  els.ideaText.textContent = idea.text;

  if (addToHistory) {
    state.history = [
      {
        title: idea.title,
        text: idea.text,
        meta: els.ideaMeta.textContent,
        date: new Date().toISOString(),
      },
      ...state.history.filter((item) => item.title !== idea.title),
    ].slice(0, 12);
    saveState();
    renderHistory();
  }
}

function renderHistory() {
  els.historyList.innerHTML = "";
  if (state.history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Тут появятся идеи, которые ты уже получал.";
    els.historyList.append(empty);
    return;
  }

  state.history.forEach((item) => {
    const article = document.createElement("article");
    article.className = "history-item";
    article.innerHTML = `<strong></strong><p></p>`;
    article.querySelector("strong").textContent = item.title;
    article.querySelector("p").textContent = item.text;
    article.addEventListener("click", () => showIdea(item, false));
    els.historyList.append(article);
  });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}

async function shareIdea() {
  if (!currentIdea) {
    showToast("Сначала сгенерируй идею");
    return;
  }

  const text = `${currentIdea.title}\n${currentIdea.text}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: currentIdea.title, text });
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("Идея скопирована");
  } catch {
    showToast("Не получилось поделиться");
  }
}

function setupOnboarding() {
  renderChips(els.onboardingChips, state.interests, toggleOnboardingInterest);
  els.onboarding.classList.toggle("is-visible", !state.onboarded);
}

function toggleOnboardingInterest(interest) {
  toggleInterest(interest);
  syncForm();
  setupOnboarding();
}

function init() {
  loadState();
  syncForm();
  setupOnboarding();
  renderHistory();

  if (state.history[0]) {
    showIdea(state.history[0], false);
  }

  els.generateBtn.addEventListener("click", () => showIdea(pickIdea()));
  els.skipBtn.addEventListener("click", () => {
    if (currentIdea && !state.disliked.includes(currentIdea.title)) {
      state.disliked = [...state.disliked, currentIdea.title].slice(-20);
    }
    showIdea(pickIdea());
  });
  els.shareBtn.addEventListener("click", shareIdea);
  els.clearHistoryBtn.addEventListener("click", () => {
    state.history = [];
    saveState();
    renderHistory();
    showToast("История очищена");
  });

  els.settingsToggle.addEventListener("click", () => els.settingsPanel.classList.toggle("is-open"));
  els.closeSettings.addEventListener("click", () => els.settingsPanel.classList.remove("is-open"));

  els.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.time = els.timeSelect.value;
    state.mood = els.moodSelect.value;
    state.energy = Number(els.energyRange.value);
    state.solo = els.soloToggle.checked;
    saveState();
    showToast("Настройки сохранены");
  });

  els.finishOnboarding.addEventListener("click", () => {
    if (state.interests.length === 0) {
      showToast("Выбери хотя бы один интерес");
      return;
    }

    state.onboarded = true;
    saveState();
    els.onboarding.classList.remove("is-visible");
    syncForm();
    showIdea(pickIdea());
  });
}

init();
