"use client";

import { deleteManufacturerById, getManufacturers } from "@/database/queries";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AllManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this manufacturer?"
    );
    if (confirmed) {
      try {
        const res = await deleteManufacturerById(id);
        if (!res?.success && res?.existProduct) {
          toast.error("Cannot delete: Manufacturer has existing products!", {
            position: "bottom-right",
          });
        } else {
          setManufacturers((prev) => prev.filter((m) => m.id !== id));
          toast.success("Manufacturer deleted successfully!", {
            position: "bottom-right",
          });
        }
      } catch (err) {
        toast.error("Failed to delete manufacturer", {
          position: "bottom-right",
        });
        console.error("Delete error:", err);
        // Revert UI if deletion fails
        const originalManufacturers = await getManufacturers();
        setManufacturers(originalManufacturers);
      }
    }
  };

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        setIsLoading(true);
        const fetchedManufacturers = await getManufacturers();
        setManufacturers(fetchedManufacturers);
      } catch (err) {
        setError("Failed to load manufacturers. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  if (isLoading) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            All Manufacturers
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            All Manufacturers
          </h2>
          <div className="text-center py-10 text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-light text-[#0eadef] mb-6">
          All Manufacturers
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No manufacturers found.
                  </td>
                </tr>
              ) : (
                manufacturers.map((manufacturer) => (
                  <tr
                    key={manufacturer.id}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="px-4 py-2 border font-medium">
                      {manufacturer.id}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {manufacturer.name}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(manufacturer.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
