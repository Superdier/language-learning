import { useMemo } from "react";
import { useApp } from "../contexts/AppContext";
import { needsReview, getItemsDueForReview } from "../utils/helpers";

export const useSRS = () => {
  const { grammarItems, vocabularyItems, kanjiItems, contrastCards } = useApp();

  // Get all items that need review
  const dueItems = useMemo(() => {
    const grammar = getItemsDueForReview(grammarItems).map((item) => ({
      ...item,
      type: "grammar",
    }));

    const vocabulary = getItemsDueForReview(vocabularyItems).map((item) => ({
      ...item,
      type: "vocabulary",
    }));

    const kanji = getItemsDueForReview(kanjiItems).map((item) => ({
      ...item,
      type: "kanji",
    }));

    const contrast = getItemsDueForReview(contrastCards).map((item) => ({
      ...item,
      type: "contrast",
    }));

    return {
      grammar,
      vocabulary,
      kanji,
      contrast,
      all: [...grammar, ...vocabulary, ...kanji, ...contrast],
    };
  }, [grammarItems, vocabularyItems, kanjiItems, contrastCards]);

  // Get items with errors
  const errorItems = useMemo(() => {
    const grammar = grammarItems
      .filter((item) => item.errorCount > 0)
      .map((item) => ({ ...item, type: "grammar" }))
      .sort((a, b) => b.errorCount - a.errorCount);

    const vocabulary = vocabularyItems
      .filter((item) => item.errorCount > 0)
      .map((item) => ({ ...item, type: "vocabulary" }))
      .sort((a, b) => b.errorCount - a.errorCount);

    const kanji = kanjiItems
      .filter((item) => item.errorCount > 0)
      .map((item) => ({ ...item, type: "kanji" }))
      .sort((a, b) => b.errorCount - a.errorCount);

    return {
      grammar,
      vocabulary,
      kanji,
      all: [...grammar, ...vocabulary, ...kanji],
    };
  }, [grammarItems, vocabularyItems, kanjiItems]);

  // Get statistics
  const stats = useMemo(() => {
    return {
      dueToday: dueItems.all.length,
      dueGrammar: dueItems.grammar.length,
      dueVocabulary: dueItems.vocabulary.length,
      dueKanji: dueItems.kanji.length,
      dueContrast: dueItems.contrast.length,
      errorCount: errorItems.all.length,
      errorGrammar: errorItems.grammar.length,
      errorVocabulary: errorItems.vocabulary.length,
      errorKanji: errorItems.kanji.length,
    };
  }, [dueItems, errorItems]);

  return {
    dueItems,
    errorItems,
    stats,
  };
};
