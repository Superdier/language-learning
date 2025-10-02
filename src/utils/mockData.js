import { addDays } from "date-fns";
import { CONTENT_TYPES } from "./constants";

export const generateMockReviewHistory = (days = 7) => {
  const history = [];
  const types = Object.values(CONTENT_TYPES);

  for (let i = 0; i < days; i++) {
    const date = addDays(new Date(), -i);
    const reviewsPerDay = Math.floor(Math.random() * 10) + 5;

    for (let j = 0; j < reviewsPerDay; j++) {
      history.push({
        id: `${date.getTime()}-${j}`,
        date: date.toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        correct: Math.random() > 0.3,
        itemId: `item-${Math.random().toString(36).substr(2, 9)}`,
      });
    }
  }

  return history;
};

export const generateMockGrammarItems = (count = 20) => {
  const items = [];
  const levels = ["N5", "N4", "N3", "N2", "N1"];

  for (let i = 0; i < count; i++) {
    items.push({
      id: `grammar-${i}`,
      level: levels[Math.floor(Math.random() * levels.length)],
      structure: `〜てform ${i + 1}`,
      meaning: `Mẫu ngữ pháp số ${i + 1}`,
      example: "例文がここにあります。",
      srsLevel: Math.floor(Math.random() * 7),
      nextReviewDate: addDays(
        new Date(),
        Math.floor(Math.random() * 10) - 5
      ).toISOString(),
    });
  }

  return items;
};

export const generateMockContrastCards = (count = 5) => {
  const pairs = [
    {
      structureA: "〜ている",
      structureB: "〜てある",
      comparison:
        "ている diễn tả trạng thái tiếp diễn, てある diễn tả trạng thái đã chuẩn bị sẵn",
      exampleA: "窓が開いている。",
      translationA: "Cửa sổ đang mở.",
      exampleB: "窓が開けてある。",
      translationB: "Cửa sổ đã được mở sẵn.",
      miniExercise: "エアコンが___。(A: ついている B: つけてある)",
    },
    {
      structureA: "〜たい",
      structureB: "〜てほしい",
      comparison:
        "たい diễn tả mong muốn của bản thân, てほしい diễn tả mong muốn người khác làm gì",
      exampleA: "日本に行きたい。",
      translationA: "Tôi muốn đi Nhật.",
      exampleB: "日本に来てほしい。",
      translationB: "Tôi muốn bạn đến Nhật.",
      miniExercise: "彼に___。(A: 会いたい B: 会ってほしい)",
    },
  ];

  return pairs.slice(0, count).map((pair, i) => ({
    id: `contrast-${i}`,
    pairId: i + 1,
    ...pair,
    srsLevel: 0,
    nextReviewDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }));
};

export const generateMockKanjiItems = (count = 15) => {
  const kanjis = [
    {
      kanji: "食",
      onyomi: "ショク",
      kunyomi: "た-べる",
      meaning: "Ăn",
      example: "食事",
      translation: "Bữa ăn",
    },
    {
      kanji: "飲",
      onyomi: "イン",
      kunyomi: "の-む",
      meaning: "Uống",
      example: "飲料",
      translation: "Đồ uống",
    },
    {
      kanji: "見",
      onyomi: "ケン",
      kunyomi: "み-る",
      meaning: "Xem",
      example: "見学",
      translation: "Tham quan",
    },
    {
      kanji: "聞",
      onyomi: "ブン",
      kunyomi: "き-く",
      meaning: "Nghe",
      example: "新聞",
      translation: "Báo",
    },
    {
      kanji: "書",
      onyomi: "ショ",
      kunyomi: "か-く",
      meaning: "Viết",
      example: "書類",
      translation: "Tài liệu",
    },
    {
      kanji: "読",
      onyomi: "ドク",
      kunyomi: "よ-む",
      meaning: "Đọc",
      example: "読書",
      translation: "Đọc sách",
    },
    {
      kanji: "話",
      onyomi: "ワ",
      kunyomi: "はな-す",
      meaning: "Nói",
      example: "会話",
      translation: "Hội thoại",
    },
    {
      kanji: "行",
      onyomi: "コウ",
      kunyomi: "い-く",
      meaning: "Đi",
      example: "旅行",
      translation: "Du lịch",
    },
    {
      kanji: "来",
      onyomi: "ライ",
      kunyomi: "く-る",
      meaning: "Đến",
      example: "未来",
      translation: "Tương lai",
    },
    {
      kanji: "学",
      onyomi: "ガク",
      kunyomi: "まな-ぶ",
      meaning: "Học",
      example: "学校",
      translation: "Trường học",
    },
  ];

  const levels = ["N5", "N4", "N3"];

  return kanjis.slice(0, count).map((k, i) => ({
    id: `kanji-${i}`,
    ...k,
    level: levels[Math.floor(Math.random() * levels.length)],
    srsLevel: Math.floor(Math.random() * 7),
    nextReviewDate: addDays(
      new Date(),
      Math.floor(Math.random() * 10) - 5
    ).toISOString(),
    errorCount: 0,
    errorReasons: [],
    createdAt: new Date().toISOString(),
  }));
};

export const generateMockVocabularyItems = (count = 30) => {
  const vocabs = [
    {
      word: "食べる",
      reading: "たべる",
      meaning: "Ăn",
      example: "朝ごはんを食べる",
      translation: "Ăn sáng",
      partOfSpeech: "動詞",
    },
    {
      word: "飲む",
      reading: "のむ",
      meaning: "Uống",
      example: "水を飲む",
      translation: "Uống nước",
      partOfSpeech: "動詞",
    },
    {
      word: "見る",
      reading: "みる",
      meaning: "Xem",
      example: "映画を見る",
      translation: "Xem phim",
      partOfSpeech: "動詞",
    },
    {
      word: "聞く",
      reading: "きく",
      meaning: "Nghe",
      example: "音楽を聞く",
      translation: "Nghe nhạc",
      partOfSpeech: "動詞",
    },
    {
      word: "書く",
      reading: "かく",
      meaning: "Viết",
      example: "手紙を書く",
      translation: "Viết thư",
      partOfSpeech: "動詞",
    },
    {
      word: "読む",
      reading: "よむ",
      meaning: "Đọc",
      example: "本を読む",
      translation: "Đọc sách",
      partOfSpeech: "動詞",
    },
    {
      word: "話す",
      reading: "はなす",
      meaning: "Nói",
      example: "日本語を話す",
      translation: "Nói tiếng Nhật",
      partOfSpeech: "動詞",
    },
    {
      word: "行く",
      reading: "いく",
      meaning: "Đi",
      example: "学校に行く",
      translation: "Đi học",
      partOfSpeech: "動詞",
    },
    {
      word: "来る",
      reading: "くる",
      meaning: "Đến",
      example: "友達が来る",
      translation: "Bạn đến",
      partOfSpeech: "動詞",
    },
    {
      word: "学ぶ",
      reading: "まなぶ",
      meaning: "Học",
      example: "日本語を学ぶ",
      translation: "Học tiếng Nhật",
      partOfSpeech: "動詞",
    },
  ];

  const levels = ["N5", "N4", "N3"];

  return vocabs.slice(0, count).map((v, i) => ({
    id: `vocab-${i}`,
    ...v,
    level: levels[Math.floor(Math.random() * levels.length)],
    srsLevel: Math.floor(Math.random() * 7),
    nextReviewDate: addDays(
      new Date(),
      Math.floor(Math.random() * 10) - 5
    ).toISOString(),
    errorCount: 0,
    errorReasons: [],
    createdAt: new Date().toISOString(),
  }));
};
