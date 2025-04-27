import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

  useEffect(() => {
    // Fetch mood data
    setIsLoading(true);
    
    axios.get("http://localhost:5000/api/moods")
      .then((res) => {
        const moodsMap = {};
        res.data.forEach(({ date, moodEmoji, moodColor }) => {
          moodsMap[date] = { emoji: moodEmoji, color: moodColor };
        });
        setMoodData(moodsMap);
        setIsLoading(false);
      })
      .catch((error) => {
        setFeedback({
          message: "Failed to load mood data. Please try again.",
          type: "error"
        });
        setIsLoading(false);
      });
  }, []);

  const handleMoodSelect = async (mood) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    
    setIsLoading(true);
    setSelectedMood(mood);
    
    try {
      // Update local state first for immediate feedback
      setMoodData((prev) => ({ ...prev, [formattedDate]: mood }));
      
      // Send to backend
      await axios.post("http://localhost:5000/api/moods", {
        date: formattedDate,
        moodEmoji: mood.emoji,
        moodColor: mood.color,
      });
      
      setFeedback({
        message: `${mood.label} mood saved for ${selectedDate.toDateString()}!`,
        type: "success"
      });
      
      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      setFeedback({
        message: "Failed to save mood. Please try again.",
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
      
      {/* Feedback Message */}
      {feedback.message && (
        <div 
          className={`p-3 mb-4 rounded-md text-white text-center ${
            feedback.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {feedback.message}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-2 mb-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-pink-300 border-t-pink-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      
      {/* Calendar */}
      <div className="bg-pastel-pink p-4 rounded-lg">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileContent={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
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
      
      {/* Mood Selection */}
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
      
      {/* Current mood display */}
      {moodData[selectedDate.toISOString().split("T")[0]] && (
        <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg text-center">
          <p className="font-medium">
            Your mood for {selectedDate.toDateString()} is: 
            <span className="text-2xl ml-2">
              {moodData[selectedDate.toISOString().split("T")[0]].emoji}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;