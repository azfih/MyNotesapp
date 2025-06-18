import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../pages/AuthApp";

const moods = [
  { emoji: "😊", color: "#FFD700", label: "Happy" },
  { emoji: "😔", color: "#A9A9A9", label: "Sad" },
  { emoji: "😡", color: "#FF4500", label: "Angry" },
  { emoji: "😢", color: "#4169E1", label: "Crying" },
];

const MoodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodData, setMoodData] = useState({});
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const { token } = useAuth();

  // Helper function to format date consistently
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      setFeedback({
        message: "Please log in to track your moods.",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    
    apiClient.get("/moods")
      .then((res) => {
        const moodsMap = {};
        res.data.forEach(({ date, moodEmoji, moodColor }) => {
          moodsMap[date] = { emoji: moodEmoji, color: moodColor };
        });
        setMoodData(moodsMap);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Mood fetch error:", error);
        setFeedback({
          message: error.response?.data?.error || "Failed to load mood data. Please try again.",
          type: "error"
        });
        setIsLoading(false);
      });
  }, [token]);

  const handleMoodSelect = async (mood) => {
    if (!token) {
      setFeedback({
        message: "Please log in to save your mood.",
        type: "error"
      });
      return;
    }

    // Use the helper function to format date consistently
    const formattedDate = formatDateForAPI(selectedDate);
    
    setIsLoading(true);
    setSelectedMood(mood);
    
    try {
      // Update local state first for immediate feedback
      setMoodData((prev) => ({ ...prev, [formattedDate]: mood }));
      
      // Send to backend
      await apiClient.post("/moods", {
        date: formattedDate,
        moodEmoji: mood.emoji,
        moodColor: mood.color,
      });
      
      setFeedback({
        message: `${mood.label} mood saved for ${selectedDate.toDateString()}!`,
        type: "success"
      });
      
      setTimeout(() => {
        setFeedback({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Mood save error:", error);
      setFeedback({
        message: error.response?.data?.error || "Failed to save mood. Please try again.",
        type: "error"
      });
      
      // Revert the optimistic update
      setMoodData((prev) => {
        const newData = { ...prev };
        delete newData[formattedDate];
        return newData;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📅 Mood Tracker</h2>
      
      {feedback.message && (
        <div 
          className={`p-3 mb-4 rounded-md text-white text-center ${
            feedback.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {feedback.message}
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-2 mb-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-pink-300 border-t-pink-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      
      <div className="bg-pastel-pink p-4 rounded-lg">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileContent={({ date }) => {
            const formattedDate = formatDateForAPI(date);
            if (moodData[formattedDate]) {
              return (
                <div className="text-xl">
                  {moodData[formattedDate].emoji}
                </div>
              );
            }
            return null;
          }}
          className="border-none shadow-sm rounded-lg"
        />
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-medium mb-3">How are you feeling on {selectedDate.toDateString()}?</h3>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => handleMoodSelect(mood)}
              className="p-4 rounded-lg text-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center"
              style={{ 
                backgroundColor: mood.color,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
              disabled={isLoading}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-800">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {moodData[formatDateForAPI(selectedDate)] && (
        <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg text-center">
          <p className="font-medium">
            Your mood for {selectedDate.toDateString()} is: 
            <span className="text-2xl ml-2">
              {moodData[formatDateForAPI(selectedDate)].emoji}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
