// 4. AdminPayments.js
// ==========================================
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/payments?status=${statusFilter}`
      );
      setPayments(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, status) => {
    try {
      await axios.put(`/api/admin/payments/${paymentId}/verify`, {
        status,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
      });
      toast.success(`Payment ${status} successfully`);
      setShowModal(false);
      setRejectionReason("");
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Management
        </h1>
        <p className="text-gray-400">Review and verify payment transactions</p>
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
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="card text-center py-20">
          <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">No Payments Found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="card hover:border-primary-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Payment Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">
                      {payment.userId?.username || "Unknown User"}
                    </h3>
                    <span
                      className={`badge ${
                        payment.status === "pending"
                          ? "bg-yellow-600"
                          : payment.status === "verified"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Amount</span>
                      <span className="font-bold text-green-400">
                        ₹{payment.amount}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Method</span>
                      <span className="font-bold text-white">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Transaction ID</span>
                      <span className="font-bold text-white text-xs">
                        {payment.transactionId}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <span className="block text-xs mb-1">Date</span>
                      <span className="font-bold text-white">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {payment.tournamentId && (
                    <div className="mt-2 text-sm text-gray-400">
                      Tournament:{" "}
                      <span className="text-primary-400">
                        {payment.tournamentId.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {payment.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(payment)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleVerifyPayment(payment._id, "verified")
                      }
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      title="Verify"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowModal(true);
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Payment Details / Rejection */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-300 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Payment Details
              </h2>

              {/* Payment Screenshot */}
              {selectedPayment.screenshot && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    Payment Screenshot
                  </h3>
                  <img
                    src={`http://localhost:5002${selectedPayment.screenshot}`}
                    alt="Payment Proof"
                    className="w-full rounded-lg border border-gray-600"
                  />
                </div>
              )}

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">User</div>
                  <div className="text-white font-bold">
                    {selectedPayment.userId?.username}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Amount</div>
                  <div className="text-green-400 font-bold">
                    ₹{selectedPayment.amount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Method</div>
                  <div className="text-white font-bold">
                    {selectedPayment.paymentMethod}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Transaction ID
                  </div>
                  <div className="text-white font-bold text-xs">
                    {selectedPayment.transactionId}
                  </div>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Rejection Reason (Optional)
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
                    handleVerifyPayment(selectedPayment._id, "verified")
                  }
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Verify Payment
                </button>
                <button
                  onClick={() =>
                    handleVerifyPayment(selectedPayment._id, "rejected")
                  }
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Payment
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
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

export default AdminPayments;
