import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    searchTerm: '',
    isVerified: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.api.dyfru.com/api/v1/admin/get-users', {
        params: {
          page: pagination.currentPage,
          search: filters.searchTerm,
          startDate: filters.startDate,
          endDate: filters.endDate,
          isVerified: filters.isVerified,
        },
      });

      setUsers(response.data.data);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(response.data.total / 10), // Assuming 10 users per page
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  const handleDateChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      isVerified: e.target.value,
    });
  };

  const handlePaginationChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
  };

  const handleAction = (action, userId) => {
    if (action === 'block') {
      // Call block user API here
    } else if (action === 'delete') {
      // Call delete user API here
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      
      {/* Filters Section */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Search by Name, Email, or Phone</label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Verified</label>
          <select
            onChange={handleFilterChange}
            value={filters.isVerified}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">Loading...</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.Name}</td>
                <td className="py-2 px-4 border-b">{user.Email}</td>
                <td className="py-2 px-4 border-b">{user.ContactNumber}</td>
                <td className="py-2 px-4 border-b">{user.Role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleAction('block', user._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleAction('delete', user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePaginationChange(1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          First
        </button>
        <div>
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <button
          onClick={() => handlePaginationChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
