import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Sync user data to Firestore
 */
export const syncToCloud = async (userId, data) => {
  try {
    const userDataRef = doc(db, "userData", userId);

    await setDoc(
      userDataRef,
      {
        ...data,
        lastSyncedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Sync to cloud error:", error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getFromCloud = async (userId) => {
  try {
    const userDataRef = doc(db, "userData", userId);
    const docSnap = await getDoc(userDataRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Get from cloud error:", error);
    throw error;
  }
};

/**
 * Sync specific collection (grammar, vocabulary, etc.)
 */
export const syncCollection = async (userId, collectionName, items) => {
  try {
    const batch = writeBatch(db);
    const collectionRef = collection(db, "userData", userId, collectionName);

    items.forEach((item) => {
      const itemRef = doc(collectionRef, item.id);
      batch.set(
        itemRef,
        {
          ...item,
          syncedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Sync collection error:", error);
    throw error;
  }
};

/**
 * Get collection from cloud
 */
export const getCollection = async (userId, collectionName) => {
  try {
    const collectionRef = collection(db, "userData", userId, collectionName);
    const snapshot = await getDocs(collectionRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get collection error:", error);
    throw error;
  }
};

/**
 * Real-time sync listener
 */
export const listenToUserData = (userId, callback) => {
  const userDataRef = doc(db, "userData", userId);

  return onSnapshot(
    userDataRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    },
    (error) => {
      console.error("Listen error:", error);
    }
  );
};

/**
 * Sync review history
 */
export const syncReviewHistory = async (userId, reviewHistory) => {
  try {
    const batch = writeBatch(db);
    const reviewRef = collection(db, "userData", userId, "reviewHistory");

    // Only sync recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = reviewHistory.filter(
      (review) => new Date(review.date) > thirtyDaysAgo
    );

    recentReviews.forEach((review) => {
      const reviewDoc = doc(reviewRef, review.id);
      batch.set(reviewDoc, {
        ...review,
        syncedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Sync review history error:", error);
    throw error;
  }
};

/**
 * Full sync - upload all data
 */
export const fullSyncToCloud = async (userId, appData) => {
  try {
    const {
      grammarItems,
      vocabularyItems,
      kanjiItems,
      contrastCards,
      reviewHistory,
      errorLog,
      savedSentences,
      savedDiaries,
    } = appData;

    // Sync main data
    await syncToCloud(userId, {
      grammarCount: grammarItems.length,
      vocabularyCount: vocabularyItems.length,
      kanjiCount: kanjiItems.length,
      reviewCount: reviewHistory.length,
    });

    // Sync collections in parallel
    await Promise.all([
      syncCollection(userId, "grammar", grammarItems),
      syncCollection(userId, "vocabulary", vocabularyItems),
      syncCollection(userId, "kanji", kanjiItems),
      syncCollection(userId, "contrastCards", contrastCards),
      syncReviewHistory(userId, reviewHistory),
      syncCollection(userId, "errorLog", errorLog),
      syncCollection(userId, "sentences", savedSentences),
      syncCollection(userId, "diaries", savedDiaries),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Full sync error:", error);
    throw error;
  }
};
