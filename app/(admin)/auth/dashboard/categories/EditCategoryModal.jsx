"use client";
import { useState, useEffect } from "react";
import { updateCategory, getManufacturers } from "@/database/queries";
import { buildCategorySlugBase } from "@/utils/slugify";
import { toast } from "react-toastify";
import Image from "next/image";

const MAX_IMAGE_SIZE_MB = 5;

export default function EditCategoryModal({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    icon: category.icon || "",
    isFeatured: category.isFeatured || false,
    manufacturerId: category.manufacturerId || "",
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(category.icon || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_imageBB_key;

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const manufacturersData = await getManufacturers();
        setManufacturers(manufacturersData);
      } catch (error) {
        toast.error("Failed to load manufacturers", {
          position: "bottom-right",
        });
      }
    };
    fetchManufacturers();
  }, []);

  useEffect(() => {
    if (slugManual) return;
    const m = manufacturers.find((x) => x.id === formData.manufacturerId);
    if (!m || !formData.name.trim()) return;

    const origMfr = category.manufacturerId || "";
    const nameOrMfrChanged =
      formData.name !== category.name || formData.manufacturerId !== origMfr;
    if (!nameOrMfrChanged) return;

    const next = buildCategorySlugBase(m.name, formData.name);
    if (!next) return;
    setFormData((prev) => (prev.slug === next ? prev : { ...prev, slug: next }));
  }, [
    formData.manufacturerId,
    formData.name,
    slugManual,
    manufacturers,
    category.name,
    category.manufacturerId,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "slug") setSlugManual(true);
    if (name === "manufacturerId") setSlugManual(false);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`, {
        position: "bottom-right",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, icon: "" }));
  };

  const uploadImageToImgBB = async (imageFile) => {
    const formDataUpload = new FormData();
    formDataUpload.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.icon;

      if (imageFile) {
        setIsUploadingImage(true);
        imageUrl = await uploadImageToImgBB(imageFile);
        setIsUploadingImage(false);
      }

      const dataToSubmit = {
        ...formData,
        icon: imageUrl,
      };

      if (!dataToSubmit.manufacturerId || dataToSubmit.manufacturerId.trim() === "") {
        toast.error("Please select a manufacturer", {
          position: "bottom-right",
        });
        setIsSubmitting(false);
        return;
      }

      const updatedCategory = await updateCategory(category.id, dataToSubmit);

      onSuccess(updatedCategory);
      toast.success("Category updated successfully!", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(error.message || "Failed to update category", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-semibold text-[#0eadef]">
            Edit Category
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Manufacturer *
              </label>
              <select
                name="manufacturerId"
                value={formData.manufacturerId}
                onChange={handleChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0eadef] focus:border-transparent"
              >
                <option value="">Select Manufacturer</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="Category name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                URL slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0eadef] focus:border-transparent"
                placeholder="auto from manufacturer + name"
              />
              <p className="text-xs text-gray-500">
                Unique per manufacturer. Changing name or manufacturer updates this unless
                you edit the slug manually.
              </p>
            </div>
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

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-[#0eadef] border-gray-300 rounded focus:ring-2 focus:ring-[#0eadef]"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm md:text-base font-medium text-gray-700 cursor-pointer"
            >
              Featured Category (Show on Homepage)
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Category Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      width={400}
                      height={192}
                      className="object-contain w-full h-full"
                      priority={false}
                      unoptimized={true}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove Image
                  </button>
                  <label className="w-full block px-4 py-2 bg-[#0eadef] text-white rounded-md hover:bg-[#027aad] transition-colors cursor-pointer text-center">
                    Change Image
                    <input
                      type="file"
                      name="icon"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="block cursor-pointer text-center">
                  <div className="flex flex-col items-center justify-center py-4">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Max size: {MAX_IMAGE_SIZE_MB}MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="icon"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#0eadef] text-white rounded-md hover:bg-[#027aad] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting || isUploadingImage ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  {isUploadingImage ? "Uploading..." : "Updating..."}
                </>
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
