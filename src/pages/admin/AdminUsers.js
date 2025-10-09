// 3. AdminUsers.js
// ==========================================
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Trophy,
  Ban,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 20);
      if (searchTerm) params.append("search", searchTerm);

      const { data } = await axios.get(`/api/admin/users?${params}`);
      setUsers(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, {
        isBanned: !currentStatus,
      });
      toast.success(
        `User ${!currentStatus ? "banned" : "unbanned"} successfully`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by username, email, or Free Fire UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center py-20">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">No Users Found</h3>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                    Stats
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-dark-300 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          UID: {user.freeFireUID || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          {user.mobileNumber || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-400">
                          {user.totalWins || 0} wins | ₹
                          {user.totalWinnings || 0}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Rank: {user.rank || "Unranked"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.isBanned ? (
                        <span className="badge bg-red-600">Banned</span>
                      ) : (
                        <span className="badge bg-green-600">Active</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleBanUser(user._id, user.isBanned)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isBanned
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                          title={user.isBanned ? "Unban User" : "Ban User"}
                        >
                          {user.isBanned ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-dark-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-200"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-primary-600 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-dark-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
