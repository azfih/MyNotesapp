import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PublicHome from "./pages/PublicHome";
import CategoryPage from "./pages/category";
import NoteEditor from "./pages/noteeditor";
import AuthApp from "./pages/AuthApp"; 

import { AuthProvider, useAuth } from "./pages/AuthApp";

// Wrap protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading your wellness space... ✨</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Component to handle the root route logic
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading... ✨</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <PublicHome />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root route - shows public home or redirects to dashboard */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthApp route="login" />} />
          <Route path="/register" element={<AuthApp route="register" />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthApp route="home" />
              </ProtectedRoute>
            }
          />

          {/* Protected Category Pages */}
          <Route 
            path="/category/:category" 
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Note Editor - Create */}
          <Route
            path="/create-note"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          {/* Protected Note Editor - Edit */}
          <Route
            path="/edit-note/:noteId"
            element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;