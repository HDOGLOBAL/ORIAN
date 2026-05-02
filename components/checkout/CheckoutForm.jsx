"use client";

import React, { forwardRef } from "react";

const CheckoutForm = forwardRef(({ formData, handleChange }, ref) => {
  return (
    <form ref={ref} className="col-span-8 border border-gray-200 p-4 rounded">
      <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first-name" className="text-gray-600">
              First Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="first-name"
              className="input-box"
              value={formData?.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-gray-600">
              Last Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="last-name"
              className="input-box"
              value={formData?.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="text-gray-600">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            className="input-box"
            value={formData?.company}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="region" className="text-gray-600">
            Country/Region
          </label>
          <input
            type="text"
            name="region"
            id="region"
            className="input-box"
            value={formData?.region}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address" className="text-gray-600">
            Street address <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            className="input-box"
            value={formData?.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="text-gray-600">
            City <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="city"
            id="city"
            className="input-box"
            value={formData?.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-gray-600">
            Phone number <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            className="input-box"
            value={formData?.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-gray-600">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="input-box"
            value={formData?.email}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
});

CheckoutForm.displayName = "CheckoutForm";

export default CheckoutForm;
