// 2. AdminTournaments.js
// ==========================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminTournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  const fetchTournaments = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const { data } = await axios.get(`/api/admin/tournaments?${params}`);
      setTournaments(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch tournaments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament?"))
      return;

    try {
      await axios.delete(`/api/admin/tournaments/${id}`);
      toast.success("Tournament deleted successfully");
      fetchTournaments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete tournament"
      );
    }
  };

  const filteredTournaments = tournaments.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
          <p className="text-gray-400">Manage all tournaments</p>
        </div>
        <button
          onClick={() => navigate("/admin/tournaments/create")}
          className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="card text-center py-20">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No Tournaments Found
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first tournament to get started
          </p>
          <button
            onClick={() => navigate("/admin/tournaments/create")}
            className="btn-primary mx-auto"
          >
            Create Tournament
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="card hover:border-primary-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Tournament Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {tournament.title}
                    </h3>
                    <span
                      className={`badge ${
                        tournament.status === "upcoming"
                          ? "bg-blue-600"
                          : tournament.status === "live"
                          ? "bg-red-600"
                          : tournament.status === "completed"
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {tournament.currentParticipants}/
                        {tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{tournament.prizePool}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          tournament.tournamentDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="badge bg-purple-600">
                        {tournament.gameMode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/tournaments/${tournament._id}/edit`)
                    }
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/tournaments/${tournament._id}/registrations`
                      )
                    }
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    title="View Registrations"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tournament._id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTournaments;
