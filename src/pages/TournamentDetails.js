import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Trophy,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Copy,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchTournamentDetails();
    fetchParticipants();
    // eslint-disable-next-line
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      const res = await axios.get(`/tournaments/${id}`);
      setTournament(res.data.data);
    } catch (error) {
      toast.error("Failed to load tournament");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`/tournaments/${id}/participants`);
      setParticipants(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.info("Please login to register");
      navigate("/login");
      return;
    }

    if (!user.isProfileComplete) {
      toast.warning("Please complete your profile first");
      navigate("/profile");
      return;
    }

    setRegistering(true);
    try {
      await axios.post(`/tournaments/${id}/register`, {});
      toast.success("Registration successful! Please complete payment.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
          <button
            onClick={() => navigate("/tournaments")}
            className="btn-primary mt-4"
          >
            Browse Tournaments
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "text-blue-400",
      live: "text-red-400",
      completed: "text-green-400",
      cancelled: "text-yellow-400",
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="min-h-screen bg-dark-400 py-8">
      <div className="container mx-auto px-4">
        {/* Banner */}
        {tournament.banner && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={`http://localhost:5002${tournament.banner}`}
              alt={tournament.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <span className="badge bg-neon-purple text-white mb-2">
                {tournament.gameMode}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow">
                {tournament.title}
              </h1>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prize Pool & Entry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-gradient-to-br from-green-900 to-dark-300">
                <IndianRupee className="w-8 h-8 text-neon-green mb-2" />
                <div className="text-sm text-gray-400">Prize Pool</div>
                <div className="text-3xl font-bold text-neon-green">
                  ₹{tournament.prizePool}
                </div>
              </div>
              <div className="card bg-gradient-to-br from-blue-900 to-dark-300">
                <Trophy className="w-8 h-8 text-neon-blue mb-2" />
                <div className="text-sm text-gray-400">Entry Fee</div>
                <div className="text-3xl font-bold text-neon-blue">
                  ₹{tournament.entryFee}
                </div>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-neon-purple" />
                Tournament Details
              </h2>
              <p className="text-gray-300 whitespace-pre-line">
                {tournament.description}
              </p>
            </div>

            {/* Rules */}
            {tournament.rules && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                  Rules & Regulations
                </h2>
                <div className="text-gray-300 whitespace-pre-line">
                  {tournament.rules}
                </div>
              </div>
            )}

            {/* Room Details (if revealed) */}
            {tournament.isRoomRevealed && tournament.roomId && (
              <div className="card bg-gradient-to-br from-purple-900 to-dark-300">
                <h2 className="text-2xl font-bold mb-4">🎮 Room Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-dark-400 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">Room ID</div>
                      <div className="text-xl font-bold">
                        {tournament.roomId}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(tournament.roomId, "Room ID")
                      }
                      className="btn-secondary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-dark-400 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">Password</div>
                      <div className="text-xl font-bold">
                        {tournament.roomPassword}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(tournament.roomPassword, "Password")
                      }
                      className="btn-secondary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-neon-blue" />
                Participants ({participants.length}/{tournament.maxParticipants}
                )
              </h2>
              {participants.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No participants yet. Be the first!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-dark-300 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {participant.userId?.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {participant.userId?.rank}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="card-gaming sticky top-4">
              <div
                className={`text-center mb-4 ${getStatusColor(
                  tournament.status
                )}`}
              >
                <div className="text-sm font-semibold uppercase">Status</div>
                <div className="text-2xl font-bold">{tournament.status}</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-neon-purple" />
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="font-semibold">
                      {new Date(tournament.tournamentDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-neon-blue" />
                  <div>
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="font-semibold">
                      {tournament.tournamentTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-neon-green" />
                  <div>
                    <div className="text-xs text-gray-500">Mode</div>
                    <div className="font-semibold">{tournament.gameMode}</div>
                  </div>
                </div>
              </div>

              {tournament.status === "upcoming" && (
                <button
                  onClick={handleRegister}
                  disabled={
                    registering ||
                    tournament.currentParticipants >= tournament.maxParticipants
                  }
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering
                    ? "Registering..."
                    : tournament.currentParticipants >=
                      tournament.maxParticipants
                    ? "Tournament Full"
                    : `Join Tournament - ₹${tournament.entryFee}`}
                </button>
              )}

              {/* Social Links */}
              {(tournament.telegramChannel || tournament.whatsappGroup) && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="text-sm font-semibold mb-3">
                    Join Community
                  </div>
                  {tournament.telegramChannel && (
                    <a
                      href={tournament.telegramChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg mb-2 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Join Telegram Channel</span>
                    </a>
                  )}
                  {tournament.whatsappGroup && (
                    <a
                      href={tournament.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Join WhatsApp Group</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
