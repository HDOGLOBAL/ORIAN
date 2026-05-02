"use client";
import {
  createSubcategory,
  getCategories,
  getSubcategories,
  deleteSubcategory,
} from "@/database/queries";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubcategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const categoriesData = await getCategories();
      const subcategoriesData = await getSubcategories();

      setCategories(categoriesData);
      setSubcategories(subcategoriesData || []);

  
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      await createSubcategory(formData);

      // Reset form
      setFormData({
        name: "",
        slug: "",
        categoryId: "",
      });

      // Refresh the subcategories list
      await fetchData();

      toast.success("Subcategory created successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteSubcategory(id);

      // Remove the subcategory from the list
      setSubcategories((prev) => prev.filter((item) => item.id !== id));

      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.message || "Failed to delete subcategory. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    

      {/* Add Subcategory Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl mb-4">Add New Subcategory</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              disabled={categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                No categories available. Please create categories first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter subcategory name"
              required
              disabled={categories.length === 0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="subcategory-name"
              required
              disabled={categories.length === 0}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the name (auto-generated from name)
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || categories.length === 0}
          >
            {submitting ? "Creating..." : "Create Subcategory"}
          </button>
        </form>
      </div>

      {/* Subcategories List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">All Subcategories</h2>

        {subcategories.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">
            No subcategories found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Slug</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Created Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr
                    key={subcategory.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{subcategory.name}</td>
                    <td className="p-3">{subcategory.slug}</td>
                    <td className="p-3">
                      {subcategory.categoryId?.name || "Unknown Category"}
                    </td>
                    <td className="p-3">
                      {new Date(subcategory.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        disabled={deletingId === subcategory.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === subcategory.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subcategories.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Total: {subcategories.length} subcategories
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;
