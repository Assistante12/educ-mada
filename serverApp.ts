import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { OFFICIAL_CURRICULUM, LEVEL_CRITERIA, getCurriculumFallbackQuestion } from "./src/data/curriculumData";
import { getCurriculumLesson, isBogusGenericLesson } from "./src/data/lessonData";
import { GradeLevel, Question, LevelSessionResult, LessonRemediation } from "./src/types";

dotenv.config();

export const serverApp = express();

serverApp.use(express.json({ limit: "5mb" }));

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

// In-memory cache for generated lessons to optimize performance and prevent rate-limit exhaustion
const serverLessonsCache = new Map<string, LessonRemediation>();

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

// Create dedicated API router
const apiRouter = express.Router();

// 1. Health check
apiRouter.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel" : (process.env.RENDER ? "render" : "node")
  });
});

// 2. Curriculum information & official references
apiRouter.get("/curriculum", (req, res) => {
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

// 3. Generate Question with multi-tiered resilience (Primary AI -> Secondary AI -> Curriculum Seed)
apiRouter.post("/exercises/generate", async (req, res) => {
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
    const isRateLimitOrQuota = 
      primaryErr?.status === 429 || 
      primaryErr?.message?.includes("429") || 
      primaryErr?.message?.includes("RESOURCE_EXHAUSTED") || 
      primaryErr?.message?.includes("quota") ||
      primaryErr?.message?.includes("Quota");

    const isOverloadedOrUnavailable = primaryErr?.message?.includes("503") || 
      primaryErr?.message?.includes("UNAVAILABLE") || 
      primaryErr?.message?.includes("demand") ||
      primaryErr?.message?.includes("Timeout") ||
      primaryErr?.status === 503;

    if (isRateLimitOrQuota) {
      console.info("[Exercises AI] Primary model quota reached, trying fallback model...");
    } else if (isOverloadedOrUnavailable) {
      console.info("[Exercises AI] Gemini 3.8-flash experiencing high demand/timeout, falling back...");
    } else {
      console.info("[Exercises AI] Primary attempt failed:", primaryErr?.message || "Unavailable");
    }

    // Tier 2: Try Secondary model (gemini-flash-latest) with 4s timeout
    try {
      activeModel = "gemini-flash-latest";
      response = await callGeminiModel(ai, "gemini-flash-latest", systemPrompt, userPrompt, 4000);
    } catch (fallbackErr: any) {
      console.info("[Exercises AI] Secondary AI also unavailable, serving verified curriculum question.");
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

// 4. Submit session and calculate official validation / redoublement
apiRouter.post("/exercises/submit-session", (req, res) => {
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
  // Level score is out of 2 points (10 levels * 2 points = 20 points total for the subject)
  const levelScoreOutOf2 = Math.round(((correctCount / totalQuestions) * 2) * 10) / 10;
  const scoreOutOf20 = Math.round(((correctCount / totalQuestions) * 20) * 10) / 10;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Validation rule: Level validated if score >= 1.2 / 2 points (equivalent to 12/20 rate)
  const status: "VALIDE" | "REDOUBLE" = levelScoreOutOf2 >= 1.2 ? "VALIDE" : "REDOUBLE";

  const result: LevelSessionResult = {
    classId,
    serieId,
    subjectId,
    level,
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    levelScoreOutOf2,
    subjectTotalScoreOutOf20: 0,
    scoreOutOf20,
    percentage,
    status,
    completedAt: new Date().toISOString(),
    answers
  };

  res.json({
    result,
    rule: {
      passingThresholdOutOf2: 1.2,
      passed: status === "VALIDE",
      message: status === "VALIDE"
        ? "FÉLICITATIONS ! VALIDÉ — Niveau réussi avec au moins 1.2/2 points."
        : "ATTENTION : REDOUBLE — Note inférieure à 1.2/2 points. Vous devez refaire ce niveau."
    }
  });
});

// 5. Generate / Fetch Comprehensive Lesson & Remediation Sheet (Workspace Lesoka & Lesona)
apiRouter.post("/lessons/generate", async (req, res) => {
  const { classId, serieId, subjectId, level = 1, specificStruggle = "", language = 'fr' } = req.body;

  if (!classId || !subjectId) {
    res.status(400).json({ error: "classId et subjectId sont obligatoires" });
    return;
  }

  const isMalagasySubject = subjectId.toLowerCase().includes('malagasy');
  const requestedLang: 'fr' | 'mg' = isMalagasySubject ? 'mg' : (language === 'mg' ? 'mg' : 'fr');

  const curriculumObj = OFFICIAL_CURRICULUM[classId as GradeLevel];
  let subjectInfo = curriculumObj?.subjects?.find(s => s.id === subjectId);
  if (!subjectInfo && curriculumObj?.series && serieId) {
    const serieObj = curriculumObj.series.find(s => s.id === serieId);
    subjectInfo = serieObj?.subjects.find(s => s.id === subjectId);
  }

  const subjectName = subjectInfo ? subjectInfo.name : subjectId;
  const themesList = subjectInfo ? subjectInfo.themes.join(", ") : "Programme officiel";
  const levelInfo = LEVEL_CRITERIA[level] || LEVEL_CRITERIA[1];

  const cacheKey = `${classId}_${serieId || 'all'}_${subjectId}_lvl${level}_${requestedLang}`;
  if (!specificStruggle && serverLessonsCache.has(cacheKey)) {
    const cached = serverLessonsCache.get(cacheKey);
    if (cached && !isBogusGenericLesson(cached)) {
      res.json({ lesson: cached, mode: "firestore_cache" });
      return;
    } else {
      serverLessonsCache.delete(cacheKey);
    }
  }

  const ai = getGenAI();

  if (!ai) {
    const fallbackLesson = getCurriculumLesson(classId, subjectId, level, serieId, requestedLang);
    if (!isBogusGenericLesson(fallbackLesson)) {
      serverLessonsCache.set(cacheKey, fallbackLesson);
    }
    res.json({ lesson: fallbackLesson, mode: "curriculum_fallback", note: "API key not configured" });
    return;
  }

  const systemPrompt = `
Vous êtes un professeur émérite et inspecteur pédagogique de référence du Ministère de l'Éducation Nationale de Madagascar (MEN).
Vous concevez des fiches de cours officielles approfondies, claires et exhaustives pour les candidats (CEPE, BEPC, BACCALAURÉAT).

RÈGLES CAPITALES DE RÉDACTION ET DE MISE EN FORME :
1. LANGUE OFFICIELLE OBLIGATOIRE :
${requestedLang === 'fr' 
  ? '- Rédigez l\'INTÉGRALITÉ du cours (titre, objectifs, cours théorique, erreurs fréquentes, méthodologie, exemple résolu pas à pas) en FRANÇAIS, langue officielle d\'évaluation aux examens nationaux malgaches pour cette matière.'
  : '- Rédigez l\'intégralité du cours en MALAGASY (Fiteny Reny) selon les normes académiques officielles de Madagascar.'}

2. NOTATION MATHÉMATIQUE ET SCIENTIFIQUE STRICTE (INTERDICTION DU STYLE CODE INFORMATIQUE) :
- INTERDICTION FORMELLE d'utiliser le caractère '*' pour exprimer une multiplication. Utilisez EXCLUSIVEMENT le signe typographique officiel '×' (ex: 24 × 5 = 120, P = m × g, U = R × I, ou LaTeX \\times).
- INTERDICTION FORMELLE d'utiliser la barre oblique simple '/' pour représenter une division arithmétique. Utilisez EXCLUSIVEMENT le signe officiel '÷' (ex: 120 ÷ 4 = 30) ou une fraction bien formée en notation LaTeX (ex: \\frac{a}{b} ou v = d ÷ t).
- Rédigez des formules avec clarté professionnelle, unités du Système International (m, s, kg, N, W, V, A, J), et étapes détaillées.

3. INTERDICTION DES CONSEILS GÉNÉRIQUES VIDES :
- TSY TOROLÀLANA ANKAPOBENY MOMBA NY FOMBA FIANARANA NO ILAINA.
- Fournissez un VRAI COURS DIDACTIQUE SUBSTANTIEL : définitions exactes, théorèmes, lois scientifiques, formules complètes expliquées, et un EXEMPLE D'APPLICATION RÉSOLU PAS À PAS avec de vrais calculs numériques et la solution finale encadrée.

CADRE OFFICIEL DU MINISTÈRE (MEN MADAGASCAR) :
- Classe : ${classId} ${serieId ? `(${serieId})` : ''}
- Matière : ${subjectName}
- Chapitre officiel : ${themesList}
- Niveau d'approfondissement : Niveau ${level} / 10 (${levelInfo.title})
${specificStruggle ? `- Question ou point particulier soulevé par l'élève : "${specificStruggle}"` : ''}
`;

  const userPrompt = requestedLang === 'fr'
    ? `Rédigez le cours officiel complet (avec définitions, formules utilisant « × » et « ÷ », et un exemple résolu pas à pas) pour la matière ${subjectName}, Classe ${classId} ${serieId || ''}, Niveau ${level}/10.`
    : `Ataovy fikarohana sy famelabelarana ny tena LESONA MIVAINGANA (Résumé complet + Fanazavana sy Raikipohy mampiasa « × » sy « ÷ » + Exemple amin'ny fanaovana azy) ho an'ny ${subjectName}, Kilasy ${classId} ${serieId || ''}, Niveau ${level}/10.`;

  let response: any = null;
  const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest"];

  for (const modelName of modelsToTry) {
    try {
      response = await withTimeout(
        ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                theme: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                coreTheory: { type: Type.ARRAY, items: { type: Type.STRING } },
                commonMistakes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mistake: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      correction: { type: Type.STRING }
                    },
                    required: ["mistake", "explanation", "correction"]
                  }
                },
                methodology: { type: Type.ARRAY, items: { type: Type.STRING } },
                solvedExample: {
                  type: Type.OBJECT,
                  properties: {
                    problem: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    finalAnswer: { type: Type.STRING }
                  },
                  required: ["problem", "steps", "finalAnswer"]
                },
                keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                officialReference: { type: Type.STRING }
              },
              required: ["title", "theme", "objectives", "coreTheory", "commonMistakes", "methodology", "solvedExample", "keyTakeaways", "officialReference"]
            }
          }
        }),
        7000,
        `Lesson AI timeout on ${modelName}`
      );
      if (response) break;
    } catch (err: any) {
      const isRateLimitOrQuota =
        err?.status === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.message?.includes("quota") ||
        err?.message?.includes("Quota");

      if (isRateLimitOrQuota) {
        console.info(`[Lesson AI] Model ${modelName} quota reached. Checking fallback options...`);
      } else {
        console.info(`[Lesson AI] Model ${modelName} unavailable: ${err?.message || "Error"}`);
      }
    }
  }

  if (response) {
    try {
      const jsonText = response.text?.trim() || "{}";
      const parsed = JSON.parse(jsonText);

      if (parsed.title && Array.isArray(parsed.coreTheory)) {
        const lesson: LessonRemediation = {
          id: `ai_les_${classId}_${subjectId}_lvl${level}_${Date.now()}`,
          classId,
          serieId,
          subjectId,
          subjectName,
          level,
          title: parsed.title,
          theme: parsed.theme || "Programme Officiel",
          objectives: parsed.objectives || [],
          coreTheory: parsed.coreTheory || [],
          commonMistakes: parsed.commonMistakes || [],
          methodology: parsed.methodology || [],
          solvedExample: parsed.solvedExample || { problem: "", steps: [], finalAnswer: "" },
          keyTakeaways: parsed.keyTakeaways || [],
          officialReference: parsed.officialReference || `Programme Officiel MEN Madagascar - ${classId}`,
          language: requestedLang
        };

        if (!isBogusGenericLesson(lesson)) {
          if (!specificStruggle) {
            serverLessonsCache.set(cacheKey, lesson);
          }
          res.json({ lesson, mode: "ai_generated" });
          return;
        } else {
          console.warn("[Lesson AI] Model generated generic guidelines rather than authentic lesson. Switching to verified curriculum.");
        }
      }
    } catch (parseErr) {
      console.info("[Lesson AI] JSON parsing error, serving verified curriculum fallback.");
    }
  }

  // Fallback to verified curriculum lesson
  const fallbackLesson = getCurriculumLesson(classId, subjectId, level, serieId, requestedLang);
  if (!specificStruggle && !isBogusGenericLesson(fallbackLesson)) {
    serverLessonsCache.set(cacheKey, fallbackLesson);
  }
  res.json({ lesson: fallbackLesson, mode: "curriculum_fallback" });
});

// Dual mounting: matches both `/api/...` and `/...` for flexible hosting (Vercel Serverless, Express, Render)
serverApp.use("/api", apiRouter);
serverApp.use("/", apiRouter);

export default serverApp;
