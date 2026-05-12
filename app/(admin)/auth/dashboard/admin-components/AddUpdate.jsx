// "use client";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import JoditRich from "./RichText";
// import {
//   createProduct,
//   getCategoriesByManufacturer,
//   getManufacturers,
//   getProductById,
//   updateProduct,
//   getSubcategoriesByCategory,
// } from "@/database/queries";
// import Image from "next/image";

// export default function AddUpdate({ updateId = false }) {
//   const [form, setForm] = useState({
//     name: "",
//     namePt: "",
//     nameFr: "",
//     nameEs: "",
//     nameHe: "",
//     nameDe: "",
//     image: "",
//     priceUSD: "",
//     priceEUR: "",
//     priceGBP: "",       // ✅ GBP price for UK
//     discountUSD: "",
//     discountEUR: "",
//     discountGBP: "",    // ✅ GBP discount price for UK
//     reviewsNumber: "",
//     ratings: "",
//     manufacturerId: "",
//     categoryId: "",
//     subcategoryId: "",
//     description: "",
//     descriptionPt: "",
//     descriptionFr: "",
//     descriptionEs: "",
//     descriptionHe: "",
//     descriptionDe: "",
//     sizes: [],
//     colors: [],
//     quantity: "",
//     minStock: "",
//     visibility: "public",
//     shippingEu: "",
//     shippingAsia: "",
//     shippingPt: "",
//     shippingFr: "",
//     sku: "",
//     shippingWorld: "",
//     shippingSp: "",
//     discountCodes: [],
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [manufacturers, setManufacturers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingSubcategories, setLoadingSubcategories] = useState(false);
//   const [showCouponForm, setShowCouponForm] = useState(false);
//   const [currentCoupon, setCurrentCoupon] = useState({
//     code: "",
//     value: "",
//     isActive: true,
//   });
//   const MAX_IMAGE_SIZE_MB = 1;
//   const IMGBB_API_KEY = process.env.NEXT_PUBLIC_imageBB_key;

//   const getEntityId = (value) => {
//     if (!value) return "";
//     if (typeof value === "string") return value;
//     return value.id || value._id?.toString() || "";
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "manufacturerId") {
//       setForm((prev) => ({
//         ...prev,
//         manufacturerId: value,
//         categoryId: "",
//         subcategoryId: "",
//       }));
//       setSubcategories([]);
//       if (value) {
//         fetchCategoriesByManufacturer(value);
//       } else {
//         setCategories([]);
//       }
//     } else if (name === "categoryId") {
//       setForm((prev) => ({
//         ...prev,
//         categoryId: value,
//         subcategoryId: "",
//       }));
//       if (value) {
//         fetchSubcategoriesByCategory(value);
//       } else {
//         setSubcategories([]);
//       }
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleCouponChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setCurrentCoupon((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const addCouponCode = () => {
//     if (!currentCoupon.code || !currentCoupon.value) {
//       toast.error("Coupon code and value are required");
//       return;
//     }
//     const discountValue = parseFloat(currentCoupon.value);
//     if (isNaN(discountValue) || discountValue <= 0) {
//       toast.error("Discount value must be a positive number");
//       return;
//     }
//     const newCoupon = {
//       ...currentCoupon,
//       value: discountValue,
//     };
//     setForm((prev) => ({
//       ...prev,
//       discountCodes: [newCoupon],
//     }));
//     setCurrentCoupon({
//       code: "",
//       value: "",
//       isActive: true,
//     });
//     setShowCouponForm(false);
//     toast.success("Coupon code added successfully");
//   };

//   const removeCouponCode = () => {
//     setForm((prev) => ({
//       ...prev,
//       discountCodes: [],
//     }));
//     toast.success("Coupon code removed");
//   };

//   const editCouponCode = () => {
//     if (form.discountCodes.length > 0) {
//       setCurrentCoupon(form.discountCodes[0]);
//       setShowCouponForm(true);
//     }
//   };

//   const [loadingCategories, setLoadingCategories] = useState(false);

//   const fetchCategoriesByManufacturer = async (manufacturerId) => {
//     setLoadingCategories(true);
//     try {
//       const categoriesData = await getCategoriesByManufacturer(manufacturerId);
//       setCategories(categoriesData || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to load categories");
//       setCategories([]);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const fetchSubcategoriesByCategory = async (categoryId) => {
//     setLoadingSubcategories(true);
//     try {
//       const subcategoriesData = await getSubcategoriesByCategory(categoryId);
//       setSubcategories(subcategoriesData);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       toast.error("Failed to load subcategories");
//       setSubcategories([]);
//     } finally {
//       setLoadingSubcategories(false);
//     }
//   };

//   useEffect(() => {
//     if (updateId) {
//       const fetchProduct = async () => {
//         try {
//           const product = await getProductById(updateId);
//           setForm({
//             name: product.name || "",
//             namePt: product.namePt || "",
//             nameFr: product.nameFr || "",
//             nameEs: product.nameEs || "",
//             nameHe: product.nameHe || "",
//             nameDe: product.nameDe || "",
//             image: product.image || "",
//             priceUSD: product.price?.usd?.toString() || "",
//             priceEUR: product.price?.eur?.toString() || "",
//             priceGBP: product.price?.gbp?.toString() || "",       // ✅ GBP
//             discountUSD: product.discountPrice?.usd?.toString() || "",
//             discountEUR: product.discountPrice?.eur?.toString() || "",
//             discountGBP: product.discountPrice?.gbp?.toString() || "", // ✅ GBP
//             reviewsNumber: product.reviewsNumber?.toString() || "0",
//             ratings: product.ratings?.toString() || "0",
//             manufacturerId: getEntityId(product.manufacturerId),
//             categoryId: getEntityId(product.categoryId),
//             subcategoryId: getEntityId(product.subcategoryId),
//             description: product.description || "",
//             descriptionPt: product.descriptionPt || "",
//             descriptionFr: product.descriptionFr || "",
//             descriptionEs: product.descriptionEs || "",
//             descriptionHe: product.descriptionHe || "",
//             descriptionDe: product.descriptionDe || "",
//             sizes: product.sizes || [],
//             colors: product.colors || [],
//             quantity: product.quantity?.toString() || "0",
//             minStock: product.minStock?.toString() || "0",
//             visibility: product.visibility || "public",
//             features: product.features || [],
//             sku: product.sku || "",
//             shippingEu: product.shippingEu || "",
//             shippingAsia: product.shippingAsia || "",
//             shippingPt: product.shippingPt || "",
//             shippingFr: product.shippingFr || "",
//             shippingSp: product.shippingSp || "",
//             shippingWorld: product.shippingWorld || "",
//             discountCodes: product.discountCodes || [],
//           });
//           if (product.manufacturerId) {
//             fetchCategoriesByManufacturer(getEntityId(product.manufacturerId));
//           }
//           if (product.categoryId) {
//             fetchSubcategoriesByCategory(getEntityId(product.categoryId));
//           }
//           if (product.image) {
//             setImagePreview(product.image);
//           }
//         } catch (err) {
//           console.error(err);
//           toast.error("Failed to load product data");
//         }
//       };
//       fetchProduct();
//     }
//   }, [updateId]);

//   useEffect(() => {
//     async function fetchManufacturers() {
//       try {
//         const data = await getManufacturers();
//         setManufacturers(data);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     fetchManufacturers();
//   }, []);

//   // Categories are now fetched based on selected manufacturer
//   // No need to load all categories independently

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
//       alert(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`);
//       return;
//     }
//     const previewUrl = URL.createObjectURL(file);
//     setImageFile(file);
//     setImagePreview(previewUrl);
//   };

//   const handleRemoveImage = () => {
//     setImageFile(null);
//     setImagePreview("");
//     setForm((prev) => ({ ...prev, image: "" }));
//   };

//   const uploadImageToImgBB = async (imageFile) => {
//     const formData = new FormData();
//     formData.append("image", imageFile);

     
//     try {
//       const response = await fetch(
//         `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );


//       if (!response.ok) {
//         throw new Error("Image upload failed");
//       }
//       const data = await response.json();
//       return data.data.url;
//     } catch (error) {
//       console.error("Error uploading image to ImgBB:", error);
//       throw error;
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       let imageUrl = form.image;
//       if (imageFile) {
//         console.log(imageFile);

//         imageUrl = await uploadImageToImgBB(imageFile);
//       }
//       const eurPrice = form.priceEUR?.toString().trim() || "";
//       const eurDiscount = form.discountEUR?.toString().trim() || "";
//       const gbpPrice = form.priceGBP?.toString().trim() || "";       // ✅ GBP
//       const gbpDiscount = form.discountGBP?.toString().trim() || ""; // ✅ GBP
//       const productData = {
//         ...form,
//         priceUSD: eurPrice || form.priceUSD,
//         priceEUR: eurPrice || form.priceEUR,
//         priceGBP: gbpPrice || form.priceGBP,           // ✅ GBP
//         discountUSD: eurDiscount || form.discountUSD,
//         discountEUR: eurDiscount || form.discountEUR,
//         discountGBP: gbpDiscount || form.discountGBP,  // ✅ GBP
//         manufacturerId: getEntityId(form.manufacturerId),
//         categoryId: getEntityId(form.categoryId),
//         subcategoryId: getEntityId(form.subcategoryId),
//         image: imageUrl,
//         price: {
//           usd: eurPrice ? parseFloat(eurPrice) : undefined,
//           eur: eurPrice ? parseFloat(eurPrice) : undefined,
//           gbp: gbpPrice ? parseFloat(gbpPrice) : undefined, // ✅ GBP
//         },
//         discountPrice: {
//           usd: eurDiscount ? parseFloat(eurDiscount) : undefined,
//           eur: eurDiscount ? parseFloat(eurDiscount) : undefined,
//           gbp: gbpDiscount ? parseFloat(gbpDiscount) : undefined, // ✅ GBP
//         },
//         isActive: form.visibility === "public",
//         quantity: parseInt(form.quantity),
//         reviewsNumber: parseInt(form.reviewsNumber),
//         ratings: parseFloat(form.ratings),
//         sku: form.sku,
//         discountCodes:
//           form.discountCodes.length > 0
//             ? [
//                 {
//                   ...form.discountCodes[0],
//                   value: parseFloat(form.discountCodes[0].value),
//                 },
//               ]
//             : [],
//       };
//       let res;
//       if (updateId) {
//         console.log("here is the update data.......", productData);
//         res = await updateProduct(updateId, productData);
//       } else {
//         console.log("here is the data.......", productData);
//         res = await createProduct(productData);
//       }
//       const ok =
//         res?.success === true ||
//         res?.status === 201 ||
//         res?.status === 200;
//       if (ok) {
//         toast.success(
//           updateId
//             ? "Product updated successfully!"
//             : "Product added successfully!",
//           { position: "bottom-right" }
//         );
//         if (!updateId) {
//           setForm({
//             name: "",
//             namePt: "",
//             nameFr: "",
//             nameEs: "",
//             nameHe: "",
//     nameDe: "",
//             image: "",
//             priceUSD: "",
//             priceEUR: "",
//             priceGBP: "",    // ✅ GBP
//             discountUSD: "",
//             discountEUR: "",
//             discountGBP: "", // ✅ GBP
//             reviewsNumber: "0",
//             ratings: "0",
//             manufacturerId: "",
//             categoryId: "",
//             subcategoryId: "",
//             description: "",
//             descriptionPt: "",
//             descriptionFr: "",
//             descriptionEs: "",
//             descriptionHe: "",
//     descriptionDe: "",
//             sizes: [],
//             colors: [],
//             quantity: "0",
//             visibility: "public",
//             features: [],
//             sku: "",
//             shippingEu: "",
//             shippingAsia: "",
//             shippingPt: "",
//             shippingFr: "",
//             shippingWorld: "",
//             shippingSp: "",
//             discountCodes: [],
//           });
//           setImageFile(null);
//           setImagePreview("");
//           setSubcategories([]);
//         }
//       } else {
//         const parts = [res?.message, ...(Array.isArray(res?.errors) ? res.errors : [])].filter(
//           Boolean
//         );
//         throw new Error(parts.length ? parts.join(" ") : "Error processing product");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error(
//         error.message || "An error occurred while submitting the form"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const Label = ({ children, required }) => (
//     <label className="block text-sm font-medium mb-1">
//       {children} {required && <span className="text-red-500">*</span>}
//     </label>
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-10">
//       <h2 className="text-2xl text-[#0eadef] font-bold mb-6">
//         {updateId ? "Update Product" : "Add Product"}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Name fields */}
//         <div>
//           <Label required>Name (English)</Label>
//           <input
//             type="text"
//             name="name"
//             required
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
//           <div>
//             <Label>Name (Portuguese)</Label>
//             <input
//               type="text"
//               name="namePt"
//               value={form.namePt}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Name (French)</Label>
//             <input
//               type="text"
//               name="nameFr"
//               value={form.nameFr}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Name (Spanish)</Label>
//             <input
//               type="text"
//               name="nameEs"
//               value={form.nameEs}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Name (Hebrew)</Label>
//             <input
//               type="text"
//               name="nameHe"
//               value={form.nameHe}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               dir="rtl"
//             />
//           </div>
//           <div>
//             <Label>Name (German / Deutsch)</Label>
//             <input
//               type="text"
//               name="nameDe"
//               value={form.nameDe}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Image field */}
//         <div>
//           <Label required>Image</Label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="w-full border p-2 rounded"
//           />
//           {imagePreview && (
//             <div className="mt-4">
//               <div className="relative w-48 h-48">
//                 <Image
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover rounded border"
//                   width={100}
//                   height={100}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Price fields */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* <div>
//             <Label required>Price (USD)</Label>
//             <input
//               type="number"
//               name="priceUSD"
//               required
//               value={form.priceUSD}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div> */}
//           <div>
//             <Label required>Price (EUR) €</Label>
//             <input
//               type="number"
//               name="priceEUR"
//               required
//               min="0"
//               step="any"
//               value={form.priceEUR}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Stored as both USD and EUR in the database (same amount).
//             </p>
//           </div>
//           {/* ✅ NEW: GBP Price for UK */}
//           <div>
//             <Label required>Price (GBP) £</Label>
//             <input
//               type="number"
//               name="priceGBP"
//               required
//               min="0"
//               step="any"
//               value={form.priceGBP}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Price shown to UK visitors (£ GBP).
//             </p>
//           </div>
//           {/* <div>
//             <Label>Discount Price (USD)</Label>
//             <input
//               type="number"
//               name="discountUSD"
//               value={form.discountUSD}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div> */}
//           <div>
//             <Label>Discount Price (EUR) €</Label>
//             <input
//               type="number"
//               name="discountEUR"
//               value={form.discountEUR}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           {/* ✅ NEW: GBP Discount Price for UK */}
//           <div>
//             <Label>Discount Price (GBP) £</Label>
//             <input
//               type="number"
//               name="discountGBP"
//               value={form.discountGBP}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Description fields */}
//         <div>
//           <Label required>Description (English)</Label>
//           <JoditRich setForm={setForm} form={form} />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
//           <div>
//             <Label>Description (Portuguese)</Label>
//             <JoditRich setForm={setForm} form={form} field="descriptionPt" />
//           </div>
//           <div>
//             <Label>Description (French)</Label>
//             <JoditRich setForm={setForm} form={form} field="descriptionFr" />
//           </div>
//           <div>
//             <Label>Description (Spanish)</Label>
//             <JoditRich setForm={setForm} form={form} field="descriptionEs" />
//           </div>
//           <div>
//             <Label>Description (Hebrew)</Label>
//             <div dir="rtl">
//               <JoditRich setForm={setForm} form={form} field="descriptionHe" />
//             </div>
//           </div>
//           <div>
//             <Label>Description (German / Deutsch)</Label>
//             <JoditRich setForm={setForm} form={form} field="descriptionDe" />
//           </div>
//         </div>

//         {/* Category and manufacturer fields */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Manufacturer</Label>
//             <select
//               name="manufacturerId"
//               value={form.manufacturerId}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select manufacturer</option>
//               {manufacturers.map((manu) => (
//                 <option key={manu.id} value={manu.id}>
//                   {manu.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <Label>Category</Label>
//             <select
//               name="categoryId"
//               value={form.categoryId}
//               onChange={handleChange}
//               disabled={!form.manufacturerId || loadingCategories}
//               className="w-full border p-2 rounded disabled:opacity-50"
//             >
//               <option value="">Select category</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {loadingCategories && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Loading categories...
//               </p>
//             )}
//             {form.manufacturerId &&
//               categories.length === 0 &&
//               !loadingCategories && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   No categories available for this manufacturer
//                 </p>
//               )}
//           </div>
//           <div>
//             <Label>Subcategory</Label>
//             <select
//               name="subcategoryId"
//               value={form.subcategoryId}
//               onChange={handleChange}
//               disabled={!form.categoryId || loadingSubcategories}
//               className="w-full border p-2 rounded disabled:opacity-50"
//             >
//               <option value="">Select subcategory</option>
//               {subcategories.map((subcat) => (
//                 <option key={subcat.id} value={subcat.id}>
//                   {subcat.name}
//                 </option>
//               ))}
//             </select>
//             {loadingSubcategories && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Loading subcategories...
//               </p>
//             )}
//             {form.categoryId &&
//               subcategories.length === 0 &&
//               !loadingSubcategories && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   No subcategories available for this category
//                 </p>
//               )}
//           </div>
//           <div>
//             <Label required>Visibility</Label>
//             <select
//               name="visibility"
//               required
//               value={form.visibility}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="public">Public</option>
//               <option value="private">Private</option>
//             </select>
//           </div>
//         </div>

//         {/* Quantity and SKU fields */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label required>Quantity</Label>
//             <input
//               type="number"
//               name="quantity"
//               required
//               value={form.quantity}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label required>SKU</Label>
//             <input
//               type="text"
//               name="sku"
//               required
//               value={form.sku}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Min Stock</Label>
//             <input
//               type="number"
//               name="minStock"
//               value={form.minStock}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Coupon/Discount Codes Section */}
//         <div className="border-t pt-6">
//           <h3 className="text-lg mb-4 text-[#0eadef]">Coupon Code</h3>
//           {form.discountCodes.length > 0 ? (
//             <div className="mb-4">
//               <h4 className="font-medium mb-2">Current Coupon:</h4>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
//                 <div>
//                   <span className="font-mono bg-yellow-100 px-2 py-1 rounded mr-2">
//                     {form.discountCodes[0].code}
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     $ / € {form.discountCodes[0].value} off
//                   </span>
//                   {form.discountCodes[0].isActive ? (
//                     <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                       Active
//                     </span>
//                   ) : (
//                     <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
//                       Inactive
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     type="button"
//                     onClick={editCouponCode}
//                     className="text-blue-500 hover:text-blue-700 text-sm"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={removeCouponCode}
//                     className="text-red-500 hover:text-red-700 text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             !showCouponForm && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCurrentCoupon({
//                     code: "",
//                     value: "",
//                     isActive: true,
//                   });
//                   setShowCouponForm(true);
//                 }}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
//               >
//                 Add Coupon Code
//               </button>
//             )
//           )}
//           {showCouponForm && (
//             <div className="bg-gray-50 p-4 rounded border mb-4">
//               <h4 className="font-medium mb-3">
//                 {form.discountCodes.length > 0
//                   ? "Update Coupon Code"
//                   : "Add New Coupon Code"}
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label required>Coupon Code</Label>
//                   <input
//                     type="text"
//                     name="code"
//                     value={currentCoupon.code}
//                     onChange={handleCouponChange}
//                     className="w-full border p-2 rounded uppercase"
//                     placeholder="SUMMER25"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label required>Discount Amount ($)</Label>
//                   <input
//                     type="number"
//                     name="value"
//                     value={currentCoupon.value}
//                     onChange={handleCouponChange}
//                     className="w-full border p-2 rounded"
//                     placeholder="10.00"
//                     min="0"
//                     step="0.01"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center mt-3">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={currentCoupon.isActive}
//                   onChange={handleCouponChange}
//                   className="mr-2"
//                   id="couponActive"
//                 />
//                 <label htmlFor="couponActive" className="text-sm">
//                   Active
//                 </label>
//               </div>
//               <div className="flex justify-end space-x-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={addCouponCode}
//                   className="bg-[#0092d1] text-white px-2 py-1 rounded hover:bg-[#0eacf0]"
//                 >
//                   {form.discountCodes.length > 0
//                     ? "Update Coupon"
//                     : "Add Coupon"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowCouponForm(false)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Shipping fields */}
//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <Label>Shipping Cost EU</Label>
//             <input
//               type="number"
//               name="shippingEu"
//               value={form.shippingEu}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Shipping Cost Spain</Label>
//             <input
//               type="number"
//               name="shippingSp"
//               value={form.shippingSp}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Shipping Portugal</Label>
//             <input
//               type="number"
//               name="shippingPt"
//               value={form.shippingPt}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Shipping Cost France</Label>
//             <input
//               type="number"
//               name="shippingFr"
//               value={form.shippingFr}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Shipping Cost Asia</Label>
//             <input
//               type="number"
//               name="shippingAsia"
//               value={form.shippingAsia}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div>
//             <Label>Shipping Cost World Wide</Label>
//             <input
//               type="number"
//               name="shippingWorld"
//               value={form.shippingWorld}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="bg-[#0eadef] text-white px-6 py-3 rounded hover:bg-[#049cde] disabled:bg-blue-300 font-medium"
//           disabled={isSubmitting}
//         >
//           {isSubmitting
//             ? updateId
//               ? "Updating..."
//               : "Creating..."
//             : updateId
//             ? "Update Product"
//             : "Create Product"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JoditRich from "./RichText";
import {
  createProduct,
  getCategoriesByManufacturer,
  getManufacturers,
  getProductById,
  updateProduct,
  getSubcategoriesByCategory,
} from "@/database/queries";
import Image from "next/image";

export default function AddUpdate({ updateId = false }) {
  const [form, setForm] = useState({
    name: "",
    namePt: "",
    nameFr: "",
    nameEs: "",
    nameHe: "",
    nameDe: "",
    nameIt: "",
    image: "",
    priceUSD: "",
    priceEUR: "",
    priceGBP: "",       // ✅ GBP price for UK
    discountUSD: "",
    discountEUR: "",
    discountGBP: "",    // ✅ GBP discount price for UK
    reviewsNumber: "",
    ratings: "",
    manufacturerId: "",
    manufacturerIds: [],
    categoryId: "",
    subcategoryId: "",
    description: "",
    descriptionPt: "",
    descriptionFr: "",
    descriptionEs: "",
    descriptionHe: "",
    descriptionDe: "",
    descriptionIt: "",
    sizes: [],
    colors: [],
    quantity: "",
    minStock: "",
    visibility: "public",
    shippingEu: "",
    shippingAsia: "",
    shippingPt: "",
    shippingFr: "",
    sku: "",
    shippingWorld: "",
    shippingSp: "",
    discountCodes: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({ usd: 1.08, gbp: 0.86 });
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Auto-calculate USD & GBP when EUR price changes
  const convertedUSD = form.priceEUR && exchangeRates.usd
    ? (parseFloat(form.priceEUR) * exchangeRates.usd).toFixed(2)
    : "";
  const convertedGBP = form.priceEUR && exchangeRates.gbp
    ? (parseFloat(form.priceEUR) * exchangeRates.gbp).toFixed(2)
    : "";
  const convertedDiscountUSD = form.discountEUR && exchangeRates.usd
    ? (parseFloat(form.discountEUR) * exchangeRates.usd).toFixed(2)
    : "";
  const convertedDiscountGBP = form.discountEUR && exchangeRates.gbp
    ? (parseFloat(form.discountEUR) * exchangeRates.gbp).toFixed(2)
    : "";
  const [currentCoupon, setCurrentCoupon] = useState({
    code: "",
    value: "",
    isActive: true,
  });
  const MAX_IMAGE_SIZE_MB = 1;
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_imageBB_key;

  const getEntityId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.id || value._id?.toString() || "";
  };

  const handleManufacturerToggle = (id) => {
    setForm((prev) => {
      const already = prev.manufacturerIds.includes(id);
      const next = already
        ? prev.manufacturerIds.filter((mid) => mid !== id)
        : [...prev.manufacturerIds, id];
      // Update single manufacturerId (first selected) and reset category cascade
      const primary = next[0] || "";
      const categoryId = primary !== prev.manufacturerIds[0] ? "" : prev.categoryId;
      const subcategoryId = primary !== prev.manufacturerIds[0] ? "" : prev.subcategoryId;
      if (primary !== prev.manufacturerIds[0]) {
        setSubcategories([]);
        if (primary) {
          fetchCategoriesByManufacturer(primary);
        } else {
          setCategories([]);
        }
      }
      return { ...prev, manufacturerIds: next, manufacturerId: primary, categoryId, subcategoryId };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "manufacturerId") {
      setForm((prev) => ({
        ...prev,
        manufacturerId: value,
        categoryId: "",
        subcategoryId: "",
      }));
      setSubcategories([]);
      if (value) {
        fetchCategoriesByManufacturer(value);
      } else {
        setCategories([]);
      }
    } else if (name === "categoryId") {
      setForm((prev) => ({
        ...prev,
        categoryId: value,
        subcategoryId: "",
      }));
      if (value) {
        fetchSubcategoriesByCategory(value);
      } else {
        setSubcategories([]);
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCouponChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addCouponCode = () => {
    if (!currentCoupon.code || !currentCoupon.value) {
      toast.error("Coupon code and value are required");
      return;
    }
    const discountValue = parseFloat(currentCoupon.value);
    if (isNaN(discountValue) || discountValue <= 0) {
      toast.error("Discount value must be a positive number");
      return;
    }
    const newCoupon = {
      ...currentCoupon,
      value: discountValue,
    };
    setForm((prev) => ({
      ...prev,
      discountCodes: [newCoupon],
    }));
    setCurrentCoupon({
      code: "",
      value: "",
      isActive: true,
    });
    setShowCouponForm(false);
    toast.success("Coupon code added successfully");
  };

  const removeCouponCode = () => {
    setForm((prev) => ({
      ...prev,
      discountCodes: [],
    }));
    toast.success("Coupon code removed");
  };

  const editCouponCode = () => {
    if (form.discountCodes.length > 0) {
      setCurrentCoupon(form.discountCodes[0]);
      setShowCouponForm(true);
    }
  };

  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategoriesByManufacturer = async (manufacturerId) => {
    setLoadingCategories(true);
    try {
      const categoriesData = await getCategoriesByManufacturer(manufacturerId);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubcategoriesByCategory = async (categoryId) => {
    setLoadingSubcategories(true);
    try {
      const subcategoriesData = await getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  useEffect(() => {
    if (updateId) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(updateId);
          setForm({
            name: product.name || "",
            namePt: product.namePt || "",
            nameFr: product.nameFr || "",
            nameEs: product.nameEs || "",
            nameHe: product.nameHe || "",
            nameDe: product.nameDe || "",
            nameIt: product.nameIt || "",
            image: product.image || "",
            priceUSD: product.price?.usd?.toString() || "",
            priceEUR: product.price?.eur?.toString() || "",
            priceGBP: product.price?.gbp?.toString() || "",       // ✅ GBP
            discountUSD: product.discountPrice?.usd?.toString() || "",
            discountEUR: product.discountPrice?.eur?.toString() || "",
            discountGBP: product.discountPrice?.gbp?.toString() || "", // ✅ GBP
            reviewsNumber: product.reviewsNumber?.toString() || "0",
            ratings: product.ratings?.toString() || "0",
            manufacturerId: getEntityId(product.manufacturerId),
            manufacturerIds: (() => {
              const ids = product.manufacturerIds?.length > 0
                ? product.manufacturerIds.map(getEntityId)
                : (product.manufacturerId ? [getEntityId(product.manufacturerId)] : []);
              return ids.filter(Boolean);
            })(),
            categoryId: getEntityId(product.categoryId),
            subcategoryId: getEntityId(product.subcategoryId),
            description: product.description || "",
            descriptionPt: product.descriptionPt || "",
            descriptionFr: product.descriptionFr || "",
            descriptionEs: product.descriptionEs || "",
            descriptionHe: product.descriptionHe || "",
            descriptionDe: product.descriptionDe || "",
            descriptionIt: product.descriptionIt || "",
            sizes: product.sizes || [],
            colors: product.colors || [],
            quantity: product.quantity?.toString() || "0",
            minStock: product.minStock?.toString() || "0",
            visibility: product.visibility || "public",
            features: product.features || [],
            sku: product.sku || "",
            shippingEu: product.shippingEu || "",
            shippingAsia: product.shippingAsia || "",
            shippingPt: product.shippingPt || "",
            shippingFr: product.shippingFr || "",
            shippingSp: product.shippingSp || "",
            shippingWorld: product.shippingWorld || "",
            discountCodes: product.discountCodes || [],
          });
          if (product.manufacturerId) {
            fetchCategoriesByManufacturer(getEntityId(product.manufacturerId));
          }
          if (product.categoryId) {
            fetchSubcategoriesByCategory(getEntityId(product.categoryId));
          }
          // Load existing images into previews
          const existingImages = product.images?.length > 0
            ? product.images
            : product.image ? [product.image] : [];
          setImagePreviews(existingImages.map((url) => ({ url, file: null })));
        } catch (err) {
          console.error(err);
          toast.error("Failed to load product data");
        }
      };
      fetchProduct();
    }
  }, [updateId]);

  useEffect(() => {
    async function fetchManufacturers() {
      try {
        const data = await getManufacturers();
        setManufacturers(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchManufacturers();
  }, []);

  // Categories are now fetched based on selected manufacturer
  // No need to load all categories independently

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const oversized = files.filter((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`${oversized.length} file(s) exceed the ${MAX_IMAGE_SIZE_MB}MB limit and were skipped.`);
    }
    const valid = files.filter((f) => f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024);
    const newPreviews = valid.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    // Reset input so same files can be re-selected
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

     
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );


      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload any new file-based images to ImgBB
      const uploadedUrls = await Promise.all(
        imagePreviews.map(async ({ url, file }) => {
          if (file) return await uploadImageToImgBB(file);
          return url; // already a remote URL
        })
      );

      const primaryImage = uploadedUrls[0] || form.image || "";
      const eurPrice = form.priceEUR?.toString().trim() || "";
      const eurDiscount = form.discountEUR?.toString().trim() || "";
      const gbpPrice = convertedGBP || form.priceGBP?.toString().trim() || "";
      const gbpDiscount = convertedDiscountGBP || form.discountGBP?.toString().trim() || "";
      const productData = {
        ...form,
        priceUSD: convertedUSD || eurPrice || form.priceUSD,
        priceEUR: eurPrice || form.priceEUR,
        priceGBP: gbpPrice || form.priceGBP,
        discountUSD: convertedDiscountUSD || eurDiscount || form.discountUSD,
        discountEUR: eurDiscount || form.discountEUR,
        discountGBP: gbpDiscount || form.discountGBP,
        manufacturerId: form.manufacturerIds.length > 0 ? form.manufacturerIds[0] : getEntityId(form.manufacturerId),
        manufacturerIds: form.manufacturerIds,
        categoryId: getEntityId(form.categoryId),
        subcategoryId: getEntityId(form.subcategoryId),
        image: primaryImage,
        images: uploadedUrls,
        price: {
          usd: convertedUSD ? parseFloat(convertedUSD) : (eurPrice ? parseFloat(eurPrice) : undefined),
          eur: eurPrice ? parseFloat(eurPrice) : undefined,
          gbp: gbpPrice ? parseFloat(gbpPrice) : undefined,
        },
        discountPrice: {
          usd: convertedDiscountUSD ? parseFloat(convertedDiscountUSD) : (eurDiscount ? parseFloat(eurDiscount) : undefined),
          eur: eurDiscount ? parseFloat(eurDiscount) : undefined,
          gbp: gbpDiscount ? parseFloat(gbpDiscount) : undefined,
        },
        isActive: form.visibility === "public",
        quantity: parseInt(form.quantity),
        reviewsNumber: parseInt(form.reviewsNumber),
        ratings: parseFloat(form.ratings),
        sku: form.sku,
        discountCodes:
          form.discountCodes.length > 0
            ? [
                {
                  ...form.discountCodes[0],
                  value: parseFloat(form.discountCodes[0].value),
                },
              ]
            : [],
      };
      let res;
      if (updateId) {
        console.log("here is the update data.......", productData);
        res = await updateProduct(updateId, productData);
      } else {
        console.log("here is the data.......", productData);
        res = await createProduct(productData);
      }
      const ok =
        res?.success === true ||
        res?.status === 201 ||
        res?.status === 200;
      if (ok) {
        toast.success(
          updateId
            ? "Product updated successfully!"
            : "Product added successfully!",
          { position: "bottom-right" }
        );
        if (!updateId) {
          setForm({
            name: "",
            namePt: "",
            nameFr: "",
            nameEs: "",
            nameHe: "",
    nameDe: "",
            nameIt: "",
            image: "",
            priceUSD: "",
            priceEUR: "",
            priceGBP: "",    // ✅ GBP
            discountUSD: "",
            discountEUR: "",
            discountGBP: "", // ✅ GBP
            reviewsNumber: "0",
            ratings: "0",
            manufacturerId: "",
            manufacturerIds: [],
            categoryId: "",
            subcategoryId: "",
            description: "",
            descriptionPt: "",
            descriptionFr: "",
            descriptionEs: "",
            descriptionHe: "",
    descriptionDe: "",
            descriptionIt: "",
            sizes: [],
            colors: [],
            quantity: "0",
            visibility: "public",
            features: [],
            sku: "",
            shippingEu: "",
            shippingAsia: "",
            shippingPt: "",
            shippingFr: "",
            shippingWorld: "",
            shippingSp: "",
            discountCodes: [],
          });
          setForm((prev) => ({ ...prev, image: "", images: [] }));
          setImagePreviews([]);
          setSubcategories([]);
        }
      } else {
        const parts = [res?.message, ...(Array.isArray(res?.errors) ? res.errors : [])].filter(
          Boolean
        );
        throw new Error(parts.length ? parts.join(" ") : "Error processing product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.message || "An error occurred while submitting the form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl text-[#0eadef] font-bold mb-6">
        {updateId ? "Update Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name fields */}
        <div>
          <Label required>Name (English)</Label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div>
            <Label>Name (Portuguese)</Label>
            <input
              type="text"
              name="namePt"
              value={form.namePt}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Name (French)</Label>
            <input
              type="text"
              name="nameFr"
              value={form.nameFr}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Name (Spanish)</Label>
            <input
              type="text"
              name="nameEs"
              value={form.nameEs}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Name (Hebrew)</Label>
            <input
              type="text"
              name="nameHe"
              value={form.nameHe}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              dir="rtl"
            />
          </div>
          <div>
            <Label>Name (German / Deutsch)</Label>
            <input
              type="text"
              name="nameDe"
              value={form.nameDe}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Name (Italian / Italiano)</Label>
            <input
              type="text"
              name="nameIt"
              value={form.nameIt || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Multi-image upload */}
        <div>
          <Label>Product Images (up to 10, first = main image)</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">Max {MAX_IMAGE_SIZE_MB}MB per image · first image is the main thumbnail</p>
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {imagePreviews.map((item, idx) => (
                <div key={idx} className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.url}
                    alt={`Product image ${idx + 1}`}
                    className="w-full h-full object-cover rounded border"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-1 rounded-br">Main</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price fields */}
        <div className="grid grid-cols-3 gap-4">
          {/* EUR — primary input */}
          <div>
            <Label required>Price (EUR) €</Label>
            <input
              type="number"
              name="priceEUR"
              required
              min="0"
              step="any"
              value={form.priceEUR}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="0.00"
            />
            {ratesLoading && (
              <p className="text-xs text-blue-400 mt-1">⏳ Loading live rates...</p>
            )}
            {ratesError && (
              <p className="text-xs text-orange-400 mt-1">⚠️ Using fallback rates</p>
            )}
            {!ratesLoading && !ratesError && (
              <p className="text-xs text-gray-400 mt-1">Live rates · European Central Bank</p>
            )}
          </div>

          {/* USD — auto-filled */}
          <div>
            <Label required>Price (USD) $</Label>
            <input
              type="number"
              name="priceUSD"
              readOnly
              min="0"
              step="any"
              value={convertedUSD || form.priceUSD}
              className="w-full border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto"
            />
            <p className="text-xs text-gray-400 mt-1">
              {exchangeRates.usd ? `Rate: ${exchangeRates.usd}` : "Auto-converted from EUR"}
            </p>
          </div>

          {/* GBP — auto-filled */}
          <div>
            <Label required>Price (GBP) £</Label>
            <input
              type="number"
              name="priceGBP"
              readOnly
              min="0"
              step="any"
              value={convertedGBP || form.priceGBP}
              className="w-full border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto"
            />
            <p className="text-xs text-gray-400 mt-1">
              {exchangeRates.gbp ? `Rate: ${exchangeRates.gbp}` : "Auto-converted from EUR"}
            </p>
          </div>

          {/* Discount EUR — primary input */}
          <div>
            <Label>Discount Price (EUR) €</Label>
            <input
              type="number"
              name="discountEUR"
              value={form.discountEUR}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="0.00"
            />
          </div>

          {/* Discount USD — auto-filled */}
          <div>
            <Label>Discount Price (USD) $</Label>
            <input
              type="number"
              name="discountUSD"
              readOnly
              value={convertedDiscountUSD || form.discountUSD}
              className="w-full border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto"
            />
            <p className="text-xs text-gray-400 mt-1">Auto-converted from EUR</p>
          </div>

          {/* Discount GBP — auto-filled */}
          <div>
            <Label>Discount Price (GBP) £</Label>
            <input
              type="number"
              name="discountGBP"
              readOnly
              value={convertedDiscountGBP || form.discountGBP}
              className="w-full border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Auto"
            />
            <p className="text-xs text-gray-400 mt-1">Auto-converted from EUR</p>
          </div>
        </div>

        {/* Description fields */}
        <div>
          <Label required>Description (English)</Label>
          <JoditRich setForm={setForm} form={form} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div>
            <Label>Description (Portuguese)</Label>
            <JoditRich setForm={setForm} form={form} field="descriptionPt" />
          </div>
          <div>
            <Label>Description (French)</Label>
            <JoditRich setForm={setForm} form={form} field="descriptionFr" />
          </div>
          <div>
            <Label>Description (Spanish)</Label>
            <JoditRich setForm={setForm} form={form} field="descriptionEs" />
          </div>
          <div>
            <Label>Description (Hebrew)</Label>
            <div dir="rtl">
              <JoditRich setForm={setForm} form={form} field="descriptionHe" />
            </div>
          </div>
          <div>
            <Label>Description (German / Deutsch)</Label>
            <JoditRich setForm={setForm} form={form} field="descriptionDe" />
          </div>
          <div>
            <Label>Description (Italian / Italiano)</Label>
            <JoditRich setForm={setForm} form={form} field="descriptionIt" />
          </div>
        </div>

        {/* Category and manufacturer fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Manufacturer (select one or more)</Label>
            <div className="w-full border rounded p-2 max-h-40 overflow-y-auto bg-white">
              {manufacturers.length === 0 && (
                <p className="text-sm text-gray-400">No manufacturers available</p>
              )}
              {manufacturers.map((manu) => (
                <label key={manu.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={form.manufacturerIds.includes(manu.id)}
                    onChange={() => handleManufacturerToggle(manu.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{manu.name}</span>
                </label>
              ))}
            </div>
            {form.manufacturerIds.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {form.manufacturerIds.length} selected — categories load for first selected
              </p>
            )}
          </div>
          <div>
            <Label>Category</Label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={!form.manufacturerId || loadingCategories}
              className="w-full border p-2 rounded disabled:opacity-50"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="text-sm text-gray-500 mt-1">
                Loading categories...
              </p>
            )}
            {form.manufacturerId &&
              categories.length === 0 &&
              !loadingCategories && (
                <p className="text-sm text-gray-500 mt-1">
                  No categories available for this manufacturer
                </p>
              )}
          </div>
          <div>
            <Label>Subcategory</Label>
            <select
              name="subcategoryId"
              value={form.subcategoryId}
              onChange={handleChange}
              disabled={!form.categoryId || loadingSubcategories}
              className="w-full border p-2 rounded disabled:opacity-50"
            >
              <option value="">Select subcategory</option>
              {subcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </option>
              ))}
            </select>
            {loadingSubcategories && (
              <p className="text-sm text-gray-500 mt-1">
                Loading subcategories...
              </p>
            )}
            {form.categoryId &&
              subcategories.length === 0 &&
              !loadingSubcategories && (
                <p className="text-sm text-gray-500 mt-1">
                  No subcategories available for this category
                </p>
              )}
          </div>
          <div>
            <Label required>Visibility</Label>
            <select
              name="visibility"
              required
              value={form.visibility}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Quantity and SKU fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label required>Quantity</Label>
            <input
              type="number"
              name="quantity"
              required
              value={form.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label required>SKU</Label>
            <input
              type="text"
              name="sku"
              required
              value={form.sku}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Min Stock</Label>
            <input
              type="number"
              name="minStock"
              value={form.minStock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Coupon/Discount Codes Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg mb-4 text-[#0eadef]">Coupon Code</h3>
          {form.discountCodes.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Current Coupon:</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded mr-2">
                    {form.discountCodes[0].code}
                  </span>
                  <span className="text-sm text-gray-600">
                    $ / € {form.discountCodes[0].value} off
                  </span>
                  {form.discountCodes[0].isActive ? (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={editCouponCode}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={removeCouponCode}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !showCouponForm && (
              <button
                type="button"
                onClick={() => {
                  setCurrentCoupon({
                    code: "",
                    value: "",
                    isActive: true,
                  });
                  setShowCouponForm(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
              >
                Add Coupon Code
              </button>
            )
          )}
          {showCouponForm && (
            <div className="bg-gray-50 p-4 rounded border mb-4">
              <h4 className="font-medium mb-3">
                {form.discountCodes.length > 0
                  ? "Update Coupon Code"
                  : "Add New Coupon Code"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label required>Coupon Code</Label>
                  <input
                    type="text"
                    name="code"
                    value={currentCoupon.code}
                    onChange={handleCouponChange}
                    className="w-full border p-2 rounded uppercase"
                    placeholder="SUMMER25"
                    required
                  />
                </div>
                <div>
                  <Label required>Discount Amount ($)</Label>
                  <input
                    type="number"
                    name="value"
                    value={currentCoupon.value}
                    onChange={handleCouponChange}
                    className="w-full border p-2 rounded"
                    placeholder="10.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={currentCoupon.isActive}
                  onChange={handleCouponChange}
                  className="mr-2"
                  id="couponActive"
                />
                <label htmlFor="couponActive" className="text-sm">
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={addCouponCode}
                  className="bg-[#0092d1] text-white px-2 py-1 rounded hover:bg-[#0eacf0]"
                >
                  {form.discountCodes.length > 0
                    ? "Update Coupon"
                    : "Add Coupon"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Shipping fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Shipping Cost EU</Label>
            <input
              type="number"
              name="shippingEu"
              value={form.shippingEu}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Shipping Cost Spain</Label>
            <input
              type="number"
              name="shippingSp"
              value={form.shippingSp}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Shipping Portugal</Label>
            <input
              type="number"
              name="shippingPt"
              value={form.shippingPt}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Shipping Cost France</Label>
            <input
              type="number"
              name="shippingFr"
              value={form.shippingFr}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Shipping Cost Asia</Label>
            <input
              type="number"
              name="shippingAsia"
              value={form.shippingAsia}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label>Shipping Cost World Wide</Label>
            <input
              type="number"
              name="shippingWorld"
              value={form.shippingWorld}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#0eadef] text-white px-6 py-3 rounded hover:bg-[#049cde] disabled:bg-blue-300 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? updateId
              ? "Updating..."
              : "Creating..."
            : updateId
            ? "Update Product"
            : "Create Product"}
        </button>
      </form>
    </div>
  );
}