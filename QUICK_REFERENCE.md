# Quick Reference - Category Image Upload Feature

## Files at a Glance

### Core Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `app/(admin)/auth/dashboard/add-category/page.js` | Add new categories with images | ✅ Ready |
| `app/(admin)/auth/dashboard/categories/page.js` | List categories with images | ✅ Ready |
| `app/(admin)/auth/dashboard/categories/EditCategoryModal.jsx` | Edit categories (NEW) | ✅ Created |
| `database/queries/index.js` | Database operations | ✅ Updated |
| `models/category-models.js` | Database schema | ✅ Ready (no changes) |

### Documentation Files

| File | Purpose |
|------|---------|
| `CATEGORY_IMAGE_UPLOAD.md` | Feature documentation |
| `TESTING_GUIDE.md` | Testing procedures |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview |
| `QUICK_REFERENCE.md` | This file |

---

## Database Functions Reference

### addCategory(categoryData)
```javascript
import { addCategory } from "@/database/queries";

const result = await addCategory({
  name: "Category Name",
  slug: "category-slug",
  description: "Optional description",
  icon: "https://imgbb.com/image-url" // Optional - image URL from ImgBB
});

// Returns: { id, name, slug, description, icon, createdAt }
```

### updateCategory(id, categoryData)
```javascript
import { updateCategory } from "@/database/queries";

const result = await updateCategory(categoryId, {
  name: "Updated Name",
  slug: "updated-slug",
  description: "Updated description",
  icon: "https://imgbb.com/new-image-url" // Optional
});

// Returns: { id, name, slug, description, icon, createdAt }
```

### getCategories()
```javascript
import { getCategories } from "@/database/queries";

const categories = await getCategories();

// Returns: [
//   { id, name, slug, icon, description, createdAt },
//   ...
// ]
```

---

## Component Usage

### EditCategoryModal Usage
```javascript
import EditCategoryModal from "./EditCategoryModal";

// In your component:
const [showModal, setShowModal] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);

// When user clicks edit:
const handleEdit = (category) => {
  setEditingCategory(category);
  setShowModal(true);
};

// In JSX:
{showModal && (
  <EditCategoryModal
    category={editingCategory}
    onClose={() => setShowModal(false)}
    onSuccess={(updatedCategory) => {
      // Handle success - update table/list
      setShowModal(false);
    }}
  />
)}
```

---

## Environment Setup

### Required Environment Variables
```env
NEXT_PUBLIC_imageBB_key=your_imgbb_api_key_here
```

### MongoDB Collection Schema
```javascript
{
  CatId: Number,           // Optional sequential ID
  name: String,            // Required, unique
  slug: String,            // Required, unique
  icon: String,            // Optional - ImgBB image URL
  description: String,     // Optional
  createdAt: Date          // Auto-set on creation
}
```

---

## Common Code Snippets

### Fetch and Display Categories with Images
```javascript
"use client";
import { getCategories } from "@/database/queries";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map(cat => (
        <div key={cat.id} className="border rounded p-4">
          {cat.icon && (
            <Image
              src={cat.icon}
              alt={cat.name}
              width={200}
              height={200}
              className="w-full object-cover"
            />
          )}
          <h3 className="font-bold mt-2">{cat.name}</h3>
          <p className="text-sm text-gray-600">{cat.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Upload Image to ImgBB
```javascript
const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_imageBB_key}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.data.url; // Returns the image URL
};
```

---

## Routes and Endpoints

### UI Routes
| Route | Purpose | Component |
|-------|---------|-----------|
| `/auth/dashboard/add-category` | Create new category with image | `add-category/page.js` |
| `/auth/dashboard/categories` | View all categories with images | `categories/page.js` |

### Database Operations (Server-Side)
| Function | Operation | Returns |
|----------|-----------|---------|
| `addCategory()` | CREATE | New category object |
| `updateCategory()` | UPDATE | Updated category object |
| `getCategories()` | READ | Array of categories |
| `deleteCategoryById()` | DELETE | Success/error message |

---

## Error Messages & Handling

### Validation Errors
```
"Name and slug are required"
"Category with this name or slug already exists"
"Image size exceeds 5MB limit"
```

### API Errors
```
"Failed to upload image to ImgBB"
"Failed to create category"
"Failed to update category"
"Category not found"
```

### User Feedback
All errors shown via toast notifications:
```javascript
toast.error("Error message", { position: "bottom-right" });
toast.success("Success message", { position: "bottom-right" });
```

---

## Performance Considerations

1. **Image Optimization**
   - Use Next.js Image component for automatic optimization
   - 5MB file size limit prevents large uploads
   - ImgBB handles image compression

2. **Database Queries**
   - `getCategories()` uses `.lean()` for faster reads
   - `updateCategory()` uses `$ne` for efficient duplicate checking
   - Consider indexing `name` and `slug` fields

3. **Frontend**
   - Loading states prevent multiple submissions
   - Image preview uses object URLs (no server calls)
   - Modal prevents full page reloads

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Image Upload | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| FormData API | ✅ | ✅ | ✅ | ✅ |
| File API | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not uploading | Check ImgBB API key in .env.local |
| "No Image" shows for categories with images | Hard refresh browser (Ctrl+Shift+R) |
| Modal won't close | Check browser console for errors |
| Duplicate validation not working | Ensure database indexes created |
| Image preview missing | Check file size < 5MB |
| Edit form empty | Verify category data passed correctly |

---

## Testing Checklist

- [ ] Create category without image
- [ ] Create category with image
- [ ] Edit category - change image
- [ ] Edit category - remove image
- [ ] View images in list
- [ ] File size validation works
- [ ] Duplicate name validation works
- [ ] Duplicate slug validation works
- [ ] Modal opens/closes correctly
- [ ] Images persist after refresh
- [ ] Responsive design on mobile
- [ ] Error messages display correctly

---

## Related Features

- **Products**: Also use ImgBB for image uploads
- **Chat System**: Socket.IO real-time messaging
- **Auth System**: User authentication and roles
- **Orders**: Purchase tracking and management

---

**For detailed documentation**, see:
- `CATEGORY_IMAGE_UPLOAD.md` - Full feature documentation
- `TESTING_GUIDE.md` - Comprehensive test cases
- `IMPLEMENTATION_SUMMARY.md` - Technical overview

**Questions or Issues?**
Check the documentation files or inspect browser console for detailed error messages.
