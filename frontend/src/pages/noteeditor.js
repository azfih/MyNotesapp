import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthApp";

const stickers = ["🌟", "💖", "🎉", "🌈", "⭐", "🦋", "🌸", "💫", "🎈", "🌺", "🦄", "🍀"];
const wallpapers = [
  { name: "Default", color: "#ffffff" },
  { name: "Pastel Pink", color: "#FFE4E1" },
  { name: "Pastel Blue", color: "#E6F3FF" },
  { name: "Pastel Yellow", color: "#FFFACD" },
  { name: "Pastel Green", color: "#F0FFF0" },
  { name: "Pastel Purple", color: "#F8F4FF" },
  { name: "Mint Green", color: "#F0FFFF" },
  { name: "Peach", color: "#FFEEE6" }
];

const categories = ["Daily Task Tracker", "Mood Tracker", "Health Tracker", "Notes"];

const NoteEditor = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const { token } = useAuth();
  
  // UI State
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Notes");
  const [emoji, setEmoji] = useState("📝");
  
  // App state
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Create axios instance
  const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Load existing note if editing
  useEffect(() => {
    if (noteId && token) {
      setIsEditing(true);
      setIsLoading(true);
      
      apiClient.get(`/notes/${noteId}`)
        .then((response) => {
          const note = response.data;
          setTitle(note.title);
          setContent(note.content);
          setCategory(note.category);
          setEmoji(note.emoji || "📝");
          setSelectedBackground(note.backgroundColor || "#ffffff");
          setTextColor(note.textColor || "#000000");
          setSelectedStickers(note.stickers || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load note:", error);
          setFeedback({
            message: "Failed to load note. Please try again.",
            type: "error"
          });
          setIsLoading(false);
        });
    }
  }, [noteId, token]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (!content.trim()) {
      newErrors.content = "Note content is required";
    } else if (content.length > 5000) {
      newErrors.content = "Content must be less than 5000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStickerToggle = (sticker) => {
    setSelectedStickers(prev => 
      prev.includes(sticker) 
        ? prev.filter(s => s !== sticker)
        : [...prev, sticker]
    );
  };

  const handleSave = async () => {
    if (!token) {
      setFeedback({
        message: "Please log in to save notes.",
        type: "error"
      });
      return;
    }

    setFeedback({ message: "", type: "" });
    
    if (!validateForm()) {
      setFeedback({
        message: "Please fix the errors before saving",
        type: "error"
      });
      return;
    }
    
    setIsLoading(true);
    
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category,
      emoji,
      backgroundColor: selectedBackground,
      textColor,
      stickers: selectedStickers
    };
    
    try {
      let response;
      
      if (isEditing) {
        response = await apiClient.put(`/notes/${noteId}`, noteData);
      } else {
        response = await apiClient.post('/notes', noteData);
      }
      
      setFeedback({
        message: `Note ${isEditing ? 'updated' : 'created'} successfully!`,
        type: "success"
      });
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/category/${category}`);
      }, 1500);
      
    } catch (error) {
      console.error("Save error:", error);
      setFeedback({
        message: error.response?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} note. Please try again.`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/category/${category}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading note... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex justify-center items-center p-6">
      <div className="flex w-full max-w-7xl gap-6">
        
        {/* Left Panel - Stickers */}
        <div className="w-1/4 bg-white p-4 rounded-2xl shadow-lg h-fit border border-pink-100">
          <h3 className="text-center font-bold mb-4 text-gray-700 text-lg">✨ Stickers</h3>
          <div className="grid grid-cols-3 gap-3">
            {stickers.map((sticker, index) => (
              <button
                key={index}
                onClick={() => handleStickerToggle(sticker)}
                className={`text-2xl p-3 rounded-xl border-2 transition-all hover:scale-110 ${
                  selectedStickers.includes(sticker) 
                    ? "border-pink-400 bg-pink-50 shadow-md transform scale-105" 
                    : "border-gray-200 hover:border-pink-300 hover:bg-pink-25"
                }`}
              >
                {sticker}
              </button>
            ))}
          </div>
          
          {/* Selected Stickers Preview */}
          {selectedStickers.length > 0 && (
            <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Selected:</p>
              <div className="flex flex-wrap gap-1">
                {selectedStickers.map((sticker, index) => (
                  <span key={index} className="text-lg">{sticker}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Note Editor */}
        <div 
          className="w-2/4 p-8 rounded-2xl shadow-xl relative border border-gray-200 transition-all duration-300"
          style={{ backgroundColor: selectedBackground }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {isEditing ? "✏️ Edit Note" : "📝 Create Note"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-xl"
              title="Cancel"
            >
              ✕
            </button>
          </div>

          {/* Feedback Message */}
          {feedback.message && (
            <div 
              className={`w-full p-4 mb-6 rounded-lg text-white text-center font-medium ${
                feedback.type === "success" 
                  ? "bg-green-500 shadow-green-200" 
                  : "bg-red-500 shadow-red-200"
              } shadow-lg`}
            >
              {feedback.message}
            </div>
          )}
          
          {/* Category and Emoji Row */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">📂 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">😊 Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-20 p-3 border border-gray-300 rounded-lg text-center text-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                maxLength={2}
                placeholder="📝"
              />
            </div>
          </div>
          
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">📌 Title</label>
            <input
              type="text"
              placeholder="Enter your note title..."
              className={`w-full p-4 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-pink-400 focus:border-transparent ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              style={{ color: textColor }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => validateForm()}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                ⚠️ {errors.title}
              </p>
            )}
          </div>

          {/* Content Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">📄 Content</label>
            <textarea
              className={`w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-pink-400 focus:border-transparent ${
                errors.content ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              style={{ color: textColor }}
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => validateForm()}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                ⚠️ {errors.content}
              </p>
            )}
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/5000 characters
            </div>
          </div>

          {/* Text Color Picker */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-700">🎨 Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-600">{textColor}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </span>
              ) : (
                `💾 ${isEditing ? 'Update' : 'Save'} Note`
              )}
            </button>
            
            <button 
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Panel - Backgrounds */}
        <div className="w-1/4 bg-white p-4 rounded-2xl shadow-lg h-fit border border-purple-100">
          <h3 className="text-center font-bold mb-4 text-gray-700 text-lg">🎨 Backgrounds</h3>
          <div className="space-y-3">
            {wallpapers.map((bg, index) => (
              <button
                key={index}
                onClick={() => setSelectedBackground(bg.color)}
                className={`w-full h-16 rounded-xl border-2 transition-all hover:scale-105 flex items-center justify-center font-medium ${
                  selectedBackground === bg.color 
                    ? "border-purple-400 shadow-lg transform scale-105" 
                    : "border-gray-200 hover:border-purple-300"
                }`}
                style={{ backgroundColor: bg.color }}
              >
                <span className="text-sm text-gray-700">{bg.name}</span>
              </button>
            ))}
          </div>
          
          {/* Current Background Info */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Current:</p>
            <div 
              className="w-full h-8 rounded border border-gray-300"
              style={{ backgroundColor: selectedBackground }}
            ></div>
            <p className="text-xs text-gray-500 mt-1">{selectedBackground}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;