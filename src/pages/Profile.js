// 4. Dashboard.js (Profile/User Dashboard)
// ==========================================
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  IndianRupee,
  Target,
  Award,
  Edit2,
  LogOut,
  User,
  Camera,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myTournaments, setMyTournaments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserData();
    // eslint-disable-next-line
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [tournamentsRes, withdrawalsRes] = await Promise.all([
        axios.get("/api/user/tournaments"),
        axios.get("/api/user/withdrawals"),
      ]);
      setMyTournaments(tournamentsRes.data.data || []);
      setWithdrawals(withdrawalsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-dark-400 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="card-gaming mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-600">
                {user.avatar ? (
                  <img
                    src={`http://localhost:5002${user.avatar}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600 to-neon-purple flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.username}
              </h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-yellow-900 to-dark-300">
            <Trophy className="w-10 h-10 text-neon-yellow mb-2" />
            <div className="text-sm text-gray-400">Total Winnings</div>
            <div className="text-3xl font-bold text-neon-yellow flex items-center">
              <IndianRupee className="w-6 h-6" />
              {user.totalWinnings || 0}
            </div>
            <button className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors">
              Withdraw
            </button>
          </div>

          <div className="card bg-gradient-to-br from-red-900 to-dark-300">
            <Target className="w-10 h-10 text-red-400 mb-2" />
            <div className="text-sm text-gray-400">K/D Ratio</div>
            <div className="text-3xl font-bold text-white">
              {user.kdRatio || "N/A"}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-900 to-dark-300">
            <Award className="w-10 h-10 text-blue-400 mb-2" />
            <div className="text-sm text-gray-400">Current Rank</div>
            <div className="text-3xl font-bold text-white">
              {user.rank || "Unranked"}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-900 to-dark-300">
            <TrendingUp className="w-10 h-10 text-purple-400 mb-2" />
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-3xl font-bold text-white">
              {user.level || "N/A"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            My Tournaments
          </button>
          <button className="px-6 py-3 bg-dark-300 text-gray-400 rounded-lg font-semibold hover:bg-dark-200 hover:text-white transition-colors">
            Withdrawals
          </button>
          <button className="px-6 py-3 bg-dark-300 text-gray-400 rounded-lg font-semibold hover:bg-dark-200 hover:text-white transition-colors">
            My Stream
          </button>
        </div>

        {/* My Tournaments Section */}
        <div className="card-gaming">
          {myTournaments.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                You haven't joined any tournaments yet.
              </h3>
              <button
                onClick={() => navigate("/tournaments")}
                className="mt-6 btn-primary"
              >
                Browse Tournaments
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="p-4 bg-dark-300 rounded-lg"
                >
                  <h3 className="font-bold text-lg mb-2">{tournament.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{tournament.gameMode}</span>
                    <span>₹{tournament.entryFee}</span>
                    <span className="capitalize">{tournament.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
