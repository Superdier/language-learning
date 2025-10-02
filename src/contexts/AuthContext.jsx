import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange } from "../services/authService";
import { getFromCloud, listenToUserData } from "../services/cloudSyncService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloudData, setCloudData] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });

        // Try to load cloud data
        try {
          const data = await getFromCloud(firebaseUser.uid);
          setCloudData(data);
        } catch (error) {
          console.error("Error loading cloud data:", error);
        }
      } else {
        setUser(null);
        setCloudData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Real-time cloud sync
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = listenToUserData(user.uid, (data) => {
        setCloudData(data);
      });

      return unsubscribe;
    }
  }, [user?.uid]);

  const value = {
    user,
    loading,
    cloudData,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Đang tải..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
