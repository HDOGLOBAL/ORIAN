"use server";

import mongoose from "mongoose";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/utils/data-util";
import {
  buildCategorySlugBase,
  categorySlugSegmentForManufacturer,
  slugify,
} from "@/utils/slugify";
import { productModel } from "@/models/product-models";
import { cartModel } from "@/models/cart-models";
import { sendNewOrderNotifications } from "../../utils/mailSender";
import { autoTranslateMissing } from "../../utils/translator";
import { auth } from "@/auth";
import { OrderModel } from "@/models/order-models";
import { PendingOrderModel } from "@/models/pending-order-models";
import { CounterModel } from "@/models/counter-model";
import { dbConnect } from "@/service/mongo";
import { manufacturerModel } from "@/models/manufacture-model";
import { categoryModel } from "@/models/category-models";
import { subcategoryModel } from "@/models/sub-cat-models";
import { europeanCountries } from "@/database/europe";
import { asianCountries } from "@/database/asianCountry";
import sanitizeHtml from "sanitize-html";
import Stripe from "stripe";
const { userModel } = require("@/models/users-model");
import bcrypt from "bcryptjs";

// Blocks any request that is not from a logged-in admin.
// Throws so the surrounding try/catch returns a friendly error.
export async function requireAdmin() {
  const session = await auth();
  // Fast path: isAdmin claim present in the JWT
  if (session?.user?.isAdmin === true) {
    return session.user;
  }
  // Fallback: verify against the database (source of truth).
  // Covers tokens created before isAdmin was added to the session.
  const email = session?.user?.email;
  if (email) {
    const dbUser = await getUserByMail(email);
    if (dbUser?.isAdmin === true) {
      return dbUser;
    }
  }
  throw new Error("Unauthorized: admin access required");
}

// Escapes regex special characters so user input can't cause ReDoS or break queries
const escapeRegex = (value = "") =>
  String(value).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// manufacturer start ---------------------------------------------------------------

export async function StripeFun() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function getManufacturers() {
  await dbConnect();

  const manufacturers = await manufacturerModel.find().lean();
  return replaceMongoIdInArray(manufacturers);
}
export async function addManufacturer(manufacturerData) {
  try {
    await requireAdmin();
    // Validate required fields
    if (!manufacturerData.name) {
      throw new Error("Name is required");
    }

    // Check for existing manufacturer
    const existingManufacturer = await manufacturerModel.findOne({
      $or: [
        { name: manufacturerData.name },
        // Add other unique fields if needed (e.g., website)
      ],
    });

    if (existingManufacturer) {
      throw new Error(`Manufacturer "${manufacturerData.name}" already exists`);
    }

    const newManufacturer = await manufacturerModel.create({
      name: manufacturerData.name,
      logo: manufacturerData.logo || null,
      description: manufacturerData.description || null,
      website: manufacturerData.website || null,
    });

    return {
      id: newManufacturer._id.toString(),
      name: newManufacturer.name,
      logo: newManufacturer.logo,
      description: newManufacturer.description,
      website: newManufacturer.website,
      createdAt: newManufacturer.createdAt,
    };
  } catch (error) {
    console.error("Add manufacturer error:", error.message);

    if (error.code === 11000) {
      throw new Error("Manufacturer with this name already exists");
    }

    throw new Error(error.message || "Failed to create manufacturer");
  }
}

export async function deleteManufacturerById(id) {
  let existProduct = false;
  let success = false;
  try {
    await requireAdmin();
    // Prevent deletion if manufacturer has products
    const productCount = await productModel.countDocuments({
      manufacturerId: id,
    });
    if (productCount > 0) {
      existProduct = true;
      return { existProduct, success };
    }

    await manufacturerModel.findByIdAndDelete(id);
    success = true;
    return { existProduct, success };
  } catch (error) {
    console.error("Error deleting manufacturer:", error);
    throw error;
  }
}
// manufacturer end ---------------------------------------------------------------

// category start ---------------------------------------------------------------

async function ensureUniqueCategorySlug(manufacturerObjectId, baseSlug, excludeCategoryId) {
  if (!baseSlug) {
    throw new Error("Could not generate a valid slug");
  }
  let candidate = baseSlug;
  let suffix = 2;
  for (;;) {
    const filter = {
      manufacturerId: manufacturerObjectId,
      slug: candidate,
    };
    if (excludeCategoryId) {
      filter._id = { $ne: new mongoose.Types.ObjectId(excludeCategoryId) };
    }
    const exists = await categoryModel.findOne(filter).lean();
    if (!exists) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function messageForCategoryDuplicateKey(error) {
  if (error.code !== 11000) return error.message || "Failed to save category";
  const keys = Object.keys(error.keyPattern || {});
  const msg = String(error.message || "");

  const compoundSlug =
    keys.includes("slug") && keys.includes("manufacturerId");
  const legacyUniqueName =
    (keys.length === 1 && keys[0] === "name") ||
    (/\bname_1\b/i.test(msg) && !/\bmanufacturerId_1_slug_1\b/i.test(msg));

  if (legacyUniqueName && !compoundSlug) {
    return (
      'MongoDB still has a unique index on category names ("name_1"). Restart the server so ' +
      'indexes can sync, or run: db.categories.dropIndex("name_1") — then the same name ' +
      "is allowed per manufacturer (each row gets a unique URL slug)."
    );
  }
  if (compoundSlug) {
    return "A category with this URL slug already exists for this manufacturer.";
  }
  if (keys.includes("slug") || /\bslug_1\b/i.test(msg)) {
    return "A category with this URL slug already exists.";
  }
  return (
    error.message ||
    "Could not save category (duplicate key). Restart the server or drop legacy indexes name_1 / slug_1 on categories."
  );
}

// In your database/queries.js file
export async function getSubcategories() {
  await dbConnect();

  try {
    const subcategories = await subcategoryModel
      .find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    // Convert MongoDB objects to plain JavaScript objects
    return subcategories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      categoryId: item.categoryId
        ? {
            _id: item.categoryId._id.toString(),
            name: item.categoryId.name,
          }
        : null,
      createdAt: item.createdAt,
    }));
  } catch (error) {
    throw new Error("Failed to fetch subcategories: " + error.message);
  }
}

export async function getCategories() {
  await dbConnect();

  try {
    const categories = await categoryModel.find().sort({ name: 1 }).lean();
    const ids = categories.map((c) => c._id);

    const rawCounts = await productModel.aggregate([
      {
        $project: {
          cats: {
            $setUnion: [
              { $ifNull: ["$categoryIds", []] },
              { $cond: { if: { $ifNull: ["$categoryId", false] }, then: ["$categoryId"], else: [] } },
            ],
          },
        },
      },
      { $unwind: "$cats" },
      { $match: { cats: { $in: ids } } },
      { $group: { _id: "$cats", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(
      rawCounts.map(({ _id, count }) => [_id.toString(), count])
    );

    return categories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      description: item.description,
      isFeatured: item.isFeatured || false,
      manufacturerId: item.manufacturerId ? item.manufacturerId.toString() : null,
      createdAt: item.createdAt,
      productCount: countMap[item._id.toString()] || 0,
    }));
  } catch (error) {
    throw new Error("Failed to fetch categories: " + error.message);
  }
}

export async function getFeaturedCategories() {
  await dbConnect();

  try {
    const categories = await categoryModel
      .find({ isFeatured: true })
      .sort({ name: 1 })
      .lean();

    const ids = categories.map((c) => c._id);

    // Count products per category — handles both categoryId and categoryIds[]
    const rawCounts = await productModel.aggregate([
      {
        $project: {
          cats: {
            $setUnion: [
              { $ifNull: ["$categoryIds", []] },
              {
                $cond: {
                  if: { $ifNull: ["$categoryId", false] },
                  then: ["$categoryId"],
                  else: [],
                },
              },
            ],
          },
        },
      },
      { $unwind: "$cats" },
      { $match: { cats: { $in: ids } } },
      { $group: { _id: "$cats", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(
      rawCounts.map(({ _id, count }) => [_id.toString(), count])
    );

    // Convert MongoDB objects to plain JavaScript objects
    return categories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      description: item.description,
      isFeatured: item.isFeatured,
      createdAt: item.createdAt,
      productCount: countMap[item._id.toString()] || 0,
    }));
  } catch (error) {
    throw new Error("Failed to fetch featured categories: " + error.message);
  }
}

export async function getCategoriesByManufacturer(manufacturerId) {
  await dbConnect();

  try {
    if (!manufacturerId) {
      return [];
    }

    const manufactuererObjectId = new mongoose.Types.ObjectId(manufacturerId);
    const categories = await categoryModel
      .find({ manufacturerId: manufactuererObjectId })
      .sort({ name: 1 })
      .lean();

    // Convert MongoDB objects to plain JavaScript objects
    return categories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      description: item.description,
      isFeatured: item.isFeatured || false,
      manufacturerId: item.manufacturerId ? item.manufacturerId.toString() : null,
      createdAt: item.createdAt,
    }));
  } catch (error) {
    throw new Error("Failed to fetch categories by manufacturer: " + error.message);
  }
}

export async function createSubcategory(formData) {
  await dbConnect();
  const { name, slug, categoryId } = formData;

  try {
    await requireAdmin();
    const newSubcategory = await subcategoryModel.create({
      name,
      slug,
      categoryId,
    });

    // Convert to plain object with string ID
    return {
      id: newSubcategory._id.toString(),
      name: newSubcategory.name,
      slug: newSubcategory.slug,
      categoryId: newSubcategory.categoryId,
      createdAt: newSubcategory.createdAt,
    };
  } catch (error) {
    throw new Error("Failed to create subcategory: " + error.message);
  }
}

export async function addCategory(categoryData) {
  await dbConnect();
  try {
    await requireAdmin();
    if (!categoryData.name || !String(categoryData.name).trim()) {
      throw new Error("Name is required");
    }
    if (!categoryData.manufacturerId || !String(categoryData.manufacturerId).trim()) {
      throw new Error("Manufacturer is required");
    }

    const trimmedName = String(categoryData.name).trim();

    const manufacturerIdToSave = new mongoose.Types.ObjectId(
      String(categoryData.manufacturerId).trim()
    );
    const manufacturer = await manufacturerModel.findById(manufacturerIdToSave).lean();
    if (!manufacturer) {
      throw new Error("Manufacturer not found");
    }

    const labelForSlug =
      categoryData.slug && String(categoryData.slug).trim()
        ? String(categoryData.slug).trim()
        : trimmedName;
    const segment = categorySlugSegmentForManufacturer(
      manufacturer.name,
      labelForSlug
    );
    let baseSlug = buildCategorySlugBase(manufacturer.name, segment);
    if (!baseSlug) {
      baseSlug = slugify(trimmedName) || `category-${Date.now()}`;
    }

    const sameNameCount = await categoryModel.countDocuments({
      manufacturerId: manufacturerIdToSave,
      name: trimmedName,
    });
    if (sameNameCount > 0) {
      baseSlug = `${baseSlug}-${sameNameCount + 1}`;
    }

    const uniqueSlug = await ensureUniqueCategorySlug(
      manufacturerIdToSave,
      baseSlug,
      null
    );

    const newCategory = await categoryModel.create({
      name: trimmedName,
      slug: uniqueSlug,
      manufacturerId: manufacturerIdToSave,
      description: categoryData.description || null,
      icon: categoryData.icon || null,
    });

    // Revalidate cache
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/auth/dashboard/categories", "page");
      revalidatePath("/", "layout");
    } catch (revalidateError) {
      console.warn("Cache revalidation warning:", revalidateError.message);
    }

    return {
      id: newCategory._id.toString(),
      name: newCategory.name,
      slug: newCategory.slug,
      manufacturerId: newCategory.manufacturerId?.toString() || null,
      description: newCategory.description,
      icon: newCategory.icon,
      createdAt: newCategory.createdAt,
    };
  } catch (error) {

    if (error.code === 11000) {
      throw new Error(messageForCategoryDuplicateKey(error));
    }

    throw new Error(error.message || "Failed to create category");
  }
}

export async function updateCategory(id, categoryData) {
  await dbConnect();
  try {
    await requireAdmin();
    if (!id) {
      throw new Error("Category ID is required");
    }

    if (!categoryData.name || !String(categoryData.name).trim()) {
      throw new Error("Name is required");
    }
    if (!categoryData.manufacturerId || !String(categoryData.manufacturerId).trim()) {
      throw new Error("Manufacturer is required");
    }

    const manufacturerObjectId = new mongoose.Types.ObjectId(
      String(categoryData.manufacturerId).trim()
    );
    const manufacturer = await manufacturerModel.findById(manufacturerObjectId).lean();
    if (!manufacturer) {
      throw new Error("Manufacturer not found");
    }

    const trimmedName = String(categoryData.name).trim();

    const labelForSlug =
      categoryData.slug && String(categoryData.slug).trim()
        ? String(categoryData.slug).trim()
        : trimmedName;
    const segment = categorySlugSegmentForManufacturer(
      manufacturer.name,
      labelForSlug
    );
    let baseSlug = buildCategorySlugBase(manufacturer.name, segment);
    if (!baseSlug) {
      baseSlug = slugify(trimmedName) || `category-${Date.now()}`;
    }

    const uniqueSlug = await ensureUniqueCategorySlug(
      manufacturerObjectId,
      baseSlug,
      id
    );

    const updateData = {
      name: trimmedName,
      slug: uniqueSlug,
      description: categoryData.description || null,
      icon: categoryData.icon || null,
      isFeatured: categoryData.isFeatured || false,
      manufacturerId: manufacturerObjectId,
    };

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    // Revalidate cache for homepage and shop pages
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/", "layout");
      revalidatePath("/auth/dashboard/categories", "page");
    } catch (revalidateError) {
      console.warn("Cache revalidation warning:", revalidateError.message);
    }

    return {
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      manufacturerId: updatedCategory.manufacturerId?.toString() || null,
      description: updatedCategory.description,
      icon: updatedCategory.icon,
      isFeatured: updatedCategory.isFeatured || false,
      createdAt: updatedCategory.createdAt,
    };
  } catch (error) {
    console.error("Update category error:", error.message);

    if (error.code === 11000) {
      throw new Error(messageForCategoryDuplicateKey(error));
    }

    throw new Error(error.message || "Failed to update category");
  }
}

export async function deleteSubcategory(id) {
  await dbConnect();

  try {
    await requireAdmin();
    const deletedSubcategory = await subcategoryModel.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      throw new Error("Subcategory not found");
    }

    return { success: true, message: "Subcategory deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete subcategory: " + error.message);
  }
}

export async function getSubcategoriesByCategory(categoryId) {
  try {
    await dbConnect();
    const subcategories = await subcategoryModel
      .find({ categoryId: new mongoose.Types.ObjectId(categoryId) })
      .sort({ createdAt: -1 });

    return subcategories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw new Error("Failed to fetch subcategories");
  }
}

// category end---------------------------------------------------------------

// user start---------------------------------------------------------------

export async function getUserByMail(email) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: email }).select("-password");

    if (!user) {
      // Handle case when no user is found
      return null;
    }

    // Ensure the wishlist and cardlist fields exist and are arrays
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }
    if (!Array.isArray(user.cardlist)) {
      user.cardlist = [];
    }

    await user.save(); // Save changes if necessary

    return replaceMongoIdInObject(user.toObject()); // Convert Mongoose document to plain object
  } catch (err) {
    console.log(err);
    return null; // Return null or handle the error appropriately
  }
}

export async function getUserById(id) {
  await dbConnect();
  try {
    const user = await userModel.findById(id).select("-password").lean();
    return replaceMongoIdInObject(user);
  } catch (err) {
    console.log(err);
  }
}
// user end---------------------------------------------------------------

// products start---------------------------------------------------------------
/**
 * Fetches cart by userId (if logged in) or by trackingId (for guest users)
 * @param userId MongoDB ObjectId or null
 * @param trackingId string (must be provided for guests)
 * @returns cart document or null
 */
export async function getCart({ userId, trackingId }) {
  try {
    let cart = null;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await cartModel.findOne({ userId, isOrdered: false }).lean();
    }

    if (!cart && trackingId) {
      cart = await cartModel.findOne({ trackingId, isOrdered: false }).lean();
    }

    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Failed to fetch cart");
  }
}

export async function getCartByTrackingId(trackingId) {
  try {
    if (!trackingId) {
      throw new Error("Tracking ID is required");
    }

    await dbConnect();

    const cart = await cartModel
      .findOne({
        trackingId,
        isOrdered: false,
      })
      .lean();

    if (!cart) {
      return [];
    }

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await getProductById(item.productId);
        return {
          id: product.id,
          name: product.name,
          nameEs: product.nameEs,
          nameFr: product.nameFr,
          namePt: product.namePt,
          nameHe: product.nameHe,
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: item.quantity,
          france: product.shippingFr,
          portugal: product.shippingPt,
          asia: product.shippingAsia,
          world: product.shippingWorld,
          spain: product.shippingSp,
          europe: product.shippingEu,
          discountCodes: product?.discountCodes,
        };
      })
    );

    return items;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error(error.message || "Failed to fetch cart");
  }
}
export async function getAllCarts({ isOrdered = false } = {}) {
  try {
    const carts = await cartModel.find({ isOrdered }).lean();
    return carts;
  } catch (error) {
    console.error("Error fetching all carts:", error);
    throw new Error("Failed to fetch carts");
  }
}

export async function searchProducts(query) {
  await dbConnect();
  const regexName = new RegExp(
    query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    "i"
  );

  const products = await productModel
    .find({ name: { $regex: regexName } })
    .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
    .populate('categoryId', 'name slug')
    .populate('subcategoryId', 'name')
    .lean();
    
  // Serialize populated objects to plain objects
  const serializedProducts = products.map(product => ({
    ...product,
    manufacturerId: product.manufacturerId ? {
      _id: product.manufacturerId._id.toString(),
      name: product.manufacturerId.name
    } : null,
    manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
    categoryId: product.categoryId ? {
      _id: product.categoryId._id.toString(),
      name: product.categoryId.name,
      slug: product.categoryId.slug
    } : null,
    subcategoryId: product.subcategoryId ? {
      _id: product.subcategoryId._id.toString(),
      name: product.subcategoryId.name
    } : null
  }));
    
  return replaceMongoIdInArray(serializedProducts);
}

// export async function getProducts(filters = {}) {
//   const {
//     search,
//     manufacturerId,
//     categoryId,
//     subcategoryId,
//     page = 1,
//     limit = 9,
//   } = filters;

//   const skip = (page - 1) * limit;
//   await dbConnect();

//   try {
//     // Build query object
//     let query = { isActive: true };

//     const hasSearch = search && search.trim() !== "";
//     const hasManufacturer = manufacturerId && manufacturerId.trim() !== "";
//     const hasCategory = categoryId && categoryId.trim() !== "";
//     const hasSubcategory = subcategoryId && subcategoryId.trim() !== "";

//     if (hasSearch) {
//       query.$or = [
//         { name: { $regex: escapeRegex(search), $options: "i" } },
//         { description: { $regex: escapeRegex(search), $options: "i" } },
//       ];
//     }

//     if (hasManufacturer) {
//       query.manufacturerId = manufacturerId;
//     }

//     if (hasCategory) {
//       query.categoryId = categoryId;
//     }

//     if (hasSubcategory) {
//       query.subcategoryId = subcategoryId;
//     }

//     // Get paginated products WITHOUT population
//     const [finalProducts, totalCount] = await Promise.all([
//       productModel
//         .find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 })
//         .lean(),
//       productModel.countDocuments(query),
//     ]);

//     const totalPages = Math.ceil(totalCount / limit);

//     const products = replaceMongoIdInArray(finalProducts);

//     return {
//       products,
//       totalCount,
//       totalPages,
//       currentPage: page,
//       hasNext: page < totalPages,
//       hasPrev: page > 1,
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       products: [],
//       totalCount: 0,
//       totalPages: 0,
//       currentPage: 1,
//       hasNext: false,
//       hasPrev: false,
//     };
//   }
// }

export async function getProducts(filters = {}) {
  let {
    search,
    manufacturerId,
    categoryId,
    subcategoryId,
    page = 1,
    limit = 9,
  } = filters;

  // Convert to numbers
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  await dbConnect();

  try {
    // Helper function to convert slug to ID if needed
    const resolveId = async (idOrSlug, modelType) => {
      if (!idOrSlug || idOrSlug.trim() === "") return null;
      
      // Check if it's a valid MongoDB ObjectId format
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        return idOrSlug;
      }
      
      // If not a valid ID, try to find by slug
      let model;
      if (modelType === "category") {
        model = categoryModel;
      } else if (modelType === "subcategory") {
        model = subcategoryModel;
      } else if (modelType === "manufacturer") {
        model = manufacturerModel;
      }
      
      if (model) {
        const doc = await model.findOne({ slug: idOrSlug });
        return doc ? doc._id.toString() : null;
      }
      
      return idOrSlug;
    };

    // Resolve IDs from slugs if needed
    if (categoryId) {
      categoryId = await resolveId(categoryId, "category");
    }
    if (subcategoryId) {
      subcategoryId = await resolveId(subcategoryId, "subcategory");
    }
    if (manufacturerId) {
      manufacturerId = await resolveId(manufacturerId, "manufacturer");
    }

    // Build query object
    let query = { isActive: true };
    const hasSearch = search && search.trim() !== "";
    const hasManufacturer = manufacturerId && manufacturerId.trim() !== "";
    const hasCategory = categoryId && categoryId.trim() !== "";
    const hasSubcategory = subcategoryId && subcategoryId.trim() !== "";

    if (hasSearch) {
      query.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { description: { $regex: escapeRegex(search), $options: "i" } },
        { namePt: { $regex: escapeRegex(search), $options: "i" } },
        { nameFr: { $regex: escapeRegex(search), $options: "i" } },
        { nameEs: { $regex: escapeRegex(search), $options: "i" } },
        { nameHe: { $regex: escapeRegex(search), $options: "i" } },
        { descriptionPt: { $regex: escapeRegex(search), $options: "i" } },
        { descriptionFr: { $regex: escapeRegex(search), $options: "i" } },
        { descriptionEs: { $regex: escapeRegex(search), $options: "i" } },
        { descriptionHe: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }
    
    // Add manufacturer, category, and subcategory filters to query
    if (hasManufacturer) {
      query.$or = query.$or
        ? [...query.$or]
        : undefined;
      // Match products where manufacturerId OR manufacturerIds contains the value
      const manuFilter = {
        $or: [
          { manufacturerId: manufacturerId },
          { manufacturerIds: manufacturerId },
        ],
      };
      if (query.$or) {
        query.$and = [{ $or: query.$or }, manuFilter];
        delete query.$or;
      } else {
        Object.assign(query, manuFilter);
      }
    }
    if (hasCategory) {
      query.$or = query.$or
        ? [...query.$or]
        : undefined;
      const catFilter = {
        $or: [
          { categoryId: categoryId },
          { categoryIds: categoryId },
        ],
      };
      if (query.$and) {
        query.$and = [...query.$and, catFilter];
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, catFilter];
        delete query.$or;
      } else {
        Object.assign(query, catFilter);
      }
    }
    if (hasSubcategory) {
      const subFilter = {
        $or: [
          { subcategoryId: subcategoryId },
          { subcategoryIds: subcategoryId },
        ],
      };
      if (query.$and) {
        query.$and = [...query.$and, subFilter];
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, subFilter];
        delete query.$or;
      } else {
        Object.assign(query, subFilter);
      }
    }

    // Get paginated products with populated data
    const [finalProducts, totalCount] = await Promise.all([
      productModel
        .find(query)
        .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1, _id: 1 }) // Stable sort
        .lean(),
      productModel.countDocuments(query),
    ]);

    // No need for application-layer filtering since we're filtering in the database
    let filteredProducts = finalProducts;

    const totalPages = Math.ceil(totalCount / limit);
    
    // Serialize populated objects to plain objects before passing to client
    const serializedProducts = filteredProducts.map(product => ({
      ...product,
      manufacturerId: product.manufacturerId ? {
        _id: product.manufacturerId._id.toString(),
        name: product.manufacturerId.name
      } : null,
      manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
      categoryId: product.categoryId ? {
        _id: product.categoryId._id.toString(),
        name: product.categoryId.name,
        slug: product.categoryId.slug
      } : null,
      subcategoryId: product.subcategoryId ? {
        _id: product.subcategoryId._id.toString(),
        name: product.subcategoryId.name
      } : null
    }));
    
    const products = replaceMongoIdInArray(serializedProducts);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNext: false,
      hasPrev: false,
    };
  }
}

export async function getCartWithProducts(trackingId) {
  try {
    await dbConnect();

    if (!trackingId) {
      return [];
    }

    const cart = await cartModel
      .findOne({ trackingId, isOrdered: false })
      .lean();

    if (!cart) {
      return [];
    }

    const items = await Promise.all(
      (cart.items || []).map(async (item) => {
        const product = await productModel
          .findById(item.productId)
          .select("-description")
          .lean();
        return {
          ...product,
          cartQuantity: item.quantity,
        };
      })
    );

    return replaceMongoIdInArray(items);
  } catch (err) {
    console.error("Error in getCartWithProducts:", err);
    throw new Error(err.message || "Failed to get cart with products");
  }
}

export async function getAllProducts({ lean = true, sort = null } = {}) {
  try {
    // 1. Define the projection
    const projection = {
      name: 1,
      image: 1,
      manufacturerId: 1,
      quantity: 1,
      categoryId: 1,
      price: 1,
      isActive: 1,
      createdAt: 1,
      _id: 1,
    };

    // 2. Create the base query with explicit population
    let query = productModel
      .find({}, projection)
      .populate({
        path: "manufacturerId",
        select: "name logo", // Include both name and logo
        model: "manufacturers", // Must match your model name exactly
      })
      .populate({
        path: "categoryId",
        select: "name slug", // Include both name and slug
        model: "categories", // Must match your model name exactly
      });

    // 3. Apply sorting if specified
    if (sort) {
      query = query.sort(sort);
    }

    // 4. Execute the query
    let products;
    if (lean) {
      products = await query
        .lean({
          virtuals: true, // Include virtual fields
          getters: true, // Include getters/setters
        })
        .exec();
    } else {
      products = await query.exec();
    }

    // 5. Transform the data for consistent output
    const transformedProducts = products.map((product) => {
      // For lean documents, the structure is slightly different
      const isLean = lean && !product.populated;

      const manufacturer = isLean
        ? product.manufacturerId
        : product.manufacturerId?.toObject?.();

      const category = isLean
        ? product.categoryId
        : product.categoryId?.toObject?.();

      return {
        ...product,
        id: product._id?.toString(),
        manufacturer: manufacturer
          ? {
              id: manufacturer._id?.toString(),
              name: manufacturer.name,
              ...(manufacturer.logo && { logo: manufacturer.logo }),
            }
          : null,
        category: category
          ? {
              id: category._id?.toString(),
              name: category.name,
              ...(category.slug && { slug: category.slug }),
            }
          : null,
        // Remove the original ID references
        manufacturerId: undefined,
        categoryId: undefined,
        _id: undefined,
      };
    });

    return replaceMongoIdInArray(transformedProducts);
  } catch (error) {
    console.error("Product fetch error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to fetch products. Please try again later.");
  }
}
export async function getProductById(productId) {
  await dbConnect();
  const product = await productModel
    .findById(productId)
    .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
    .populate('categoryId', 'name slug')
    .populate('categoryIds', 'name slug')
    .populate('subcategoryId', 'name')
    .populate('subcategoryIds', 'name')
    .lean();

  if (!product) return null;

  // Serialize populated objects to plain objects
  const serializedProduct = {
    ...product,
    manufacturerId: product.manufacturerId ? {
      _id: product.manufacturerId._id.toString(),
      name: product.manufacturerId.name
    } : null,
    manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
    categoryId: product.categoryId ? {
      _id: product.categoryId._id.toString(),
      name: product.categoryId.name,
      slug: product.categoryId.slug
    } : null,
    categoryIds: Array.isArray(product.categoryIds) ? product.categoryIds.map(c => c && c._id ? { _id: c._id.toString(), name: c.name, slug: c.slug } : null).filter(Boolean) : [],
    subcategoryId: product.subcategoryId ? {
      _id: product.subcategoryId._id.toString(),
      name: product.subcategoryId.name
    } : null,
    subcategoryIds: Array.isArray(product.subcategoryIds) ? product.subcategoryIds.map(s => s && s._id ? { _id: s._id.toString(), name: s.name } : null).filter(Boolean) : [],
  };

  return replaceMongoIdInObject(serializedProduct);
}

export async function deleteProductById(productId) {
  try {
    await requireAdmin();
    await dbConnect();

    // Find and delete the product
    const deletedProduct = await productModel
      .findByIdAndDelete(productId)
      .lean();

    if (!deletedProduct) {
      throw new Error("Product not found");
    }

    // Return the deleted product (with transformed IDs if needed)
    return replaceMongoIdInObject(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
}

export async function getProductByCategory(categoryId) {
  try {
    await dbConnect();

    const products = await productModel
      .find({ categoryId: categoryId, isActive: true }) // Changed to categoryId to match schema
      .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
      .populate('categoryId', 'name slug')
      .populate('subcategoryId', 'name')
      .select(
        "name image price discountPrice ratings reviewsNumber soldCount quantity isActive manufacturerId categoryId subcategoryId"
      )
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    if (!products?.length) {
      console.log("No active products found for category ID:", categoryId);
      return [];
    }

    // Serialize populated objects to plain objects
    const serializedProducts = products.map(product => ({
      ...product,
      manufacturerId: product.manufacturerId ? {
        _id: product.manufacturerId._id.toString(),
        name: product.manufacturerId.name
      } : null,
      manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
      categoryId: product.categoryId ? {
        _id: product.categoryId._id.toString(),
        name: product.categoryId.name,
        slug: product.categoryId.slug
      } : null,
      subcategoryId: product.subcategoryId ? {
        _id: product.subcategoryId._id.toString(),
        name: product.subcategoryId.name
      } : null
    }));

    const processedProducts = replaceMongoIdInArray(serializedProducts);

    return processedProducts;
  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    throw new Error("Failed to fetch products by category");
  }
}

export async function getNewArivalProduct() {
  await dbConnect();
  const newArivalProduct = await productModel
    .find()
    .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
    .populate('categoryId', 'name slug')
    .populate('subcategoryId', 'name')
    .sort({ published: -1 })
    .lean();

  // Serialize populated objects to plain objects
  const serializedProducts = newArivalProduct.map(product => ({
    ...product,
    manufacturerId: product.manufacturerId ? {
      _id: product.manufacturerId._id.toString(),
      name: product.manufacturerId.name
    } : null,
    manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
    categoryId: product.categoryId ? {
      _id: product.categoryId._id.toString(),
      name: product.categoryId.name,
      slug: product.categoryId.slug
    } : null,
    subcategoryId: product.subcategoryId ? {
      _id: product.subcategoryId._id.toString(),
      name: product.subcategoryId.name
    } : null
  }));

  return replaceMongoIdInArray(serializedProducts);
}

export async function getTrendingProduct() {
  await dbConnect();
  const trendingProduct = await productModel
    .find({ ratings: { $gte: 4.8, $lte: 5 } })
    .populate('manufacturerId', 'name')
    .populate('manufacturerIds', 'name')
    .populate('categoryId', 'name slug')
    .populate('subcategoryId', 'name')
    .sort({ published: -1 })
    .lean();
  
  // Serialize populated objects to plain objects
  const serializedProducts = trendingProduct.map(product => ({
    ...product,
    manufacturerId: product.manufacturerId ? {
      _id: product.manufacturerId._id.toString(),
      name: product.manufacturerId.name
    } : null,
    manufacturerIds: Array.isArray(product.manufacturerIds) ? product.manufacturerIds.map(m => m && m._id ? { _id: m._id.toString(), name: m.name } : null).filter(Boolean) : [],
    categoryId: product.categoryId ? {
      _id: product.categoryId._id.toString(),
      name: product.categoryId.name,
      slug: product.categoryId.slug
    } : null,
    subcategoryId: product.subcategoryId ? {
      _id: product.subcategoryId._id.toString(),
      name: product.subcategoryId.name
    } : null
  }));
  
  // Trending products: (Some recent products those ratings are between 4.8 to 5)
  return replaceMongoIdInArray(serializedProducts);
}

export const cartCleanUp = async () => {
  const expirationTime = new Date(Date.now() - 20 * 60 * 1000);
  await dbConnect();

  try {
    // Find users with expired items
    const users = await userModel.find({
      "cardlist.addedAt": { $lt: expirationTime },
    });

    // Iterate over each user and handle their expired items
    for (const user of users) {
      const expiredItems = user.cardlist.filter(
        (item) => item.addedAt < expirationTime
      );

      // Update the product quantities
      for (const item of expiredItems) {
        await productModel.updateOne(
          { _id: item.itemId },
          { $inc: { quantity: item.itemQuantity } }
        );
      }

      // Remove the expired items from the user's cardlist
      user.cardlist = user.cardlist.filter(
        (item) => item.addedAt >= expirationTime
      );
      await user.save();
    }
  } catch (err) {
    console.error("Error cleaning up expired cart items:", err);
  }
};

export async function addToCart({
  trackingId = null,
  productId,
  country,
  quantity = 1,
}) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);
  const product = await productModel.findById(productObjectId);

  if (!product) throw new Error("Product not found");

  // If guest user with trackingId
  if (trackingId) {
    let cart = await cartModel.findOne({ trackingId });

    if (!cart) {
      // Check stock before creating new cart
      if (product.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      cart = await cartModel.create({
        trackingId,
        items: [
          {
            productId,
            quantity,

            addedAt: new Date(),
          },
        ],
        country,
      });

      // Don't decrease product quantity here
      return { success: true, type: "guest", message: "Item added to cart" };
    } else {
      const existingItemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productObjectId)
      );

      if (existingItemIndex > -1) {
        // Item already exists in cart
        return {
          success: false,
          type: "guest",
          message: "Item already exists in cart",
        };
      }

      // Check stock before adding new item
      if (product.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      // Add new item to cart
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date(),
      });

      await cart.save();

      // Don't decrease product quantity here
      return { success: true, type: "guest", message: "Item added to cart" };
    }
  }

  throw new Error("No userId or trackingId provided");
}

export async function clearGuestCart(trackingId) {
  await dbConnect();

  if (!trackingId) {
    throw new Error("Tracking ID is required");
  }

  // 1. Find cart docs for this trackingId
  const cartDoc = await OrderModel.find({ trackingId }).lean();

  if (!cartDoc || cartDoc.length === 0) {
    throw new Error("No cart found with this tracking ID");
  }

  const cartDocs = replaceMongoIdInArray(cartDoc);

  // 2. Verify cartItems exists before processing
  if (!cartDocs[0].cartItems || !Array.isArray(cartDocs[0].cartItems)) {
    throw new Error("Cart items are missing or invalid");
  }

  // 3. Process each cart item
  for (const cart of cartDocs) {
    if (!cart.cartItems) continue; // Skip if no items

    for (const product of cart.cartItems) {
      try {
        const qtyToDecrease = Number(product.qty);

        if (isNaN(qtyToDecrease) || qtyToDecrease <= 0) {
          console.warn(
            `⚠️ Skipping product ${product.id}, invalid qty:`,
            product.qty
          );
          continue;
        }

        const result = await productModel.updateOne(
          { _id: new mongoose.Types.ObjectId(product.id) },
          {
            $inc: {
              quantity: -qtyToDecrease,
              soldCount: qtyToDecrease,
            },
          }
        );

        if (result.matchedCount === 0) {
          console.warn(`⚠️ Product not found for id: ${product.id}`);
        }
      } catch (error) {
        console.error(`Failed to update product ${product.id}:`, error);
      }
    }
  }

  await cartModel.deleteMany({ trackingId });

  return {
    success: true,
  };
}

export async function incrementItemQuantity(trackingId, userId, itemId, plus) {
  try {
    await dbConnect();

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error("Invalid product ID");
    }

    if (trackingId) {
      //  Guest user logic using trackingId
      const cart = await cartModel.findOne({ trackingId });

      if (!cart) throw new Error("Cart not found");

      const item = cart.items.find(
        (i) => i.productId.toString() === itemId.toString()
      );
      if (!item) throw new Error("Item not found in cart");

      if (plus) {
        item.quantity += 1;
      } else if (item.quantity > 1) {
        item.quantity -= 1;
      }

      await cart.save();
    } else {
      throw new Error("Missing userId or trackingId");
    }
  } catch (error) {
    console.error(` Error updating itemQuantity for itemId: ${itemId}`, error);
    throw error;
  }
}

export async function removeCardList(userId, trackingId, productId) {
  await dbConnect();
  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const user = await userModel.findById(userId);
    if (user && Array.isArray(user.cardlist)) {
      const item = user.cardlist.find(
        (item) => item.itemId.toString() === productId.toString()
      );

      // Remove item from user's cardlist
      const result = await userModel.updateOne(
        { _id: userId },
        { $pull: { cardlist: { itemId: productId } } }
      );

      // Increment product quantity
      if (item?.itemQuantity) {
        await productModel.updateOne(
          { _id: productObjectId },
          { $inc: { quantity: item.itemQuantity } }
        );
      }

      return { success: true, source: "user", result };
    }
  }

  if (!trackingId) {
    throw new Error("Tracking ID is required for guest users");
  }

  // Remove item from guest cart
  const guestCart = await cartModel.findOne({ trackingId });
  if (!guestCart) {
    throw new Error("Guest cart not found");
  }

  const guestItem = guestCart.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  const result = await cartModel.updateOne(
    { trackingId },
    { $pull: { items: { productId: productId } } }
  );

  // Increment product quantity
  if (guestItem?.quantity) {
    await productModel.updateOne(
      { _id: productObjectId },
      { $inc: { quantity: guestItem.quantity } }
    );
  }

  return { success: true, source: "guest", result };
}

export async function setCartItemQuantity(trackingId, productId, quantity) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }
  await cartModel.updateOne(
    { trackingId, "items.productId": new mongoose.Types.ObjectId(productId) },
    { $set: { "items.$.quantity": quantity } }
  );
  return { success: true };
}

export const getSummary = async () => {
  await dbConnect();
  const session = await auth();
  if (session) {
    const user = await getUserByMail(session?.user?.email);
    const cartInfo = await user?.cardlist;

    if (cartInfo) {
      const subtotal = await Promise.all(
        cartInfo?.map(async (cart) => {
          const productInfo = await getProductById(cart?.itemId);
          const cost = productInfo.discount_price * cart?.itemQuantity;
          return { const: cost };
        })
      );
      const estimate = Math.ceil(
        subtotal.reduce((acc, curr) => acc + curr.const, 0)
      );

      return { cartInfo, estimate, userId: user.id };
    }
  }
};

export async function deleteCategoryById(id) {
  let existProduct = false;
  let success = false;
  try {
    await requireAdmin();
    // Prevent deletion if category has products
    const productCount = await productModel.countDocuments({ categoryId: id });
    if (productCount > 0) {
      existProduct = true;
      return { existProduct, success };
    }

    await categoryModel.findByIdAndDelete(id);
    success = true;

    // Revalidate cache
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/auth/dashboard/categories", "page");
      revalidatePath("/", "layout");
    } catch (revalidateError) {
      console.warn("Cache revalidation warning:", revalidateError.message);
    }

    return { existProduct, success };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// products end---------------------------------------------------------------

export async function getAllUsers({ isAdmin = null, lean = true } = {}) {
  try {
    await requireAdmin();
    // Build the query conditionally
    const query = {};

    if (isAdmin !== null) {
      query.isAdmin = isAdmin;
    }

    // Execute the query
    const users = await userModel.find(query).select("-password").lean(lean);
    return replaceMongoIdInArray(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function deleteUserById(userId) {
  try {
    await requireAdmin();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);

    return {
      id: deletedUser._id.toString(),
      name: deletedUser.name,
      email: deletedUser.email,
    };
  } catch (error) {
    console.error("User deletion error:", error);
    throw error; // Preserve original error
  }
}

export const getNextOrderNumber = async () => {
  try {
    await dbConnect();
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );
    return counter.seq;
  } catch (error) {
    console.error("Error getting next order number:", error);
    throw error;
  }
};

export const placeOrder = async (formData) => {
  try {
    await dbConnect();

    // Load the real cart from the database - never trust client quantities/prices
    const cart = await cartModel
      .findOne({ trackingId: formData.trackingId, isOrdered: false })
      .lean();

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const productIds = cart.items.map((item) => item.productId);
    const orderedProducts = await productModel
      .find({ _id: { $in: productIds } })
      .select(
        "_id sku name price discountCodes shippingEu shippingAsia shippingPt shippingFr shippingSp shippingWorld"
      )
      .lean();
    const productsById = {};
    for (const p of orderedProducts) {
      productsById[p._id.toString()] = p;
    }

    // Build order items and compute subtotal from DB prices + cart quantities
    const clientItems = Array.isArray(formData.cartItems)
      ? formData.cartItems
      : [];
    const orderItems = [];
    let subtotal = 0;
    for (const item of cart.items) {
      const product = productsById[item.productId?.toString?.() || ""];
      if (!product) continue;
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const unitPrice = Number(product.price?.eur || 0);
      subtotal += qty * unitPrice;
      const clientItem = clientItems.find(
        (ci) => ci.id === product._id.toString()
      );
      orderItems.push({
        id: product._id.toString(),
        name: clientItem?.name || product.name || "",
        qty,
        price: unitPrice,
        sku: product.sku || "",
      });
    }

    if (orderItems.length === 0) {
      throw new Error("Cart is empty");
    }

    subtotal = Number(subtotal.toFixed(2));

    // Discount only if the coupon is active on one of the products in the cart
    const couponInput = String(
      formData.appliedCoupon || formData.coupon || ""
    )
      .trim()
      .toLowerCase();
    let discount = 0;
    if (couponInput) {
      for (const p of orderedProducts) {
        const codes = Array.isArray(p.discountCodes) ? p.discountCodes : [];
        const found = codes.find(
          (c) =>
            c.isActive &&
            String(c.code || "").toLowerCase() === couponInput
        );
        if (found) {
          discount = Number(found.value || 0);
          break;
        }
      }
    }

    // Shipping - same rules as the checkout form (per product, not per qty)
    const state = formData.state || "";
    const shippingFieldFor = (field) =>
      orderedProducts.reduce(
        (total, p) => total + (Number(p[field]) || 0),
        0
      );
    let shipping = 0;
    if (state === "Spain") {
      shipping = shippingFieldFor("shippingSp");
    } else if (state === "Portugal") {
      shipping = shippingFieldFor("shippingPt");
    } else if (state === "France") {
      shipping = shippingFieldFor("shippingFr");
    } else if (europeanCountries.includes(state)) {
      shipping = shippingFieldFor("shippingEu");
    } else if (asianCountries.includes(state)) {
      shipping = shippingFieldFor("shippingAsia");
    } else {
      shipping = shippingFieldFor("shippingWorld");
    }
    shipping = Number(shipping.toFixed(2));

    // VAT - only Portuguese customers pay 23% (unless a valid EU VAT number)
    const isPortugueseCustomer = state === "Portugal";
    const isVatExempt = formData.vatValid === true;
    const taxRate = isPortugueseCustomer && !isVatExempt ? 0.23 : 0;
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const taxAmount = Number((subtotalAfterDiscount * taxRate).toFixed(2));

    const grandTotal = Number(
      (subtotalAfterDiscount + shipping + taxAmount).toFixed(2)
    );

    const order = {
      firstName: formData.firstName,

      lastName: formData.lastName,
      email: formData.email,
      streetAddress: formData.streetAddress,
      state,
      city: formData.city,
      zip: formData.zip,
      phone: formData.phone,
      sameAddress: formData.sameAddress || false,
      paid: false, // Default to false, update when payment completes
      coupon: formData.coupon || "",
      orderComment: formData.orderComment || "",
      agreeTerms: true, // Should be true if form submitted
      trackingId: formData.trackingId,
      vatValid: isVatExempt,
      vatNumber: formData.vatNumber || 0,
      cartItems: orderItems,
      totals: {
        subtotal: subtotal.toString(),
        discount,
        shipping,
        tax: taxAmount,
        grandTotal,
        currency: "euro", // always charge EUR via Stripe
      },
    };

    // Check if an unpaid order already exists for this trackingId
    const existingOrder = await OrderModel.findOne({
      trackingId: formData.trackingId,
      paid: false,
    });

    let savedOrder;

    if (existingOrder) {
      // Update existing unpaid order (no new orderNumber)
      const { trackingId: tid, ...fields } = order;
      savedOrder = await OrderModel.findOneAndUpdate(
        { trackingId: tid, paid: false },
        { $set: fields },
        { new: true }
      );
    } else {
      // New order - get next orderNumber
      const orderNumber = await getNextOrderNumber();
      const { trackingId: tid, ...fields } = order;
      savedOrder = await OrderModel.findOneAndUpdate(
        { trackingId: tid, paid: false },
        { $set: { ...fields, orderNumber } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return {
      success: true,
      grandTotal: order.totals.grandTotal,
    };
  } catch (error) {
    console.error("Order placement failed:", error);
    return {
      success: false,
      error: "Order placement failed. Please try again.",
    };
  }
};

const adjustStockForItems = async (items, direction) => {
  if (!items || items.length === 0) return;

  for (const item of items) {
    if (!item?.id || !item?.qty) continue;
    if (!mongoose.Types.ObjectId.isValid(item.id)) continue;

    if (direction === "decrement") {
      const product = await productModel.findById(item.id);
      if (!product) continue;
      const newQty = Math.max(0, (product.quantity || 0) - item.qty);
      await productModel.updateOne(
        { _id: item.id },
        { $set: { quantity: newQty } }
      );
    } else {
      await productModel.updateOne(
        { _id: item.id },
        { $inc: { quantity: item.qty } }
      );
    }
  }
};

export const markOrderAsPaid = async (trackingId, paymentIntentId) => {
  try {
    await dbConnect();

    const existingOrder = await OrderModel.findOne({ trackingId });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    const wasPaid = existingOrder.paid;

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { trackingId },
      {
        paid: true,
        transactionId: paymentIntentId,
      },
      { new: true }
    );

    if (!wasPaid) {
      await adjustStockForItems(updatedOrder.cartItems, "decrement");
    }

    try {
      await sendNewOrderNotifications(
        updatedOrder.toObject ? updatedOrder.toObject() : updatedOrder
      );
    } catch (emailError) {
      console.error("Order email notifications failed:", emailError);
    }

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Failed to update order:", error);
    return {
      success: false,
      error: "Failed to update order",
    };
  }
};

export const checkOrderExists = async (trackingId) => {
  try {
    await dbConnect();

    // Find order with the tracking ID where paid is false

    const order = await OrderModel.findOne({
      trackingId,
      paid: false,
    }).lean();

    // Return true only if unpaid order exists
    return !!order;
  } catch (error) {
    console.error("Error checking order existence:", error);
    // Return false if there's any error
    return false;
  }
};

export const isOrderPaid = async (trackingId) => {
  try {
    await dbConnect();
    // Find order with the tracking ID where paid is false
    const order = await OrderModel.findOne({
      trackingId,
      paid: true,
    }).lean();
    // Return true only if unpaid order exists
    return !!order;
  } catch (error) {
    console.error("Error checking order existence:", error);
    // Return false if there's any error
    return false;
  }
};

export const getOrderTotalsByTrackingId = async (trackingId) => {
  try {
    await dbConnect();

    // Find order and select only the totals field
    const order = await OrderModel.findOne({ trackingId })
      .select("totals -_id") // Only get totals field, exclude _id
      .lean()
      .exec();

    return order?.totals || null;
  } catch (error) {
    console.error("Error fetching order totals:", error);
    throw new Error("Failed to retrieve order totals");
  }
};

export const getOrderByTrackingId = async (trackingId) => {
  try {
    await dbConnect();
    const order = await OrderModel.findOne({ trackingId, paid: false })
      .select("email firstName lastName vatValid vatNumber totals")
      .lean();
    return order || null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export async function getTopSellingProducts() {
  try {
    await requireAdmin();
    await dbConnect();
    const topProducts = await productModel
      .find({})
      .sort({ soldCount: -1 })
      .limit(5)
      .select("name quantity price.usd price.eur soldCount")
      .lean();
    const products = topProducts.map((product) => ({
      name: product.name,
      id: product._id,
      currentStock: product.quantity,
      priceUSD: product.price.usd,
      priceEUR: product.price.eur,
      totalSold: product.soldCount,
    }));
    return replaceMongoIdInArray(products);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
}

export async function getToRefillProducts() {
  try {
    await requireAdmin();
    await dbConnect();
    // Get all manufacturers for id-name mapping
    const manufacturers = await manufacturerModel.find().lean();
    const manufacturerMap = {};
    manufacturers.forEach(m => {
      manufacturerMap[m._id.toString()] = m.name;
    });

    const refillProducts = await productModel
      .find({ $expr: { $lt: ["$quantity", "$minStock"] } })
      .select("name quantity minStock manufacturerId")
      .lean();

    let products = refillProducts.map((product) => ({
      name: product.name,
      manufacturerName: product.manufacturerId ? manufacturerMap[product.manufacturerId.toString()] || '-' : '-',
      quantity: product.quantity,
      minStock: product.minStock,
      id: product._id
    }));
    // Sort by manufacturerName (case-insensitive), '-' (missing) comes last
    products = products.sort((a, b) => {
      if (a.manufacturerName === '-' && b.manufacturerName !== '-') return 1;
      if (a.manufacturerName !== '-' && b.manufacturerName === '-') return -1;
      return a.manufacturerName.localeCompare(b.manufacturerName, undefined, { sensitivity: 'base' });
    });
    return replaceMongoIdInArray(products);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
}

export async function getTotalCarts() {
  try {
    await requireAdmin();
    await dbConnect();
    const carts = await cartModel.find().lean();

    return replaceMongoIdInArray(carts);
  } catch (error) {
    console.error("Error fetching all carts:", error);
    throw new Error("Failed to retrieve carts");
  }
}

export async function deleteCartById(cartId) {
  await requireAdmin();
  await dbConnect();

  await cartModel.findByIdAndDelete(cartId);
}

export async function euUkVatCheck(countryCode, vatNumber) {
  try {
    await dbConnect();
    if (!countryCode || !vatNumber) {
      throw new Error("Both countryCode and vatNumber are required");
    }

    const cleanedCountryCode = countryCode.trim().toUpperCase();
    const cleanedVatNumber = vatNumber.trim().replace(/\s+/g, "");

    if (
      cleanedCountryCode.length !== 2 ||
      !/^[A-Z]{2}$/.test(cleanedCountryCode)
    ) {
      throw new Error("Country code must be a 2-letter ISO code");
    }

    // Call EU VIES API
    const response = await fetch(
      `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${cleanedCountryCode}/vat/${cleanedVatNumber}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store", // avoid caching for validation requests
      }
    );

    if (!response.ok) {
      throw new Error(`VIES service responded with status ${response.status}`);
    }

    const result = await response.json();

    return {
      valid: result.isValid,
      name: result.name || null,
      address: result.address || null,
      countryCode: result.countryCode,
      vatNumber: result.vatNumber,
      requestDate: result.requestDate,
      ...(process.env.NODE_ENV === "development" && { raw: result }),
    };
  } catch (error) {
    console.error("VAT validation error:", error);
    return {
      error: "VAT_CHECK_FAILED",
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { details: error.stack }),
    };
  }
}

function parseProductPriceNumber(value) {
  if (value === undefined || value === null || value === "") return NaN;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

function productStrTrim(value) {
  if (value == null) return "";
  return String(value).trim();
}

// Removes dangerous HTML (scripts, event handlers, javascript: URLs)
// while keeping the rich-text formatting produced by the Jodit editor.
function sanitizeDescription(value) {
  const trimmed = productStrTrim(value);
  if (!trimmed) return "";
  return sanitizeHtml(trimmed, {
    allowedSchemes: ["http", "https", "mailto", "data"],
  });
}

export async function createProduct(data) {
  await dbConnect();
  try {
    await requireAdmin();
    const requiredFields = [
      "name",
      "description",
      "quantity",
      "minStock"
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const priceEur = parseProductPriceNumber(data.priceEUR);
    const priceUsdInput = parseProductPriceNumber(data.priceUSD);
    const priceGbpInput = parseProductPriceNumber(data.priceGBP ?? data.price?.gbp);
    const priceMain = Number.isFinite(priceEur) ? priceEur : priceUsdInput;
    if (!Number.isFinite(priceMain)) {
      return {
        success: false,
        status: 400,
        message: "Price (EUR or USD) is required and must be a valid number",
      };
    }

    // Numeric field validation
    const numericFields = [
      "priceUSD",
      "priceEUR",
      "priceGBP",
      "discountUSD",
      "discountEUR",
      "discountGBP",
      "quantity",
      "minStock"
    ];
    for (const field of numericFields) {
      const value = data[field];
      if (value !== undefined && value !== null && value !== "" && isNaN(Number(value))) {
        return {
          success: false,
          status: 400,
          message: `${field} must be a valid number`,
        };
      }
    }

    const discEur = parseProductPriceNumber(data.discountEUR);
    const discUsdInput = parseProductPriceNumber(data.discountUSD);
    const discGbpInput = parseProductPriceNumber(data.discountGBP ?? data.discountPrice?.gbp);
    const hasDiscount =
      Number.isFinite(discEur) || Number.isFinite(discUsdInput);
    const discMain = Number.isFinite(discEur) ? discEur : discUsdInput;

    // Prepare product data with proper type conversion
    const productData = {
      name: productStrTrim(data.name),
      namePt: productStrTrim(data.namePt),
      nameFr: productStrTrim(data.nameFr),
      nameEs: productStrTrim(data.nameEs),
      nameHe: productStrTrim(data.nameHe),
      nameDe: productStrTrim(data.nameDe),
      nameIt: productStrTrim(data.nameIt),
      image: data.image,
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : (data.image ? [data.image] : []),
      price: {
        usd: priceMain,
        eur: priceMain,
        ...(Number.isFinite(priceGbpInput) && { gbp: priceGbpInput }),
      },
      discountPrice:
        hasDiscount && Number.isFinite(discMain)
          ? {
              usd: discMain,
              eur: discMain,
              ...(Number.isFinite(discGbpInput) && { gbp: discGbpInput }),
            }
          : undefined,
      reviewsNumber: data.reviewsNumber ? parseInt(data.reviewsNumber) : 0,
      ratings: data.ratings ? parseFloat(data.ratings) : undefined,
      manufacturerId: data.manufacturerId || (Array.isArray(data.manufacturerIds) && data.manufacturerIds[0]) || undefined,
      manufacturerIds: Array.isArray(data.manufacturerIds) ? data.manufacturerIds.filter(Boolean) : (data.manufacturerId ? [data.manufacturerId] : []),
      categoryId: data.categoryId || (Array.isArray(data.categoryIds) && data.categoryIds[0]) || undefined,
      categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds.filter(Boolean) : (data.categoryId ? [data.categoryId] : []),
      subcategoryId: data.subcategoryId || (Array.isArray(data.subcategoryIds) && data.subcategoryIds[0]) || undefined,
      subcategoryIds: Array.isArray(data.subcategoryIds) ? data.subcategoryIds.filter(Boolean) : (data.subcategoryId ? [data.subcategoryId] : []),
      description: sanitizeDescription(data.description),
      descriptionPt: sanitizeDescription(data.descriptionPt),
      descriptionFr: sanitizeDescription(data.descriptionFr),
      descriptionEs: sanitizeDescription(data.descriptionEs),
      descriptionHe: sanitizeDescription(data.descriptionHe),
      descriptionDe: sanitizeDescription(data.descriptionDe),
      descriptionIt: sanitizeDescription(data.descriptionIt),
      isActive: data?.visibility === "public" ? true : false,
      quantity: parseInt(data.quantity),
      minStock: parseInt(data.minStock),
      shippingEu: data.shippingEu || 0,
      shippingAsia: data.shippingAsia || 0,
      shippingPt: data.shippingPt || 0,
      shippingFr: data.shippingFr || 0,
      shippingSp: data.shippingSp || 0,
      shippingWorld: data.shippingWorld || 0,
      discountCodes: data.discountCodes || [],
      ...(data.sku && { sku: data.sku.trim().toUpperCase() }),
      ...(data.features && {
        features: Array.isArray(data.features) ? data.features : [],
      }),
    };

    // Validate description length
    if (!productData.description || productData.description.length < 10) {
      return {
        success: false,
        status: 400,
        message: "Description must be at least 10 characters long",
        error: "DESCRIPTION_TOO_SHORT",
        minLength: 10,
        currentLength: productData.description?.length || 0,
      };
    }

    // Validate discount price is less than regular price
    if (
      productData.discountPrice?.usd &&
      productData.discountPrice.usd >= productData.price.usd
    ) {
      return {
        success: false,
        status: 400,
        message: "Discount price (USD) must be lower than regular price",
      };
    }
    if (
      productData.discountPrice?.eur &&
      productData.discountPrice.eur >= productData.price.eur
    ) {
      return {
        success: false,
        status: 400,
        message: "Discount price (EUR) must be lower than regular price",
      };
    }
    // Save product to database
    const translatedProductData = await autoTranslateMissing(productData, null, ["name", "description"]);
    const newProduct = await productModel.create(translatedProductData);
    return {
      success: true,
      status: 201,
      message: "Product created successfully",
      productId: newProduct._id.toString(),
    };
  } catch (error) {
    console.error("Product creation error:", error);
    if (error.code === 11000) {
      return {
        success: false,
        status: 409,
        message: "Product with this SKU already exists",
      };
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return {
        success: false,
        status: 400,
        message: "Validation failed",
        errors,
      };
    }
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

export async function updateProduct(productId, data) {
  await dbConnect();

  try {
    await requireAdmin();
    if (!productId) {
      return {
        success: false,
        status: 400,
        message: "Product ID is required",
      };
    }

    // Check if product exists
    const existingProduct = await productModel.findById(productId).lean();
    if (!existingProduct) {
      return {
        success: false,
        status: 404,
        message: "Product not found",
      };
    }

    const requiredFields = [
      "name",
      "description",
      "quantity",
      "minStock"
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const priceEur = parseProductPriceNumber(data.priceEUR);
    const priceUsdInput = parseProductPriceNumber(data.priceUSD);
    const priceGbpInput = parseProductPriceNumber(data.priceGBP ?? data.price?.gbp);
    const priceMain = Number.isFinite(priceEur) ? priceEur : priceUsdInput;
    if (!Number.isFinite(priceMain)) {
      return {
        success: false,
        status: 400,
        message: "Price (EUR or USD) is required and must be a valid number",
      };
    }

    // Numeric field validation
    const numericFields = [
      "priceUSD",
      "priceEUR",
      "priceGBP",
      "discountUSD",
      "discountEUR",
      "discountGBP",
      "reviewsNumber",
      "ratings",
      "quantity",
      "minStock"
    ];

    for (const field of numericFields) {
      const value = data[field];
      if (value !== undefined && value !== null && value !== "" && isNaN(Number(value))) {
        return {
          success: false,
          status: 400,
          message: `${field} must be a valid number`,
        };
      }
    }

    const discEur = parseProductPriceNumber(data.discountEUR);
    const discUsdInput = parseProductPriceNumber(data.discountUSD);
    const discGbpInput = parseProductPriceNumber(data.discountGBP ?? data.discountPrice?.gbp);
    const hasDiscount =
      Number.isFinite(discEur) || Number.isFinite(discUsdInput);
    const discMain = Number.isFinite(discEur) ? discEur : discUsdInput;

    // Prepare product data with type conversion
    const productData = {
      name: productStrTrim(data.name),
      namePt: productStrTrim(data.namePt),
      nameFr: productStrTrim(data.nameFr),
      nameEs: productStrTrim(data.nameEs),
      nameHe: productStrTrim(data.nameHe),
      nameDe: productStrTrim(data.nameDe),
      nameIt: productStrTrim(data.nameIt),
      image: data.image || existingProduct.image,
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images.filter(Boolean)
        : (existingProduct.images?.length > 0 ? existingProduct.images : (existingProduct.image ? [existingProduct.image] : [])),
      price: {
        usd: priceMain,
        eur: priceMain,
        ...(Number.isFinite(priceGbpInput) && { gbp: priceGbpInput }),
      },
      discountPrice:
        hasDiscount && Number.isFinite(discMain)
          ? {
              usd: discMain,
              eur: discMain,
              ...(Number.isFinite(discGbpInput) && { gbp: discGbpInput }),
            }
          : undefined,
      reviewsNumber: data.reviewsNumber
        ? parseInt(data.reviewsNumber)
        : existingProduct.reviewsNumber,
      ratings: data.ratings
        ? parseFloat(data.ratings)
        : existingProduct.ratings,
      manufacturerId: data.manufacturerId || (Array.isArray(data.manufacturerIds) && data.manufacturerIds[0]) || existingProduct.manufacturerId,
      manufacturerIds: Array.isArray(data.manufacturerIds) && data.manufacturerIds.length > 0 ? data.manufacturerIds.filter(Boolean) : (existingProduct.manufacturerIds?.length > 0 ? existingProduct.manufacturerIds : (existingProduct.manufacturerId ? [existingProduct.manufacturerId] : [])),
      categoryId: data.categoryId || (Array.isArray(data.categoryIds) && data.categoryIds[0]) || existingProduct.categoryId,
      categoryIds: Array.isArray(data.categoryIds) && data.categoryIds.length > 0 ? data.categoryIds.filter(Boolean) : (existingProduct.categoryIds?.length > 0 ? existingProduct.categoryIds : (existingProduct.categoryId ? [existingProduct.categoryId] : [])),
      subcategoryId: data.subcategoryId || (Array.isArray(data.subcategoryIds) && data.subcategoryIds[0]) || existingProduct.subcategoryId,
      subcategoryIds: Array.isArray(data.subcategoryIds) && data.subcategoryIds.length > 0 ? data.subcategoryIds.filter(Boolean) : (existingProduct.subcategoryIds?.length > 0 ? existingProduct.subcategoryIds : (existingProduct.subcategoryId ? [existingProduct.subcategoryId] : [])),
      description: sanitizeDescription(data.description),
      descriptionPt: sanitizeDescription(data.descriptionPt),
      descriptionFr: sanitizeDescription(data.descriptionFr),
      descriptionEs: sanitizeDescription(data.descriptionEs),
      descriptionHe: sanitizeDescription(data.descriptionHe),
      descriptionDe: sanitizeDescription(data.descriptionDe),
      descriptionIt: sanitizeDescription(data.descriptionIt),
      isActive: data?.visibility === "public" ? true : false,
      quantity: parseInt(data.quantity),
      minStock: parseInt(data.minStock),
      shippingEu: data.shippingEu || 0,
      shippingAsia: data.shippingAsia || 0,
      shippingPt: data.shippingPt || 0,
      shippingFr: data.shippingFr || 0,
      shippingSp: data.shippingSp || 0,
      shippingWorld: data.shippingWorld || 0,
      discountCodes: data.discountCodes || [],
      ...(data.sku && { sku: data.sku.trim().toUpperCase() }),
      ...(data.features && {
        features: Array.isArray(data.features)
          ? data.features
          : existingProduct.features,
      }),
    };

    // Validate discount prices
    if (
      productData.discountPrice?.usd &&
      productData.discountPrice.usd >= productData.price.usd
    ) {
      return {
        success: false,
        status: 400,
        message: "Discount price (USD) must be lower than regular price",
      };
    }

    if (
      productData.discountPrice?.eur &&
      productData.discountPrice.eur >= productData.price.eur
    ) {
      return {
        success: false,
        status: 400,
        message: "Discount price (EUR) must be lower than regular price",
      };
    }

    // Validate description length
    if (!productData.description || productData.description.length < 10) {
      return {
        success: false,
        status: 400,
        message: "Description must be at least 10 characters long",
        error: "DESCRIPTION_TOO_SHORT",
        minLength: 10,
        currentLength: productData.description?.length || 0,
      };
    }

    const translatedProductData = await autoTranslateMissing(productData, existingProduct, ["name", "description"]);
    const updatedProduct = await productModel
      .findByIdAndUpdate(productId, translatedProductData, { new: true });

    return {
      success: true,
      status: 200,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("Product update error:", error);

    if (error.code === 11000) {
      return {
        success: false,
        status: 409,
        message: "Product with this SKU already exists",
      };
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return {
        success: false,
        status: 400,
        message: "Validation failed",
        errors,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

// Server-side function (getPaginatedProducts)
export async function getPaginatedProducts({
  offset = 0,
  limit = 10,
  searchQuery = "",
  categoryId = "",
  lean = true,
  sort = { createdAt: -1 },
  /** Admin dashboard: list private (isActive: false) products too */
  includeInactive = false,
} = {}) {
  try {
    await dbConnect();
    // Convert to numbers
    offset = Number(offset);
    limit = Number(limit);

    // FIXED: Use stable sorting with secondary field
    const stableSort = { ...sort, _id: 1 };

    // 1. Define the projection
    const projection = {
      name: 1,
      image: 1,
      manufacturerId: 1,
      quantity: 1,
      categoryId: 1,
      price: 1,
      isActive: 1,
      minStock: 1,
      createdAt: 1,
      _id: 1,
      sku: 1,
    };

    // 2. Build search conditions (storefront uses only active; admin can include private)
    let searchConditions = includeInactive ? {} : { isActive: true };
    if (searchQuery && searchQuery.trim() !== "") {
      const trimmedQuery = searchQuery.trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmedQuery);
      const searchConditionsArray = [{ name: new RegExp(escapeRegex(trimmedQuery), "i") }, { sku: new RegExp(escapeRegex(trimmedQuery), "i") }];
      if (isObjectId) {
        searchConditionsArray.push({ _id: trimmedQuery });
      }
      if (includeInactive) {
        searchConditions = { $or: searchConditionsArray };
      } else {
        searchConditions = { isActive: true, $or: searchConditionsArray };
      }
    }
    // Filter by categoryId if provided
    if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
      const catObjId = new mongoose.Types.ObjectId(categoryId);
      searchConditions = {
        ...searchConditions,
        $or: [
          { categoryId: catObjId },
          { categoryIds: catObjId },
        ],
      };
    }

    // 3. Create the base query with explicit population
    let query = productModel
      .find(searchConditions, projection)
      .skip(offset)
      .limit(limit)
      .populate({
        path: "manufacturerId",
        select: "name logo",
        model: "manufacturers",
      })
      .populate({
        path: "categoryId",
        select: "name slug",
        model: "categories",
      });

    // 4. Apply stable sorting
    query = query.sort(stableSort);

    // 5. Get total count for pagination
    const totalCount = await productModel.countDocuments(searchConditions);
    const totalPages = Math.ceil(totalCount / limit);

    // 6. Execute the query
    let products;
    if (lean) {
      products = await query
        .lean({
          virtuals: true,
          getters: true,
        })
        .exec();
    } else {
      products = await query.exec();
    }

    // 7. Transform the data for consistent output
    const transformedProducts = products.map((product) => {
      const manufacturer = product.manufacturerId;
      const category = product.categoryId;
      return {
        id: product._id?.toString(),
        name: product.name,
        image: product.image,
        quantity: product.quantity,
        minStock: product.minStock,
        price: product.price,
        isActive: product.isActive,
        createdAt: product.createdAt,
        sku: product.sku,
        manufacturer: manufacturer
          ? {
              id: manufacturer._id?.toString(),
              name: manufacturer.name,
              ...(manufacturer.logo && { logo: manufacturer.logo }),
            }
          : null,
        category: category
          ? {
              id: category._id?.toString(),
              name: category.name,
              ...(category.slug && { slug: category.slug }),
            }
          : null,
      };
    });

    // FIXED: Return consistent pagination info
    return {
      products: transformedProducts,
      totalCount,
      totalPages,
      currentPage: Math.floor(offset / limit) + 1, // 1-based page
      hasNext: offset + limit < totalCount,
      hasPrev: offset > 0,
      limit,
      offset,
    };
  } catch (error) {
    console.error("Paginated products fetch error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      searchQuery,
      offset,
      limit,
    });
    throw new Error("Failed to fetch products. Please try again later.");
  }
}

function orderChannelFilter(orderChannel) {
  if (orderChannel === "company") {
    return { $or: [{ orderType: "Old" }, { salesChannel: "Company" }] };
  }
  if (orderChannel === "website") {
    return { orderType: { $ne: "Old" }, salesChannel: { $ne: "Company" } };
  }
  return null;
}

export async function getPaginatedOrders({
  offset,
  limit,
  searchQuery,
  statusFilter,
  paidFilter = "paid",
  orderChannel = "website",
}) {
  try {
    await requireAdmin();
    await dbConnect();
    let query = { archived: { $ne: true } };

    const channelFilter = orderChannelFilter(orderChannel);

    // Add search criteria if provided
    const searchFilter = searchQuery
      ? {
          $or: [
            { firstName: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { lastName: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { email: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { transactionId: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { orderNumber: parseInt(searchQuery.match(/\d+/)?.[0]) || -1 },
          ],
        }
      : null;

    if (channelFilter && searchFilter) {
      query.$and = [channelFilter, searchFilter];
    } else if (channelFilter) {
      Object.assign(query, channelFilter);
    } else if (searchFilter) {
      Object.assign(query, searchFilter);
    }

    // Filter by payment status (default: only paid orders)
    if (paidFilter === "paid") {
      query.paid = true;
    } else if (paidFilter === "unpaid") {
      query.paid = false;
    }

    // Add status filter if provided
    if (statusFilter && statusFilter !== "all") {
      query.currentStatus = statusFilter;
    }

    const orders = await OrderModel.find(query)
      .sort({ orderNumber: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const totalCount = await OrderModel.countDocuments(query);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function deleteOrderById(id) {
  try {
    await requireAdmin();
    await dbConnect();
    await OrderModel.findByIdAndUpdate(id, { archived: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

export async function updateOrderStatusById(id, status) {
  try {
    await requireAdmin();
    await dbConnect();
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    const prevStatus = order.currentStatus;

    await OrderModel.findByIdAndUpdate(id, { currentStatus: status });

    if (order.paid) {
      if (status === "Cancelled" && prevStatus !== "Cancelled") {
        await adjustStockForItems(order.cartItems, "restore");
      } else if (prevStatus === "Cancelled" && status !== "Cancelled") {
        await adjustStockForItems(order.cartItems, "decrement");
      }
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function getOrderById(id) {
  try {
    await requireAdmin();
    await dbConnect();

    const order = await OrderModel.findById(id).lean();

    if (!order) {
      throw new Error("Order not found");
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function updateOrderPaymentStatus(
  id,
  paidStatus = undefined,
  transactionId = null
) {
  try {
    await requireAdmin();
    // await dbConnect(); // Uncomment if you need to connect to DB

    const existingOrder = await OrderModel.findById(id);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    const wasPaid = existingOrder.paid;

    const updateData = {};

    if (paidStatus !== undefined) {
      updateData.paid = paidStatus;
    }

    if (transactionId !== null) {
      updateData.transactionId = transactionId;
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    if (paidStatus === true && !wasPaid) {
      await adjustStockForItems(updatedOrder.cartItems, "decrement");
    } else if (paidStatus === false && wasPaid) {
      await adjustStockForItems(updatedOrder.cartItems, "restore");
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
}

export async function updateOrderInfoById(id, info = {}) {
  try {
    await requireAdmin();
    await dbConnect();
    const updateData = {};

    if (info.invoiceNumber !== undefined) {
      updateData.invoiceNumber = info.invoiceNumber;
    }
    if (info.deliveryCompany !== undefined) {
      updateData.deliveryCompany = info.deliveryCompany;
    }
    if (info.shippingDate !== undefined) {
      updateData.shippingDate = info.shippingDate ? new Date(info.shippingDate) : null;
    }
    if (info.shippingPrice !== undefined) {
      const shippingPrice = Math.max(0, parseFloat(info.shippingPrice) || 0);
      updateData["totals.shipping"] = shippingPrice;
      const order = await OrderModel.findById(id);
      if (order) {
        const subtotal = parseFloat(order.totals?.subtotal) || 0;
        const discount = parseFloat(order.totals?.discount) || 0;
        const tax = parseFloat(order.totals?.tax) || 0;
        updateData["totals.grandTotal"] = subtotal - discount + shippingPrice + tax;
      }
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return JSON.parse(JSON.stringify(updatedOrder));
  } catch (error) {
    console.error("Error updating order info:", error);
    throw error;
  }
}

export async function createManualOrder(data) {
  try {
    await requireAdmin();
    await dbConnect();

    const {
      firstName = "",
      lastName = "",
      email = "",
      phone = "",
      streetAddress = "",
      state = "",
      city = "",
      zip = "",
      items = [],
      deliveryCompany = "",
      shipping = 0,
      awb = "",
      invoiceNumber = "",
      shippingDate = null,
      currency = "EUR",
      paid = true,
    } = data;

    if (!awb || !awb.trim()) {
      return { success: false, error: "AWB (tracking number) is required" };
    }

    const cartItems = [];
    for (const item of items || []) {
      const name = (item.name || "").trim();
      if (!name) continue;
      const code = (item.code || "").trim().toUpperCase();
      const qty = Math.max(0, parseInt(item.qty, 10) || 0);
      if (qty <= 0) continue;
      const price = Math.max(0, parseFloat(item.price) || 0);

      let productId = `manual-${cartItems.length}`;
      if (code) {
        const product = await productModel
          .findOne({ sku: code })
          .select("_id")
          .lean();
        if (product) {
          productId = String(product._id);
        }
      }

      cartItems.push({
        id: productId,
        name,
        sku: code,
        qty,
        price,
      });
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingPrice = Math.max(0, parseFloat(shipping) || 0);
    const grandTotal = subtotal + shippingPrice;

    const orderNumber = await getNextOrderNumber();
    const trackingId = awb.trim();

    const orderData = {
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      state,
      city,
      zip,
      sameAddress: false,
      paid,
      coupon: "",
      orderComment: "",
      agreeTerms: true,
      trackingId,
      transactionId: "",
      vatValid: false,
      vatNumber: "0",
      orderNumber,
      invoiceNumber: invoiceNumber ? invoiceNumber.trim() : "",
      deliveryCompany: deliveryCompany.trim(),
      shippingDate: shippingDate ? new Date(shippingDate) : null,
      salesChannel: "Company",
      orderType: "Old",
      cartItems,
      totals: {
        subtotal: subtotal.toString(),
        discount: 0,
        shipping: shippingPrice,
        tax: 0,
        grandTotal,
        currency,
      },
    };

    const order = await OrderModel.create(orderData);

    if (order.paid) {
      await adjustStockForItems(order.cartItems, "decrement");
    }

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    };
  } catch (error) {
    console.error("Error creating manual order:", error);
    if (error.code === 11000) {
      return { success: false, error: "AWB (tracking number) already in use" };
    }
    throw error;
  }
}

export async function getTotalOrdersCount({ channel = "website" } = {}) {
  try {
    await dbConnect(); // Make sure to connect to database first
    const query = {};
    const channelFilter = orderChannelFilter(channel);
    if (channelFilter) {
      Object.assign(query, channelFilter);
    }
    const totalCount = await OrderModel.countDocuments(query);
    return totalCount;
  } catch (error) {
    console.error("Error getting total orders count:", error);
    return 0;
  }
}

export async function createUser(data) {
  try {
    await requireAdmin();
    await dbConnect();
    const { name, email, password, isAdmin = false } = data;

    if (!name || !email || !password) {
      return { success: false, error: "Missing required fields" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: Boolean(isAdmin),
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: "Internal server error" };
  }
}

// pending orders -------------------------------------------------------------------

export async function createPendingOrder(data) {
  try {
    await requireAdmin();
    await dbConnect();

    const {
      firstName = "",
      lastName = "",
      address = "",
      email = "",
      parts = [],
    } = data;

    const validParts = (parts || [])
      .filter((p) => p.partsNumber.trim() || p.manufacturer.trim())
      .map((p) => ({
        manufacturer: p.manufacturer.trim(),
        partsNumber: p.partsNumber.trim(),
        qty: Math.max(1, parseInt(p.qty, 10) || 1),
      }));

    const pendingOrder = await PendingOrderModel.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      email: email.trim(),
      parts: validParts,
    });

    return {
      success: true,
      pendingOrder: JSON.parse(JSON.stringify(pendingOrder)),
    };
  } catch (error) {
    console.error("Error creating pending order:", error);
    throw error;
  }
}

export async function getPendingOrders({
  offset,
  limit,
  searchQuery,
  statusFilter,
}) {
  try {
    await requireAdmin();
    await dbConnect();
    let query = {};

    const searchFilter = searchQuery
      ? {
          $or: [
            { firstName: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { lastName: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { email: { $regex: escapeRegex(searchQuery), $options: "i" } },
            { "parts.partsNumber": { $regex: escapeRegex(searchQuery), $options: "i" } },
          ],
        }
      : null;

    if (searchFilter) {
      query = searchFilter;
    }

    if (statusFilter && statusFilter !== "all") {
      query.currentStatus = statusFilter;
    }

    const pendingOrders = await PendingOrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const totalCount = await PendingOrderModel.countDocuments(query);

    return {
      pendingOrders: JSON.parse(JSON.stringify(pendingOrders)),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    throw error;
  }
}

export async function getPendingOrderById(id) {
  try {
    await dbConnect();
    const pendingOrder = await PendingOrderModel.findById(id).lean();
    if (!pendingOrder) {
      throw new Error("Pending order not found");
    }
    return JSON.parse(JSON.stringify(pendingOrder));
  } catch (error) {
    console.error("Error fetching pending order:", error);
    throw error;
  }
}

export async function updatePendingOrderById(id, data = {}) {
  try {
    await requireAdmin();
    await dbConnect();

    const updateData = {};
    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName.trim();
    }
    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName.trim();
    }
    if (data.address !== undefined) {
      updateData.address = data.address.trim();
    }
    if (data.email !== undefined) {
      updateData.email = data.email.trim();
    }
    if (data.parts !== undefined) {
      updateData.parts = (data.parts || [])
        .filter((p) => p.partsNumber.trim() || p.manufacturer.trim())
        .map((p) => ({
          manufacturer: p.manufacturer.trim(),
          partsNumber: p.partsNumber.trim(),
          qty: Math.max(1, parseInt(p.qty, 10) || 1),
        }));
    }

    const updatedPendingOrder = await PendingOrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPendingOrder) {
      throw new Error("Pending order not found");
    }

    return JSON.parse(JSON.stringify(updatedPendingOrder));
  } catch (error) {
    console.error("Error updating pending order:", error);
    throw error;
  }
}

export async function updatePendingOrderStatusById(id, status) {
  try {
    await requireAdmin();
    await dbConnect();
    const updatedPendingOrder = await PendingOrderModel.findByIdAndUpdate(
      id,
      { currentStatus: status },
      { new: true }
    );

    if (!updatedPendingOrder) {
      throw new Error("Pending order not found");
    }

    return JSON.parse(JSON.stringify(updatedPendingOrder));
  } catch (error) {
    console.error("Error updating pending order status:", error);
    throw error;
  }
}

export async function deletePendingOrder(id) {
  try {
    await requireAdmin();
    await dbConnect();
    await PendingOrderModel.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting pending order:", error);
    throw error;
  }
}