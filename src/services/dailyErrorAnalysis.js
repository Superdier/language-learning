import { analyzeDailyErrors } from "./aiService";
import { DAILY_REVIEW_TIME } from "../utils/constants";

let analysisTimer = null;

/**
 * Schedule daily error analysis at 21:30
 */
export const scheduleDailyAnalysis = (errorLog, onComplete) => {
  // Clear existing timer
  if (analysisTimer) {
    clearTimeout(analysisTimer);
  }

  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(
    DAILY_REVIEW_TIME.HOUR,
    DAILY_REVIEW_TIME.MINUTE,
    0,
    0
  );

  // If time has passed today, schedule for tomorrow
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilAnalysis = scheduledTime.getTime() - now.getTime();

  console.log(`Daily analysis scheduled at ${scheduledTime.toLocaleString()}`);

  analysisTimer = setTimeout(async () => {
    await performDailyAnalysis(errorLog, onComplete);
    // Reschedule for next day
    scheduleDailyAnalysis(errorLog, onComplete);
  }, timeUntilAnalysis);
};

/**
 * Perform daily analysis
 */
const performDailyAnalysis = async (errorLog, onComplete) => {
  try {
    // Get today's errors
    const today = new Date().toDateString();
    const todayErrors = errorLog.filter((error) => {
      const errorDate = new Date(error.date).toDateString();
      return errorDate === today;
    });

    if (todayErrors.length === 0) {
      console.log("No errors today to analyze");
      return;
    }

    console.log(`Analyzing ${todayErrors.length} errors from today...`);

    // Call AI to analyze
    const analyses = await analyzeDailyErrors(todayErrors);

    // Save analyses
    if (onComplete) {
      onComplete(analyses, todayErrors);
    }

    console.log("Daily analysis completed");
  } catch (error) {
    console.error("Daily analysis failed:", error);
  }
};

/**
 * Stop daily analysis
 */
export const stopDailyAnalysis = () => {
  if (analysisTimer) {
    clearTimeout(analysisTimer);
    analysisTimer = null;
  }
};

/**
 * Manually trigger analysis
 */
export const triggerManualAnalysis = async (errorLog, onComplete) => {
  const today = new Date().toDateString();
  const todayErrors = errorLog.filter((error) => {
    const errorDate = new Date(error.date).toDateString();
    return errorDate === today;
  });

  if (todayErrors.length === 0) {
    throw new Error("Không có lỗi nào hôm nay để phân tích");
  }

  const analyses = await analyzeDailyErrors(todayErrors);

  if (onComplete) {
    onComplete(analyses, todayErrors);
  }

  return analyses;
};
