"use client";

import { createUser } from "@/database/queries";
import { useState } from "react";

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      else if (!symbolRegex.test(formData.password))
        newErrors.password = "Password must include at least one symbol";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const newAdmin = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: true,
      };

      setLoading(true);

      console.log("Creating user with data:", newAdmin);
      try {
        const response = await createUser(newAdmin);

        if (!response.success) {
          throw new Error(response.error);
        }
        setSuccess("Admin successfully created.");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setErrors({ api: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full md:w-[600px] bg-white rounded shadow p-6">
      <div className="min-h-screen flex  justify-center px-4">
        <div className="w-full bg-white rounded-lg  p-8">
          <h2 className="text-xl  text-center mb-2">Create An Admin</h2>
          <p className="text-sm text-center text-blue-500 font-medium mb-6">
            You are creating an <span className="font-semibold">Admin</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* API Error */}
            {errors.api && (
              <p className="text-red-500 text-sm text-center">{errors.api}</p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 text-white font-medium rounded ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0eadef] hover:bg-[#079bda]"
                }`}
              >
                {loading ? "Creating Admin..." : "Create An Admin"}
              </button>

              {success && (
                <p className="text-green-600 text-sm text-center mt-3">
                  {success}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
