import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams(); // Get category from URL
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Reset states when category changes
    setIsLoading(true);
    setError("");
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data based on category
      const mockNotes = {
        "Daily Task Tracker": [
          { _id: "1", title: "Monday Tasks", text: "Complete project proposal", emoji: "📝" },
          { _id: "2", title: "Wednesday Tasks", text: "Meeting with team at 2pm", emoji: "👥" },
        ],
        "Mood Tracker": [
          { _id: "3", title: "Weekly Reflection", text: "This week was productive overall", emoji: "😊" },
        ],
        "Health Tracker": [
          { _id: "4", title: "Exercise Log", text: "30 min cardio + 20 min strength", emoji: "💪" },
          { _id: "5", title: "Water Intake", text: "8 glasses today!", emoji: "💧" },
        ],
        "Notes": [
          { _id: "6", title: "Ideas", text: "New app concept for productivity", emoji: "💡" },
          { _id: "7", title: "Books to Read", text: "1. Atomic Habits\n2. Deep Work", emoji: "📚" },
        ]
      };
      
      if (mockNotes[category]) {
        setNotes(mockNotes[category]);
        setIsLoading(false);
      } else {
        // If category doesn't exist in our mock data
        setNotes([]);
        setIsLoading(false);
      }
    }, 1000);
    
  }, [category]);

  const handleDeleteNote = (noteId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this note?")) {
      // Filter out the deleted note for immediate UI update
      setNotes(notes.filter(note => note._id !== noteId));
      
      // Show temporary success message
      setError("Note deleted successfully!");
      setTimeout(() => setError(""), 3000);
      
    }
  };

  return (
    <div className="min-h-screen bg-pastel-pink p-6 font-[Poppins]">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate("/")} 
            className="bg-white p-2 rounded-full shadow-md mr-4"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold text-gray-700">📂 {category}</h2>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`p-3 mb-4 rounded-md text-white text-center ${
            error.includes("success") ? "bg-green-500" : "bg-red-500"
          }`}>
            {error}
          </div>
        )}

        {/* Loading State */}
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
              <div key={note._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    🗑️
                  </button>
                </div>
                <h3 className="font-medium text-lg mb-2">{note.title}</h3>
                <p className="text-gray-700">{note.text}</p>
                <span className="text-2xl mt-2 inline-block">{note.emoji}</span>
              </div>
            ))}
          </div>
        )}

        {/* Create New Note Button */}
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