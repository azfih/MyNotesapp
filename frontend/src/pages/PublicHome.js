import React from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins";

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col items-center justify-center p-6 font-[Poppins]">
      <div className="text-center max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-8xl mb-6">🌸</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your moods, organize your thoughts, and create a space that nurtures your mental well-being. 
            Join thousands who have made self-care a priority.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mood Tracking</h3>
            <p className="text-gray-600">Monitor your daily emotions and discover patterns in your mental health journey.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Notes</h3>
            <p className="text-gray-600">Write down your thoughts, goals, and reflections in a secure, private space.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-indigo-100">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Wellness Tracking</h3>
            <p className="text-gray-600">Keep track of your daily tasks, health metrics, and progress towards your goals.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-8">Create your account today and take the first step towards better mental wellness.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold rounded-2xl hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center justify-center">
                Get Started Free 🌟
              </span>
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/80 text-gray-700 font-semibold rounded-2xl hover:bg-white transition-all duration-300 shadow-lg border border-pink-200"
            >
              <span className="flex items-center justify-center">
                Sign In 💕
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Your wellness journey starts with a single step. Take it today. ✨</p>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;