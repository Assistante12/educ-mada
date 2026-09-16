import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { OFFICIAL_CURRICULUM, SEED_QUESTIONS, LEVEL_CRITERIA, getCurriculumFallbackQuestion } from "./src/data/curriculumData";
import { GradeLevel, TerminaleSerie, Question, LevelSessionResult } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Timeout wrapper to guarantee fast response and prevent connection hangs
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage = "Timeout"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs))
  ]);
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Curriculum information & official references
app.get("/api/curriculum", (req, res) => {
  res.json({
    curriculum: OFFICIAL_CURRICULUM,
    levels: LEVEL_CRITERIA,
    metadata: {
      country: "Madagascar",
      authority: "Ministère de l'Éducation Nationale (MEN)",
      reforms: "Réforme officielle du Baccalauréat (Séries L, S, OSE), BEPC et CEPE",
      passingScore: 12,
      maxTimePerQuestionSeconds: 600,
    }
  });
});

// Helper to call Gemini with structured JSON output and specified model
async function callGeminiModel(
  ai: GoogleGenAI,
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number
) {
  return await withTimeout(
    ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, description: "Le chapitre ou thème officiel du programme malgache" },
            question: { type: Type.STRING, description: "L'énoncé clair et précis de la question" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Tableau de 4 choix de réponses distinctes [A, B, C, D]"
            },
            correctIndex: { type: Type.INTEGER, description: "L'indice de la réponse correcte (0, 1, 2 ou 3)" },
            explanation: { type: Type.STRING, description: "Explication pédagogique détaillée avec démarche de résolution" },
            source: { type: Type.STRING, description: "Référence officielle au programme scolaire malgache" }
          },
          required: ["theme", "question", "options", "correctIndex", "explanation", "source"]
        }
      }
    }),
    timeoutMs,
    `Model ${modelName} timed out after ${timeoutMs}ms`
  );
}

// 4. Generate Question with multi-tiered resilience (Primary AI -> Secondary AI -> Curriculum Seed)
app.post("/api/exercises/generate", async (req, res) => {
  const { classId, serieId, subjectId, level = 1, previousQuestionIds = [] } = req.body;

  if (!classId || !subjectId) {
    res.status(400).json({ error: "classId et subjectId sont obligatoires" });
    return;
  }

  // Find subject details from official curriculum
  const curriculumObj = OFFICIAL_CURRICULUM[classId as GradeLevel];
  let subjectInfo = curriculumObj?.subjects?.find(s => s.id === subjectId);
  if (!subjectInfo && curriculumObj?.series && serieId) {
    const serieObj = curriculumObj.series.find(s => s.id === serieId);
    subjectInfo = serieObj?.subjects.find(s => s.id === subjectId);
  }

  const subjectName = subjectInfo ? subjectInfo.name : subjectId;
  const themesList = subjectInfo ? subjectInfo.themes.join(", ") : "Programme général";
  const levelInfo = LEVEL_CRITERIA[level] || LEVEL_CRITERIA[1];

  const ai = getGenAI();

  if (!ai) {
    const fallback = getCurriculumFallbackQuestion(classId, subjectId, level, serieId, previousQuestionIds);
    res.json({ question: fallback, mode: "curriculum_seed", note: "API key not configured" });
    return;
  }

  const systemPrompt = `
Ianao dia manampahaizana manokana momba ny fanabeazana sy ny programme scolaire ofisialy eto Madagasikara (Ministère de l'Éducation Nationale - MEN Madagascar).
Ny asanao dia ny mamorona fanontaniana fanazarana (exercice scolaire) avo lenta, mifanaraka tanteraka amin'ny fandaharam-pianarana vaovao sy manan-kery amin'izao fotoana izao.

FEPETRA MAMPAHATSIARO (CRITÈRES STRICTS) :
1. Classe : ${classId} ${serieId ? `(Série : ${serieId})` : ""}
2. Matière : ${subjectName}
3. Thèmes / Chapitres possibles : ${themesList}
4. Niveau de difficulté : Niveau ${level} / 10 (${levelInfo.title} - ${levelInfo.description})
   - Niveau 1 : Tena mora, fototra, famaritana na kajy mivantana.
   - Niveau 2-3 : Fahatakarana tsotra ny lesona.
   - Niveau 4-6 : Fampiharana misy fandinihana (raisonnement) sy dingana maromaro.
   - Niveau 7-8 : Fanontaniana sarotra kokoa, mitovy amin'ny fanadinana ofisialy (CEPE, BEPC, Baccalauréat).
   - Niveau 9-10 : Tena sarotra, avo lenta, mitaky fahaizana lalina sy fandalinana matotra.
5. Fiteny ampiasaina :
   - Raha Malagasy ny matière : TENY MALAGASY madio sy mifanaraka amin'ny fitsipi-piteny ofisialy.
   - Raha Anglais : TENY ANGLAIS ny fanontaniana sy ny safidy.
   - Raha Mathématiques, Physique-Chimie, SVT, SES, Histoire-Géo, Philo, Français : Teny Frantsay na Malagasy mifanaraka amin'ny fampianarana ofisialy eto Madagasikara.
6. Aza mamerina fanontaniana efa nampiasaina.
7. Validation obligatoire :
   - Marina ny fanontaniana sy ny safidy.
   - Tsy maintsy misy safidy 4 mazava tsara (options).
   - Iray monja no marina (correctIndex entre 0 et 3).
   - Misy fanazavana (explanation) amin'ny antsipiriany : ny fomba fiasa (méthode de résolution), ny antony maha marina ny valiny, sy ny antony mahadiso ny hafa.
   - Soraty ny loharano (source) ofisialy (ex: "Programme MEN Madagascar - Baccalauréat Série ${serieId || ''}").
`;

  const userPrompt = `Mamoròna fanontaniana iray (1) ho an'ny ${subjectName} ho an'ny mpianatra ${classId} ${serieId || ''}, Niveau ${level}/10.`;

  let response: any = null;
  let activeModel = "gemini-3.8-flash";

  // Tier 1: Try Primary model (gemini-3.8-flash) with 6s timeout
  try {
    response = await callGeminiModel(ai, "gemini-3.8-flash", systemPrompt, userPrompt, 6000);
  } catch (primaryErr: any) {
    const isOverloadedOrUnavailable = primaryErr?.message?.includes("503") || 
      primaryErr?.message?.includes("UNAVAILABLE") || 
      primaryErr?.message?.includes("demand") ||
      primaryErr?.message?.includes("Timeout") ||
      primaryErr?.status === 503;

    if (isOverloadedOrUnavailable) {
      console.warn("Gemini 3.8-flash currently experiencing high demand/timeout, falling back to gemini-3.1-flash-lite...");
    } else {
      console.warn("Primary AI attempt failed:", primaryErr?.message || primaryErr);
    }

    // Tier 2: Try Secondary model (gemini-3.1-flash-lite) with 4s timeout
    try {
      activeModel = "gemini-3.1-flash-lite";
      response = await callGeminiModel(ai, "gemini-3.1-flash-lite", systemPrompt, userPrompt, 4000);
    } catch (fallbackErr: any) {
      console.warn("Secondary AI attempt also unavailable, serving verified curriculum question:", fallbackErr?.message || fallbackErr);
      response = null;
    }
  }

  // If AI generated a response, parse and validate it
  if (response) {
    try {
      const jsonText = response.text?.trim() || "{}";
      const parsed = JSON.parse(jsonText);

      if (
        parsed.question &&
        Array.isArray(parsed.options) &&
        parsed.options.length >= 4 &&
        typeof parsed.correctIndex === "number" &&
        parsed.correctIndex >= 0 &&
        parsed.correctIndex <= 3
      ) {
        const generatedQuestion: Question = {
          id: `ai_${classId}_${subjectId}_lvl${level}_${Date.now()}`,
          classId,
          serieId,
          subjectId,
          level,
          theme: parsed.theme || "Programme Officiel",
          question: parsed.question,
          options: parsed.options.slice(0, 4),
          correctIndex: parsed.correctIndex,
          explanation: parsed.explanation || "Explication validée selon le programme officiel malgache.",
          source: parsed.source || "Programme officiel MEN Madagascar"
        };

        res.json({ question: generatedQuestion, mode: "ai_generated", model: activeModel });
        return;
      }
    } catch (parseErr) {
      console.warn("Failed to parse AI JSON, using curriculum fallback:", parseErr);
    }
  }

  // Tier 3: Instant verified curriculum question
  const fallback = getCurriculumFallbackQuestion(classId, subjectId, level, serieId, previousQuestionIds);
  res.json({ question: fallback, mode: "curriculum_fallback" });
});

// 5. Submit session and calculate official validation / redoublement
app.post("/api/exercises/submit-session", (req, res) => {
  const { classId, serieId, subjectId, level, answers } = req.body;

  if (!classId || !subjectId || typeof level !== "number" || !Array.isArray(answers)) {
    res.status(400).json({ error: "Données de session incomplètes" });
    return;
  }

  const totalQuestions = answers.length;
  if (totalQuestions === 0) {
    res.status(400).json({ error: "La session ne contient aucune réponse" });
    return;
  }

  let correctCount = 0;
  for (const ans of answers) {
    if (ans.isCorrect === true || ans.selectedOptionIndex === ans.correctOptionIndex) {
      correctCount++;
    }
  }

  const incorrectCount = totalQuestions - correctCount;
  // Standard score calculated on /20
  const scoreOutOf20 = Math.round(((correctCount / totalQuestions) * 20) * 10) / 10;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // STRICT INVIOLABLE RULE OF THE MALAGASY SYSTEM & PROJECT:
  // Moyenne >= 12/20 -> VALIDE (Passage au niveau suivant)
  // Moyenne < 12/20 -> REDOUBLE (Doit refaire ce niveau)
  const status: "VALIDE" | "REDOUBLE" = scoreOutOf20 >= 12 ? "VALIDE" : "REDOUBLE";

  const result: LevelSessionResult = {
    classId,
    serieId,
    subjectId,
    level,
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    scoreOutOf20,
    percentage,
    status,
    completedAt: new Date().toISOString(),
    answers
  };

  res.json({
    result,
    rule: {
      passingThreshold: 12,
      passed: status === "VALIDE",
      message: status === "VALIDE"
        ? "FÉLICITATIONS ! VALIDÉ — Passage au niveau suivant accordé."
        : "ATTENTION : REDOUBLE — Moyenne inférieure à 12/20. Vous devez refaire ce niveau."
    }
  });
});

// 6. Vite middleware for development or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Plateforme Scolaire Madagascar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
