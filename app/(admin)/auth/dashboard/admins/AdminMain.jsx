"use client";

import { useState, useEffect } from "react";
import AddAdminForm from "../admin-components/addAdmin";
import { deleteUserById, getAllUsers } from "@/database/queries"; // Import your user fetching function
import { toast } from "react-toastify";

export default function AdminMain({ adminIn }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        // Get only admin users (isAdmin: true)
        const adminUsers = await getAllUsers({ isAdmin: true });
        setAdmins(adminUsers);
      } catch (err) {
        setError("Failed to load admins");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete the Admin?");

    if (confirmed) {
      try {
        if (id !== adminIn) {
          await deleteUserById(id);
          setAdmins((prev) => prev.filter((admin) => admin.id !== id));
          toast.success("Admin deleted successfully!", {
            position: "bottom-right",
          });
        } else {
          setError("Current Admin can't be deleted!");
        }
      } catch (err) {
        setError("Failed to delete admin");
        console.error("Delete error:", err);
      }
    }
  };

  const handleAddAdmin = (newAdmin) => {
    setAdmins((prev) => [...prev, newAdmin]);
  };

  if (loading) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-20 p-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Loading admins...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-20 p-6">
        <div className="bg-white rounded shadow p-6 text-red-500">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:ml-64 bg-blueGray-100">
      <div className="flex flex-col md:flex-row gap-8 p-6 mt-20">
        {/* Admin List Table */}
        <div className="w-full md:w-2/3 bg-white rounded shadow p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Admin List</h2>
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {admin.name || admin.username}
                  </td>
                  <td className="px-4 py-2 border">{admin.email}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Admin Form */}
        <AddAdminForm onAdd={handleAddAdmin} />
      </div>
    </div>
  );
}
