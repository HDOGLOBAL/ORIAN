"use client";

import { deleteCategoryById, getCategories, getManufacturers } from "@/database/queries";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import EditCategoryModal from "./EditCategoryModal";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const getManufacturerName = (manufacturerId) => {
    if (!manufacturerId) return "N/A";
    const manufacturer = manufacturers.find((m) => m.id === manufacturerId);
    return manufacturer?.name || "N/A";
  };

  const refetchCategories = async () => {
    try {
      const [fetchedCategories, fetchedManufacturers] = await Promise.all([
        getCategories(),
        getManufacturers(),
      ]);
      setCategories(fetchedCategories);
      setManufacturers(fetchedManufacturers);
    } catch (err) {
      // Silent error handling
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      try {
        const res = await deleteCategoryById(id);
        if (!res?.success && res?.existProduct) {
          toast.error("Failed the category has existing products!", {
            position: "bottom-right",
          });
        } else {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          toast.success("Category deleted successfully!", {
            position: "bottom-right",
          });
        }
      } catch (err) {
        toast.error("Failed to delete category", {
          position: "bottom-right",
        });
        // Revert UI if deletion fails
        const originalCategories = await getCategories();
        setCategories(originalCategories);
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditingCategory(null);
  };

  const handleEditSuccess = async (updatedCategory) => {
    handleEditClose();
    // Refetch fresh data from server
    await refetchCategories();
    toast.success("Category updated successfully!", {
      position: "bottom-right",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        const fetchedManufacturers = await getManufacturers();
        setCategories(fetchedCategories);
        setManufacturers(fetchedManufacturers);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-light text-[#0eadef] mb-6">
            All Categories
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
            All Categories
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
      <div className="bg-white p-4 sm:p-6 rounded shadow">
        <h2 className="text-xl sm:text-2xl font-light text-[#0eadef] mb-6">
          All Categories
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border">Image</th>
                <th className="px-4 py-3 border">ID</th>
                <th className="hidden lg:table-cell px-4 py-3 border">Manufacturer</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border text-center">Products</th>
                <th className="hidden lg:table-cell px-4 py-3 border text-center">Featured</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="px-4 py-2 border">
                      {category.icon ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                            priority={false}
                            unoptimized={true}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {category.id}
                    </td>

                    <td className="hidden lg:table-cell px-4 py-2 border font-medium">
                      {category.manufacturerName || getManufacturerName(category.manufacturerId)}
                    </td>

                    <td className="px-4 py-2 border font-medium">
                      {category.name}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      <Link
                        href={`/auth/dashboard/products?categoryId=${category.id}`}
                        className="inline-block bg-blue-100 text-blue-800 font-bold text-sm px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
                      >
                        {category.productCount ?? 0}
                      </Link>
                    </td>

                    <td className="hidden lg:table-cell px-4 py-2 border text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          category.isFeatured
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isFeatured ? "✓ Yes" : "✗ No"}
                      </span>
                    </td>

                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category?.id)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <EditCategoryModal
          category={editingCategory}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
