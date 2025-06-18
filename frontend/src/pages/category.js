import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthApp";

const CategoryPage = () => {
  const { category } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  // Create axios instance with auth headers
  const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (!token) {
      setError("Please log in to view notes.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Fetch notes from API
    apiClient.get(`/notes?category=${encodeURIComponent(category)}`)
      .then((response) => {
        setNotes(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Notes fetch error:", error);
        setError(error.response?.data?.message || "Failed to load notes. Please try again.");
        setIsLoading(false);
      });
  }, [category, token]);

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await apiClient.delete(`/notes/${noteId}`);
      
      // Remove note from local state
      setNotes(notes.filter(note => note._id !== noteId));
      
      // Show success message
      setError("Note deleted successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete note. Please try again.");
    }
  };

  const handleEditNote = (noteId) => {
    navigate(`/edit-note/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-pastel-pink p-6 font-[Poppins]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="bg-white p-2 rounded-full shadow-md mr-4 hover:bg-gray-50"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold text-gray-700">📂 {category}</h2>
        </div>

        {error && (
          <div className={`p-3 mb-4 rounded-md text-white text-center ${
            error.includes("success") ? "bg-green-500" : "bg-red-500"
          }`}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600">No notes found in this category.</p>
            <p className="mt-2 text-gray-500">Create your first note to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div 
                key={note._id} 
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative group"
                style={{ backgroundColor: note.backgroundColor }}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => handleEditNote(note._id)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
                <h3 
                  className="font-medium text-lg mb-2 pr-16" 
                  style={{ color: note.textColor }}
                >
                  {note.title}
                </h3>
                <p 
                  className="text-gray-700 mb-2 whitespace-pre-wrap" 
                  style={{ color: note.textColor }}
                >
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{note.emoji}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {note.stickers && note.stickers.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {note.stickers.map((sticker, index) => (
                      <span key={index} className="text-sm">
                        {sticker}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button 
            onClick={() => navigate("/create-note")} 
            className="bg-pastel-blue px-6 py-3 rounded-lg shadow-md text-black font-semibold hover:bg-blue-500 transition duration-300"
          >
            ➕ Create New Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
