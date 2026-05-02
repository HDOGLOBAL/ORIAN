"use client";
import { useState, useEffect } from "react";
import { addCategory, getManufacturers } from "@/database/queries";
import { buildCategorySlugBase } from "@/utils/slugify";
import { toast } from "react-toastify";
import Image from "next/image";

const MAX_IMAGE_SIZE_MB = 5;

export default function AddCategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    manufacturerId: "",
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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
    const next = buildCategorySlugBase(m.name, formData.name);
    if (!next) return;
    setFormData((prev) => (prev.slug === next ? prev : { ...prev, slug: next }));
  }, [formData.manufacturerId, formData.name, slugManual, manufacturers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") setSlugManual(true);
    if (name === "manufacturerId") setSlugManual(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Check manufacturer selection
    if (!formData.manufacturerId || formData.manufacturerId.trim() === "") {
      toast.error("Please select a manufacturer", { position: "bottom-right" });
      setIsSubmitting(false);
      return;
    }

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

      const newCategory = await addCategory(dataToSubmit);

      toast.success(`"${newCategory.name}" category created!`, {
        position: "bottom-right",
      });
      setFormData({ name: "", slug: "", description: "", icon: "", manufacturerId: "" });
      setSlugManual(false);
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      toast.error(error.message, { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-[#0eadef] mb-4 md:mb-6">
          Add New Category
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                required
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
                Unique per manufacturer. Edit only if you need a custom URL segment; the
                server always prefixes the manufacturer.
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

          {/* Image Upload Section */}
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#0eadef] text-white rounded-md hover:bg-[#027aad] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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
                  {isUploadingImage ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
