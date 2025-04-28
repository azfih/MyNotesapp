import React from "react";
import "@fontsource/poppins";
import MoodTracker from "../components/MoodTracker";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col items-center p-6 font-[Poppins]">
      {/* Top Image */}
      <img src="/wallpaper/wallpaper1.jpeg" alt="Top Banner" className="w-full max-w-4xl rounded-2xl shadow-lg" />
      
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-700 mt-6">Welcome to Your Space ✨</h1>
      
      {/* Motivational Note */}
      <p className="mt-3 bg-yellow-100 p-4 rounded-lg text-gray-600 shadow-sm border-l-4 border-yellow-400 max-w-xl text-center">
        "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. 💖"
      </p>
      
      {/* Horizontal Bar */}
      <div className="w-full max-w-4xl border-b-2 border-[#F1E8E5] my-6"></div>
      
      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
        {[
          { name: "Daily Task Tracker", img: "/wallpaper/wallpaper2.jpeg" },
          { name: "Mood Tracker", img: "/wallpaper/wallpaper4.jpeg" },
          { name: "Health Tracker", img: "/wallpaper/health-tracker.jpeg" },
          { name: "Notes", img: "/wallpaper/notes.jpeg" },
        ].map((category) => (
          <div
            key={category.name}
            onClick={() => navigate(`/category/${category.name}`)}
            className="p-4 rounded-lg shadow-md bg-white text-center cursor-pointer hover:shadow-xl transition"
          >
            <img src={category.img} alt={category.name} className="w-20 h-20 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">{category.name}</p>
          </div>
        ))}
      </div>
      
      {/* Horizontal Bar */}
      <div className="w-full max-w-4xl border-b-2 border-[#F1E8E5] my-6"></div>
      <MoodTracker />
      {/* Image with Text and Time */}
      <div className="w-full max-w-4xl flex items-center">
        <img src="/wallpaper/stars.jpeg" alt="Side Illustration" className="w-32 h-32 rounded-lg shadow-md" />
        <div className="ml-6 flex-1">
          <p className="text-gray-700 text-lg font-medium">Cherish every moment and make today count! 🌸</p>
        </div>
        <div className="text-gray-600 text-lg font-bold">🕒 {formattedTime}</div>
      </div>
      
    </div>
  );
};

export default Home;
