import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Trophy,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  Gamepad2,
} from "lucide-react";
import { toast } from "react-toastify";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gameMode: "",
    status: "upcoming",
  });

  const gameModes = [
    { value: "", label: "All Modes", icon: Gamepad2 },
    { value: "Solo", label: "Solo", icon: Users },
    { value: "Duo", label: "Duo", icon: Users },
    { value: "Squad", label: "Squad", icon: Users },
    { value: "1vs1", label: "1 vs 1", icon: Trophy },
    { value: "1vs4", label: "1 vs 4", icon: Trophy },
    { value: "Clash Squad", label: "Clash Squad", icon: Trophy },
    { value: "Battle Royale", label: "Battle Royale", icon: Trophy },
  ];

  const statusTabs = [
    { value: "upcoming", label: "Upcoming" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" },
  ];

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line
  }, [filters]);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.gameMode) params.append("gameMode", filters.gameMode);
      if (filters.status) params.append("status", filters.status);

      const res = await axios.get(`/tournaments?${params.toString()}`);
      setTournaments(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch tournaments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: "bg-blue-600 text-white",
      live: "bg-red-600 text-white animate-pulse",
      completed: "bg-gray-600 text-white",
      cancelled: "bg-yellow-600 text-white",
    };
    return badges[status] || badges.upcoming;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-dark-400 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Epic Tournaments
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your battlefield. Master your game mode. Claim your victory.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-300 rounded-lg p-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilters({ ...filters, status: tab.value })}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filters.status === tab.value
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-neon-purple" />
            Filter by Game Mode
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {gameModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setFilters({ ...filters, gameMode: mode.value })}
                className={`p-4 rounded-lg font-semibold transition-all text-center ${
                  filters.gameMode === mode.value
                    ? "bg-primary-600 text-white shadow-neon"
                    : "bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-white"
                }`}
              >
                <mode.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">{mode.label}</span>
                {filters.gameMode === mode.value && mode.value && (
                  <span className="block text-xs mt-1 text-neon-green">
                    ✓ Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton h-96 rounded-xl"></div>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No Tournaments Found
            </h3>
            <p className="text-gray-500">
              Check back later or try different filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Link
                key={tournament._id}
                to={`/tournaments/${tournament._id}`}
                className="card-gaming group hover:scale-105 transition-transform"
              >
                {/* Banner */}
                {tournament.banner ? (
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5002${tournament.banner}`}
                      alt={tournament.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`badge ${getStatusBadge(tournament.status)}`}
                      >
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 mb-4 rounded-lg bg-gradient-to-br from-primary-600 to-neon-purple flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}

                {/* Tournament Info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-neon-purple text-white">
                    {tournament.gameMode}
                  </span>
                  <span className="badge bg-primary-600 text-white">
                    Entry: ₹{tournament.entryFee}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-neon-purple transition-colors line-clamp-2">
                  {tournament.title}
                </h3>

                {/* Prize Pool */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-dark-300 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-neon-green" />
                  <div>
                    <div className="text-xs text-gray-400">Prize Pool</div>
                    <div className="text-lg font-bold text-neon-green">
                      ₹{tournament.prizePool}
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(tournament.tournamentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{tournament.tournamentTime}</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      {tournament.currentParticipants}/
                      {tournament.maxParticipants} Players
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="text-sm font-semibold text-neon-blue">
                    {Math.round(
                      (tournament.currentParticipants /
                        tournament.maxParticipants) *
                        100
                    )}
                    %
                  </div>
                </div>

                <div className="mt-2 h-2 bg-dark-400 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-neon-blue rounded-full transition-all"
                    style={{
                      width: `${
                        (tournament.currentParticipants /
                          tournament.maxParticipants) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                {/* Action Button */}
                <button className="mt-4 w-full py-3 bg-gradient-to-r from-primary-600 to-neon-purple rounded-lg font-semibold hover:shadow-neon transition-all">
                  {tournament.status === "upcoming"
                    ? "Join Tournament"
                    : tournament.status === "live"
                    ? "Watch Live"
                    : "View Results"}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
