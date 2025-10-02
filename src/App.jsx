import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useMaziiDictionary } from "./hooks/useMaziiDictionary";
import Layout from "./components/common/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Grammar = lazy(() => import("./pages/Grammar"));
const Vocabulary = lazy(() => import("./pages/Vocabulary"));
const Practice = lazy(() => import("./pages/Practice"));
const Writing = lazy(() => import("./pages/Writing"));
const Diary = lazy(() => import("./pages/Diary"));
const DataManagement = lazy(() => import("./pages/DataManagement"));
const Auth = lazy(() => import("./pages/Auth"));
const Reading = lazy(() => import("./pages/Reading"));
const Listening = lazy(() => import("./pages/Listening"));

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense
      fallback={<LoadingSpinner fullScreen message="Đang tải trang..." />}
    >
      <Routes>
        {/* Public route */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/grammar" element={<Grammar />} />
                  <Route path="/vocabulary" element={<Vocabulary />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/writing" element={<Writing />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/data" element={<DataManagement />} />
                  <Route path="/reading" element={<Reading />} />
                  <Route path="/listening" element={<Listening />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  useMaziiDictionary();

  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
