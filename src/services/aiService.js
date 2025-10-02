import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_AI_API_KEY || ""
);

/**
 * Check if API key is configured
 */
const isConfigured = () => {
  return !!import.meta.env.VITE_GOOGLE_AI_API_KEY;
};

/**
 * Call Gemini API
 */
export const callGemini = async (prompt, useJson = false) => {
  if (!isConfigured()) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: useJson
        ? {
            temperature: 0.2,
            topK: 1,
            topP: 1,
          }
        : undefined,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (useJson) {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    }

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

/**
 * Check sentence grammar and vocabulary
 */
export const checkSentence = async (
  sentence,
  grammarPoints = [],
  vocabulary = []
) => {
  if (!isConfigured()) {
    // Return mock response if API not configured
    return {
      isCorrect: Math.random() > 0.5,
      message: "Demo mode - Gemini API chưa được cấu hình",
      suggestions: [
        "Đây là phản hồi demo",
        "Vui lòng cấu hình VITE_GOOGLE_AI_API_KEY",
      ],
      correctedSentence: sentence,
    };
  }

  const prompt = `あなたは日本語教師です。以下の文をチェックして、文法と語彙の誤りを指摘してください。

文: ${sentence}
${grammarPoints.length > 0 ? `使用する文法: ${grammarPoints.join(", ")}` : ""}
${vocabulary.length > 0 ? `使用する語彙: ${vocabulary.join(", ")}` : ""}

JSONフォーマットで返答してください:
{
  "isCorrect": true/false,
  "message": "評価メッセージ",
  "suggestions": ["改善点1", "改善点2"],
  "correctedSentence": "正しい文"
}`;

  try {
    const response = await callGemini(prompt, true);
    return response;
  } catch (error) {
    console.error("Check sentence error:", error);
    throw error;
  }
};

/**
 * Explain error with detailed explanation
 */
export const explainError = async (question, userAnswer, correctAnswer) => {
  if (!isConfigured()) {
    return {
      question,
      userAnswer,
      correctAnswer,
      explanation:
        "Demo mode - Gemini API chưa được cấu hình. Vui lòng thêm VITE_GOOGLE_AI_API_KEY vào environment variables.",
    };
  }

  const prompt = `あなたは日本語教師です。学習者の誤りを詳しく説明してください。

問題: ${question}
学習者の答え: ${userAnswer}
正しい答え: ${correctAnswer}

以下の形式で詳しく説明してください:
1. なぜ学習者の答えが間違っているのか
2. 正しい答えの文法的な説明
3. 覚えやすいコツやヒント

ベトナム語で説明してください。`;

  try {
    const explanation = await callGemini(prompt);
    return {
      question,
      userAnswer,
      correctAnswer,
      explanation,
    };
  } catch (error) {
    console.error("Explain error:", error);
    throw error;
  }
};

/**
 * Generate example sentences
 */
export const generateExampleSentences = async (
  grammarPoint,
  vocabularyList,
  difficulty = "normal"
) => {
  if (!isConfigured()) {
    return {
      grammarPoint,
      vocabulary: vocabularyList,
      difficulty,
      examples: [
        { id: 1, sentence: "Demo sentence 1", translation: "Câu mẫu demo 1" },
        { id: 2, sentence: "Demo sentence 2", translation: "Câu mẫu demo 2" },
        { id: 3, sentence: "Demo sentence 3", translation: "Câu mẫu demo 3" },
      ],
    };
  }

  const difficultyMap = {
    easy: "簡単",
    normal: "普通",
    hard: "難しい",
  };

  const prompt = `あなたは日本語教師です。以下の文法と語彙を使って例文を3つ作成してください。

文法: ${grammarPoint}
語彙: ${vocabularyList.join(", ")}
難易度: ${difficultyMap[difficulty]}

JSONフォーマットで返答してください:
{
  "examples": [
    {
      "id": 1,
      "sentence": "日本語の例文",
      "translation": "ベトナム語の訳"
    },
    ...
  ]
}`;

  try {
    const response = await callGemini(prompt, true);
    return {
      grammarPoint,
      vocabulary: vocabularyList,
      difficulty,
      examples: response.examples,
    };
  } catch (error) {
    console.error("Generate examples error:", error);
    throw error;
  }
};

/**
 * Suggest writing topics and guidance
 */
export const suggestWritingTopic = async () => {
  if (!isConfigured()) {
    return {
      topic: "今日の出来事 (Demo)",
      suggestions: [
        "朝ごはんに何を食べましたか？",
        "今日はどこに行きましたか？",
        "友達に会いましたか？",
      ],
      template: "今日は___に行って、___をしました。とても___でした。",
    };
  }

  const prompt = `あなたは日本語教師です。日本語学習者のために日記のトピックと書き方のガイドを提案してください。

以下のJSONフォーマットで返答してください:
{
  "topic": "トピック名",
  "suggestions": [
    "質問1",
    "質問2",
    "質問3",
    "質問4",
    "質問5"
  ],
  "template": "文のテンプレート"
}

トピックは日常生活に関するものにしてください。質問はベトナム語で書いてください。`;

  try {
    const response = await callGemini(prompt, true);
    return response;
  } catch (error) {
    console.error("Suggest topic error:", error);
    throw error;
  }
};

/**
 * Check diary entry
 */
export const checkDiaryEntry = async (content) => {
  if (!isConfigured()) {
    return {
      errorCount: 0,
      errors: [],
      suggestions: ["Demo mode - Gemini API chưa được cấu hình"],
      overallScore: 85,
    };
  }

  const prompt = `あなたは日本語教師です。学習者の日記をチェックして、誤りを指摘し、改善点を提案してください。

日記:
${content}

以下のJSONフォーマットで返答してください:
{
  "errorCount": 誤りの数,
  "errors": [
    {
      "line": 行番号,
      "type": "grammar" または "vocabulary",
      "message": "ベトナム語での説明"
    }
  ],
  "suggestions": [
    "改善点1 (ベトナム語)",
    "改善点2 (ベトナム語)"
  ],
  "overallScore": 0-100の点数
}`;

  try {
    const response = await callGemini(prompt, true);
    return response;
  } catch (error) {
    console.error("Check diary error:", error);
    throw error;
  }
};

/**
 * Daily error analysis (batch process)
 */
export const analyzeDailyErrors = async (errors) => {
  if (!isConfigured() || errors.length === 0) {
    return [];
  }

  const prompt = `あなたは日本語教師です。学習者の今日の誤りを分析して、それぞれの誤りに対して詳しい説明を提供してください。

誤りリスト:
${errors
  .map(
    (e, i) =>
      `${i + 1}. 問題: ${e.question}\n   学習者の答え: ${
        e.userAnswer
      }\n   正しい答え: ${e.correctAnswer}`
  )
  .join("\n\n")}

JSONフォーマットで返答してください:
{
  "analyses": [
    {
      "errorId": エラーのID,
      "explanation": "詳しい説明 (ベトナム語)",
      "tip": "覚えやすいコツ (ベトナム語)"
    }
  ]
}`;

  try {
    const response = await callGemini(prompt, true);
    return response.analyses || [];
  } catch (error) {
    console.error("Analyze daily errors:", error);
    throw error;
  }
};
