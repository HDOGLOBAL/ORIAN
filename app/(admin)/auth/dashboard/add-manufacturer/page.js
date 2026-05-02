"use client";
import { useState } from "react";
import { addManufacturer } from "@/database/queries";
import { toast } from "react-toastify";

export default function AddManufacturerForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newManufacturer = await addManufacturer(formData);
      toast.success(`"${newManufacturer.name}" manufacturer created!`, {
        position: "bottom-right",
      });
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error(error.message, { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-[#0eadef] mb-4 md:mb-6">
          Add New Manufacturer
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0eadef] focus:border-transparent"
              required
              placeholder="Manufacturer name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0eadef] focus:border-transparent"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#0eadef] text-white rounded-md hover:bg-[#027aad] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Manufacturer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
