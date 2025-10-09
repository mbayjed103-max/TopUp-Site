// 3. Leaderboard.js
// ==========================================
import React, { useState, useEffect } from "react";
import { Crown, Trophy, IndianRupee, Target, Flame } from "lucide-react";
import axios from "axios";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState({
    totalElitePlayers: 0,
    totalWinnings: 0,
    totalChampionships: 0,
  });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get("/api/leaderboard");
      setPlayers(data.data);
      calculateStats(data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      // Sample data for display
      setPlayers([]);
      setStats({
        totalElitePlayers: 0,
        totalWinnings: 0,
        totalChampionships: 0,
      });
    }
  };

  const calculateStats = (playerData) => {
    setStats({
      totalElitePlayers: playerData.length,
      totalWinnings: playerData.reduce(
        (sum, p) => sum + (p.totalWinnings || 0),
        0
      ),
      totalChampionships: playerData.reduce(
        (sum, p) => sum + (p.totalWins || 0),
        0
      ),
    });
  };

  return (
    <div className="min-h-screen bg-dark-400 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 text-white">HALL OF FAME</h1>
          <p className="text-gray-400 text-lg">
            Meet the legendary players who dominated the battlefield and earned
            their place in history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-gaming text-center">
            <Flame className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <div className="text-5xl font-bold text-orange-500 mb-2">
              {stats.totalElitePlayers}
            </div>
            <div className="text-gray-400">Elite Players</div>
          </div>

          <div className="card-gaming text-center">
            <IndianRupee className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-5xl font-bold text-green-500 mb-2">
              ₹{stats.totalWinnings}
            </div>
            <div className="text-gray-400">Total Winnings</div>
          </div>

          <div className="card-gaming text-center">
            <Target className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <div className="text-5xl font-bold text-purple-500 mb-2">
              {stats.totalChampionships}
            </div>
            <div className="text-gray-400">Championships Won</div>
          </div>
        </div>

        {/* Complete Rankings */}
        <div className="card-gaming">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Complete Rankings
          </h2>

          {players.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No Champions Yet
              </h3>
              <p className="text-gray-500">
                Be the first to claim your place in the Hall of Fame!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player._id}
                  className="flex items-center gap-4 p-4 bg-dark-300 rounded-lg hover:bg-dark-200 transition-colors"
                >
                  {/* Rank */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-gray-400 text-black"
                        : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-primary-600 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-600 to-neon-purple">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {player.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-white">
                      {player.username}
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.rank || "Unranked"}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-green-500 font-bold">
                      ₹{player.totalWinnings || 0}
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.totalWins || 0} Wins
                    </div>
                  </div>

                  {/* Trophy */}
                  {index < 3 && (
                    <Trophy
                      className={`w-6 h-6 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : "text-orange-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
