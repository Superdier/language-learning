import { AI_PROMPTS } from "../utils/constants";

/**
 * Mock AI Service - Sử dụng responses mẫu
 * Trong production, thay bằng OpenAI API thực
 */

const mockResponses = {
  checkSentence: {
    correct: {
      isCorrect: true,
      message: "✅ Câu của bạn đúng ngữ pháp!",
      suggestions: [],
    },
    incorrect: {
      isCorrect: false,
      message: "❌ Câu có một số lỗi cần sửa:",
      suggestions: [
        'Ngữ pháp: Nên dùng "を" thay vì "に" cho tân ngữ trực tiếp',
        'Từ vựng: "食べます" phù hợp hơn "食う" trong văn viết lịch sự',
        "Cấu trúc: Thứ tự từ nên là: Chủ ngữ + は + Tân ngữ + を + Động từ",
      ],
      correctedSentence: "私は朝ごはんを食べます。",
    },
  },
  explainError: {
    explanation:
      "📚 Giải thích chi tiết:\n\n" +
      '1. Ngữ pháp "〜ている" diễn tả hành động đang tiếp diễn hoặc trạng thái.\n' +
      '2. Trong câu này, bạn đã dùng "〜てある" là sai vì "〜てある" diễn tả trạng thái đã được chuẩn bị sẵn.\n' +
      "3. Đáp án đúng: 窓が開いている (Cửa sổ đang mở)\n\n" +
      '💡 Mẹo: "〜ている" = đang làm gì, "〜てある" = đã làm gì sẵn rồi',
  },
  generateExample: [
    "私は毎日日本語を勉強しています。(Tôi học tiếng Nhật mỗi ngày)",
    "彼女は図書館で本を読んでいます。(Cô ấy đang đọc sách ở thư viện)",
    "友達と映画を見に行きたいです。(Tôi muốn đi xem phim với bạn)",
  ],
  suggestWriting: {
    topic: "今日の出来事",
    suggestions: [
      "朝ごはんに何を食べましたか？",
      "今日はどこに行きましたか？",
      "友達に会いましたか？",
      "今日の天気はどうでしたか？",
      "何か面白いことがありましたか？",
    ],
    template: "今日は___に行って、___をしました。とても___でした。",
  },
};

/**
 * Check sentence grammar and vocabulary
 */
export const checkSentence = async (
  sentence,
  grammarPoints = [],
  vocabulary = []
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock logic: Check if sentence has common patterns
  const hasCommonErrors =
    sentence.includes("に食べる") ||
    sentence.includes("が行く") ||
    sentence.length < 5;

  if (hasCommonErrors) {
    return mockResponses.checkSentence.incorrect;
  }

  return mockResponses.checkSentence.correct;
};

/**
 * Explain error with detailed explanation
 */
export const explainError = async (question, userAnswer, correctAnswer) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    question,
    userAnswer,
    correctAnswer,
    explanation: mockResponses.explainError.explanation,
  };
};

/**
 * Generate example sentences
 */
export const generateExampleSentences = async (
  grammarPoint,
  vocabularyList,
  difficulty = "normal"
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const examples = mockResponses.generateExample;

  return {
    grammarPoint,
    vocabulary: vocabularyList,
    difficulty,
    examples: examples.map((ex, idx) => ({
      id: idx + 1,
      sentence: ex.split("(")[0].trim(),
      translation: ex.split("(")[1]?.replace(")", "") || "",
    })),
  };
};

/**
 * Suggest writing topics and guidance
 */
export const suggestWritingTopic = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockResponses.suggestWriting;
};

/**
 * Check diary entry
 */
export const checkDiaryEntry = async (content) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const errorCount = Math.floor(Math.random() * 3);

  return {
    errorCount,
    errors:
      errorCount > 0
        ? [
            {
              line: 1,
              type: "grammar",
              message: 'Nên dùng "〜ています" thay vì "〜ている"',
            },
            {
              line: 2,
              type: "vocabulary",
              message: 'Từ "美味しい" phù hợp hơn "うまい" trong nhật ký',
            },
          ].slice(0, errorCount)
        : [],
    suggestions: [
      "Cấu trúc câu tốt, tiếp tục phát huy!",
      "Thử thêm một số liên từ để câu mượt mà hơn",
      "Vocabulary phong phú, rất tốt!",
    ],
    overallScore: 85 + Math.floor(Math.random() * 15),
  };
};

/**
 * Call actual OpenAI API (for production)
 * Uncomment and configure when ready to use
 */

export const callOpenAI = async (prompt, model = "gpt-3.5-turbo") => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  if (!API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "あなたは日本語教師です。学習者の文章をチェックして、改善点を提案してください。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

/**
 * Call actual Google Gemini API (for production)
 * Uncomment and configure when ready to use
 */

export const callGoogleGemini = async (prompt) => {
  const API_KEY = process.env.VITE_REACT_APP_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("Google Gemini API key not configured");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    // Trả về nội dung sinh ra
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Google Gemini API error:", error);
    throw error;
  }
};
