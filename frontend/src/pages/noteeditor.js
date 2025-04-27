import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const stickers = ["sticker1.jpeg", "sticker2.jpeg", "sticker3.jpeg"];
const wallpaper = ["wallpaper1.jpeg", "wallpaper2.jpeg", "wallpaper3.jpeg"];

const NoteEditor = () => {
  const navigate = useNavigate();
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  
  // Form state
  const [title, setTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Feedback state
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 50) {
      newErrors.title = "Title must be less than 50 characters";
    }
    
    if (!noteText.trim()) {
      newErrors.noteText = "Note content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // Clear previous feedback
    setFeedback({ message: "", type: "" });
    
    // Validate form
    if (!validateForm()) {
      setFeedback({
        message: "Please fix the errors before saving",
        type: "error"
      });
      return;
    }
    
    // Mock API call - in a real app, this would be an actual API call
    try {
      // Simulate API call
      setTimeout(() => {
        setFeedback({
          message: "Note saved successfully!",
          type: "success"
        });
        
        // Reset form after 2 seconds and redirect
        setTimeout(() => {
          navigate("/category/Notes");
        }, 2000);
      }, 1000);
    } catch (error) {
      setFeedback({
        message: "Error saving note. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center p-6"
      style={{ backgroundImage: "url('/fixed_background.jpeg')", backgroundSize: "cover" }}
    >
      {/* Stickers Panel (Left) */}
      <div className="w-1/5 h-96 overflow-y-scroll bg-white p-3 rounded-lg shadow-lg">
        <h3 className="text-center font-bold mb-2">Stickers</h3>
        {stickers.map((sticker, index) => (
          <img
            key={index}
            src={`/stickers/${sticker}`}
            alt="Sticker"
            className={`cursor-pointer w-16 mx-auto my-2 ${selectedSticker === sticker ? "border-2 border-blue-500" : ""}`}
            onClick={() => setSelectedSticker(sticker)}
          />
        ))}
      </div>

      {/* Note Editing Area (Center) */}
      <div 
        className="w-2/5 p-6 rounded-lg shadow-xl relative flex flex-col items-center"
        style={{ backgroundImage: selectedBackground ? `url('/wallpaper/${selectedBackground}')` : "none", backgroundSize: "cover" }}
      >
        {/* Feedback Message */}
        {feedback.message && (
          <div 
            className={`w-full p-3 mb-4 rounded-md text-white text-center ${
              feedback.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {feedback.message}
          </div>
        )}
        
        {/* Title Input */}
        <div className="w-full mb-3">
          <input
            type="text"
            placeholder="Title"
            className={`w-full p-2 border rounded-md text-center font-semibold ${
              errors.title ? "border-red-500" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => validateForm()}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Note Text Area */}
        <div className="w-4/5 mb-3">
          <textarea
            className={`w-full h-40 p-3 border rounded-lg ${
              errors.noteText ? "border-red-500" : ""
            }`}
            style={{ color: textColor }}
            placeholder="Write your note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onBlur={() => validateForm()}
          ></textarea>
          {errors.noteText && (
            <p className="text-red-500 text-sm mt-1">{errors.noteText}</p>
          )}
        </div>

        {/* Text Color Picker */}
        <div className="flex items-center mt-2">
          <label className="mr-2">Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
        >
          Save Note
        </button>
      </div>

      {/* Backgrounds Panel (Right) */}
      <div className="w-1/5 h-96 overflow-y-scroll bg-white p-3 rounded-lg shadow-lg">
        <h3 className="text-center font-bold mb-2">Backgrounds</h3>
        {wallpaper.map((bg, index) => (
          <img
            key={index}
            src={`/wallpaper/${bg}`}
            alt="Background"
            className={`cursor-pointer w-16 mx-auto my-2 ${selectedBackground === bg ? "border-2 border-blue-500" : ""}`}
            onClick={() => setSelectedBackground(bg)}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteEditor;