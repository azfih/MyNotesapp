import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CategoryPage from "./pages/category";
import NoteEditor from "./pages/noteeditor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/create-note" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
};

export default App;



