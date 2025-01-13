import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Package } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  progress: "bg-indigo-100 text-indigo-800",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get("https://www.api.dyfru.com/api/v1/admin/get-all-order", {
        params: { page, limit: 6 },
      });
      const { data, totalPages } = response.data;
      setOrders(data);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (orderId, status) => {
    try {
      setLoading(true);
      await axios.put("https://www.api.dyfru.com/api/v1/admin/update-order-status", { orderId, status });
      fetchOrders(currentPage);
    } catch (err) {
      setError("Failed to update order status. Please try again later.");
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await axios.delete(`https://www.api.dyfru.com/api/v1/admin/delete-order/${orderId}`);
        fetchOrders(currentPage);
      } catch (err) {
        setError("Failed to delete order. Please try again later.");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </header>

        <div className="grid grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Order ID: {order.orderId}</h2>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <div className="mt-3">
                    <select
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue === "delete") {
                          handleDeleteOrder(order._id);
                        } else {
                          handleStatusChange(order._id, selectedValue);
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select Action
                      </option>
                      {["pending", "confirmed", "shipped", "delivered", "cancelled", "returned", "progress"].map(
                        (status) => (
                          <option key={status} value={status}>
                            Set to {status}
                          </option>
                        )
                      )}
                      <option value="delete" className="text-red-600">
                        Delete Order
                      </option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <select
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    >
                      <option value="" disabled selected>
                        Select Order Actions
                      </option>
                      {["Print Order", "View Order", "View User"].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                      <option value="delete" className="text-red-600">
                        Delete Order
                      </option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="text-sm text-gray-600">
                <p>Total Amount: <span className="font-medium">Rs :{order.totalAmount.toFixed(2)}</span></p>
                <p>Payment Type: <span className="font-medium">{order.paymentType}</span></p>
                <p>Order Date: <span className="font-medium">{new Date(order.orderDate).toLocaleString()}</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;
