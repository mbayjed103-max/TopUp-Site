// 5. AdminWithdrawals.js
// ==========================================
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  User,
  CreditCard,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/withdrawals?status=${statusFilter}`
      );
      setWithdrawals(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch withdrawals");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async (withdrawalId, status) => {
    try {
      await axios.put(`/api/admin/withdrawals/${withdrawalId}/process`, {
        status,
        transactionId: status === "completed" ? transactionId : undefined,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
      });
      toast.success(`Withdrawal ${status} successfully`);
      setShowModal(false);
      setTransactionId("");
      setRejectionReason("");
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const openModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Withdrawal Management
        </h1>
        <p className="text-gray-400">Process user withdrawal requests</p>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
          >
            <option value="all">All Withdrawals</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Withdrawals List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="card text-center py-20">
          <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">
            No Withdrawals Found
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal._id}
              className="card hover:border-primary-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Withdrawal Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">
                      {withdrawal.userId?.username || "Unknown User"}
                    </h3>
                    <span
                      className={`badge ${
                        withdrawal.status === "pending"
                          ? "bg-yellow-600"
                          : withdrawal.status === "completed"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Amount</span>
                      <span className="font-bold text-green-400">
                        ₹{withdrawal.amount}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Method</span>
                      <span className="font-bold text-white">
                        {withdrawal.paymentMethod}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Requested</span>
                      <span className="font-bold text-white">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-dark-400 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Account Name:</span>
                      <span className="text-white font-semibold">
                        {withdrawal.accountName || withdrawal.upiId || "N/A"}
                      </span>
                    </div>
                    {withdrawal.accountNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">Account Number:</span>
                        <span className="text-white font-semibold">
                          {withdrawal.accountNumber}
                        </span>
                      </div>
                    )}
                    {withdrawal.ifscCode && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">IFSC:</span>
                        <span className="text-white font-semibold">
                          {withdrawal.ifscCode}
                        </span>
                      </div>
                    )}
                    {withdrawal.upiId && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">UPI ID:</span>
                        <span className="text-white font-semibold">
                          {withdrawal.upiId}
                        </span>
                      </div>
                    )}
                  </div>

                  {withdrawal.status === "completed" &&
                    withdrawal.transactionId && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="text-green-400 font-semibold ml-2">
                          {withdrawal.transactionId}
                        </span>
                      </div>
                    )}

                  {withdrawal.status === "rejected" &&
                    withdrawal.rejectionReason && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-400">Rejection Reason:</span>
                        <span className="text-red-400 ml-2">
                          {withdrawal.rejectionReason}
                        </span>
                      </div>
                    )}
                </div>

                {/* Actions */}
                {withdrawal.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(withdrawal)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Processing Withdrawal */}
      {showModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-300 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Process Withdrawal
              </h2>

              {/* Withdrawal Info */}
              <div className="bg-dark-400 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">User:</span>
                  <span className="text-white font-bold">
                    {selectedWithdrawal.userId?.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-green-400 font-bold text-xl">
                    ₹{selectedWithdrawal.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Method:</span>
                  <span className="text-white font-bold">
                    {selectedWithdrawal.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Details:</span>
                  <span className="text-white font-bold">
                    {selectedWithdrawal.accountNumber ||
                      selectedWithdrawal.upiId}
                  </span>
                </div>
              </div>

              {/* Transaction ID Input for Completion */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Transaction ID (for completion)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
                  placeholder="Enter transaction ID..."
                />
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-400 border border-gray-600 rounded-lg text-white focus:border-primary-600 focus:outline-none"
                  rows="3"
                  placeholder="Enter reason for rejection..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleProcessWithdrawal(selectedWithdrawal._id, "completed")
                  }
                  disabled={!transactionId}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Completed
                </button>
                <button
                  onClick={() =>
                    handleProcessWithdrawal(selectedWithdrawal._id, "rejected")
                  }
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTransactionId("");
                    setRejectionReason("");
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
