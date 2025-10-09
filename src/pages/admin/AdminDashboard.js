// ==========================================
// 1. AdminDashboard.js
// ==========================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats");
      setStats(data.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
      console.error(error);
      // Set dummy data for display
      setStats({
        totalUsers: 150,
        totalTournaments: 25,
        pendingPayments: 8,
        pendingWithdrawals: 3,
        totalRevenue: 50000,
        totalPayouts: 15000,
        netRevenue: 35000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Monitor your platform statistics and activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-900 to-dark-300">
          <Users className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-sm text-gray-400">Total Users</div>
          <div className="text-3xl font-bold text-white">
            {stats?.totalUsers || 0}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-900 to-dark-300">
          <Trophy className="w-8 h-8 text-purple-400 mb-2" />
          <div className="text-sm text-gray-400">Total Tournaments</div>
          <div className="text-3xl font-bold text-white">
            {stats?.totalTournaments || 0}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-900 to-dark-300">
          <DollarSign className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-3xl font-bold text-green-400">
            ₹{stats?.totalRevenue || 0}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-900 to-dark-300">
          <TrendingUp className="w-8 h-8 text-yellow-400 mb-2" />
          <div className="text-sm text-gray-400">Net Revenue</div>
          <div className="text-3xl font-bold text-yellow-400">
            ₹{stats?.netRevenue || 0}
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-gaming">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              Pending Payments
            </h2>
            <span className="badge bg-yellow-600">
              {stats?.pendingPayments || 0}
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Payment verifications waiting for review
          </p>
          <button
            onClick={() => navigate("/admin/payments")}
            className="btn-primary w-full"
          >
            Review Payments
          </button>
        </div>

        <div className="card-gaming">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              Pending Withdrawals
            </h2>
            <span className="badge bg-red-600">
              {stats?.pendingWithdrawals || 0}
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Withdrawal requests pending approval
          </p>
          <button
            onClick={() => navigate("/admin/withdrawals")}
            className="btn-primary w-full"
          >
            Process Withdrawals
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/tournaments/create")}
            className="p-6 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-neon transition-all"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            Create Tournament
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-neon transition-all"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/tournaments")}
            className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl text-white font-bold hover:shadow-neon transition-all"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            All Tournaments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
