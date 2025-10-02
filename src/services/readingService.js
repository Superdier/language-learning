import { callGemini } from "./aiService";

/**
 * Generate reading passage with questions
 */
export const generateReadingPassage = async (
  level,
  topic,
  type = "short_passage"
) => {
  const levelMap = {
    beginner: "N5-N4レベル",
    intermediate: "N3-N2レベル",
    advanced: "N1レベル",
  };

  const typeMap = {
    short_passage: "短い文章",
    article: "記事",
    dialogue: "会話",
    story: "物語",
  };

  const prompt = `あなたは日本語教師です。以下の条件で読解問題を作成してください。

レベル: ${levelMap[level]}
トピック: ${topic}
タイプ: ${typeMap[type]}

以下のJSONフォーマットで返答してください:
{
  "title": "タイトル (ベトナム語)",
  "passage": "日本語の文章",
  "translation": "ベトナム語の翻訳",
  "vocabulary": [
    {
      "word": "単語",
      "reading": "読み方",
      "meaning": "意味 (ベトナム語)"
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "質問 (ベトナム語)",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctAnswer": "正解",
      "explanation": "説明 (ベトナム語)"
    }
  ]
}

文章は3-5文程度、質問は3-5問作成してください。`;

  try {
    const response = await callGemini(prompt, true);
    return {
      ...response,
      level,
      type,
      topic,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Generate reading passage error:", error);
    throw error;
  }
};

/**
 * Check reading comprehension answer
 */
export const checkReadingAnswer = (question, userAnswer) => {
  const isCorrect = userAnswer === question.correctAnswer;
  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
};

/**
 * Mock reading passages for demo
 */
export const getMockReadingPassages = () => {
  return [
    {
      id: "reading-1",
      level: "beginner",
      type: "short_passage",
      topic: "自己紹介",
      title: "Giới thiệu bản thân",
      passage:
        "はじめまして。私はベトナム人です。名前はタンです。大学生です。日本語を勉強しています。趣味は音楽を聞くことです。よろしくお願いします。",
      translation:
        "Xin chào. Tôi là người Việt Nam. Tên tôi là Tân. Tôi là sinh viên đại học. Tôi đang học tiếng Nhật. Sở thích của tôi là nghe nhạc. Rất vui được làm quen.",
      vocabulary: [
        {
          word: "はじめまして",
          reading: "はじめまして",
          meaning: "Xin chào (lần đầu gặp)",
        },
        { word: "趣味", reading: "しゅみ", meaning: "Sở thích" },
        { word: "勉強する", reading: "べんきょうする", meaning: "Học" },
      ],
      questions: [
        {
          id: 1,
          question: "Tân là người nước nào?",
          options: ["Nhật Bản", "Việt Nam", "Trung Quốc", "Hàn Quốc"],
          correctAnswer: "Việt Nam",
          explanation:
            'Câu "私はベトナム人です" nghĩa là "Tôi là người Việt Nam"',
        },
        {
          id: 2,
          question: "Tân đang làm gì?",
          options: ["Đi làm", "Học đại học", "Du học", "Nghỉ ngơi"],
          correctAnswer: "Học đại học",
          explanation: 'Câu "大学生です" nghĩa là "là sinh viên đại học"',
        },
        {
          id: 3,
          question: "Sở thích của Tân là gì?",
          options: ["Đọc sách", "Xem phim", "Nghe nhạc", "Chơi thể thao"],
          correctAnswer: "Nghe nhạc",
          explanation:
            'Câu "趣味は音楽を聞くことです" nghĩa là "Sở thích là nghe nhạc"',
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];
};
