import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import DataManagement from "./pages/DataManagement";
import Grammar from "./pages/Grammar";
import Vocabulary from "./pages/Vocabulary";
import Practice from "./pages/Practice";
import { useMaziiDictionary } from "./hooks/useMaziiDictionary";
import Writing from "./pages/Writing";
import Diary from "./pages/Diary";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  // Enable Mazii dictionary lookup
  useMaziiDictionary();
  return (
    <AppProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grammar" element={<Grammar />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/data" element={<DataManagement />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
