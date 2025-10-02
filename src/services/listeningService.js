import { callGemini } from "./aiService";

/**
 * Generate listening exercise with audio script
 */
export const generateListeningExercise = async (
  level,
  topic,
  type = "dialogue"
) => {
  const levelMap = {
    beginner: "N5-N4レベル",
    intermediate: "N3-N2レベル",
    advanced: "N1レベル",
  };

  const typeMap = {
    dialogue: "会話",
    announcement: "アナウンス",
    monologue: "モノローグ",
    news: "ニュース",
  };

  const prompt = `あなたは日本語教師です。以下の条件でリスニング問題を作成してください。

レベル: ${levelMap[level]}
トピック: ${topic}
タイプ: ${typeMap[type]}

以下のJSONフォーマットで返答してください:
{
  "title": "タイトル (ベトナム語)",
  "audioScript": "音声スクリプト (日本語)",
  "translation": "スクリプトの翻訳 (ベトナム語)",
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

スクリプトは自然な会話で、3-5文程度。質問は3-5問作成してください。`;

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
    console.error("Generate listening exercise error:", error);
    throw error;
  }
};

/**
 * Mock listening exercises for demo
 */
export const getMockListeningExercises = () => {
  return [
    {
      id: "listening-1",
      level: "beginner",
      type: "dialogue",
      topic: "買い物",
      title: "Mua sắm ở cửa hàng tiện lợi",
      audioScript:
        "A: いらっしゃいませ。\nB: すみません、おにぎりはどこですか。\nA: おにぎりはあちらです。\nB: ありがとうございます。これをください。\nA: はい、150円です。",
      translation:
        "A: Xin chào quý khách.\nB: Xin lỗi, onigiri ở đâu ạ?\nA: Onigiri ở phía kia.\nB: Cảm ơn. Cho tôi cái này.\nA: Vâng, 150 yên ạ.",
      vocabulary: [
        {
          word: "いらっしゃいませ",
          reading: "いらっしゃいませ",
          meaning: "Xin chào (ở cửa hàng)",
        },
        { word: "おにぎり", reading: "おにぎり", meaning: "Cơm nắm" },
        { word: "あちら", reading: "あちら", meaning: "Phía kia" },
      ],
      questions: [
        {
          id: 1,
          question: "B đang ở đâu?",
          options: ["Nhà hàng", "Cửa hàng tiện lợi", "Siêu thị", "Trường học"],
          correctAnswer: "Cửa hàng tiện lợi",
          explanation:
            'Từ "いらっしゃいませ" và việc hỏi vị trí sản phẩm cho thấy đây là cửa hàng',
        },
        {
          id: 2,
          question: "B muốn mua gì?",
          options: ["Bánh mì", "Onigiri", "Sushi", "Bento"],
          correctAnswer: "Onigiri",
          explanation: 'B hỏi "おにぎりはどこですか" - onigiri ở đâu',
        },
        {
          id: 3,
          question: "Onigiri giá bao nhiêu?",
          options: ["100 yên", "150 yên", "200 yên", "250 yên"],
          correctAnswer: "150 yên",
          explanation: 'Nhân viên nói "150円です" - 150 yên',
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];
};

/**
 * Text to speech using Web Speech API
 */
export const speakJapanese = (text, rate = 0.8) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
    return utterance;
  } else {
    throw new Error("Text-to-speech not supported in this browser");
  }
};

/**
 * Stop speech
 */
export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
