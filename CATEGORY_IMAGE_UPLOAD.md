# Category Image Upload Feature Documentation

## Overview
This document outlines the implementation of image upload functionality for the category management system in the Comet E-commerce platform.

## Feature Description
Users can now upload, view, and update category images through:
1. **Add Category Page** - Create new categories with optional images
2. **Edit Category Modal** - Update existing categories and change/remove images
3. **Categories List** - View all categories with their respective images

## Implementation Details

### Database Model
- **File**: `models/category-models.js`
- **Field**: `icon` (String type) - Stores image URLs from ImgBB
- **Status**: Already present in schema, no changes needed

### Database Queries
- **File**: `database/queries/index.js`

#### Updated Functions:
1. **`addCategory(categoryData)`**
   - Now accepts and stores `icon` field
   - Validates required fields (name, slug)
   - Checks for duplicate names/slugs
   - Returns created category with all fields including icon

2. **`updateCategory(id, categoryData)`** (NEW)
   - Updates category by ID
   - Accepts: name, slug, description, icon
   - Validates for duplicate names/slugs (excluding current category)
   - Returns updated category with all fields
   - Uses MongoDB `$ne` operator to exclude current ID from uniqueness check

3. **`getCategories()`**
   - Updated to return icon field in category data
   - Returns array of categories with: id, name, slug, icon, description, createdAt

### Frontend Components

#### Add Category Page
- **File**: `app/(admin)/auth/dashboard/add-category/page.js`
- Features:
  - Image upload with drag-and-drop visual
  - ImgBB API integration for hosting
  - Image preview with remove button
  - 5MB file size validation
  - Form validation (name, slug required)
  - Success/error toast notifications

#### Edit Category Modal
- **File**: `app/(admin)/auth/dashboard/categories/EditCategoryModal.jsx`
- Features:
  - Modal dialog for editing category details
  - Image upload/change/remove functionality
  - Same ImgBB integration as add form
  - Form validation and error handling
  - Loading states during submission and upload
  - Responsive design with Tailwind CSS

#### Categories List Page
- **File**: `app/(admin)/auth/dashboard/categories/page.js`
- Features:
  - Displays all categories in table format
  - Shows category image in first column
  - Image fallback for categories without images
  - Edit button opens EditCategoryModal
  - Delete button with confirmation
  - Loading and error states
  - Success/error notifications

### Image Hosting
- **Service**: ImgBB API
- **Environment Variable**: `NEXT_PUBLIC_imageBB_key`
- **Endpoint**: `https://api.imgbb.com/1/upload`
- **Max File Size**: 5MB
- **Response**: Returns image URL stored in `data.data.url`

## Workflow

### Adding a Category with Image
1. Navigate to `/auth/dashboard/add-category`
2. Fill in category name, slug, and description
3. Click image upload area to select or drag image
4. Preview displays before submission
5. Click "Create Category" button
6. Image uploads to ImgBB, URL stored in database
7. Success notification displays

### Editing a Category
1. Navigate to `/auth/dashboard/categories`
2. Click "Edit" button on any category row
3. Modal opens with current category data
4. Update fields as needed
5. Upload new image or remove existing one
6. Click "Update Category"
7. Changes saved to database
8. Modal closes and table updates

### Viewing Categories
1. Navigate to `/auth/dashboard/categories`
2. Table displays all categories
3. Images shown in first column (or "No Image" placeholder)
4. View, edit, or delete categories from action buttons

## Error Handling

### Validation Errors
- Required fields validation (name, slug)
- Duplicate name/slug detection
- Image file size validation (max 5MB)
- File type validation (images only)

### API/Upload Errors
- ImgBB upload failures
- Database update/create failures
- Connection errors

### User Feedback
- Toast notifications for success/error
- Loading spinners during operations
- Disabled buttons during submission
- Error messages displayed in modals

## File Structure
```
app/(admin)/auth/dashboard/
├── add-category/
│   └── page.js              (Add new category with image)
├── categories/
│   ├── page.js              (List all categories)
│   └── EditCategoryModal.jsx (Edit category modal)
database/
└── queries/
    └── index.js             (Database operations)
models/
└── category-models.js       (Schema definition)
```

## Technical Stack
- **Framework**: Next.js 16 with TypeScript support
- **Database**: MongoDB with Mongoose
- **Image Hosting**: ImgBB API
- **UI Library**: React 19 with Tailwind CSS
- **Notifications**: React Toastify
- **Image Component**: Next.js Image component with optimization

## Testing Checklist
- [ ] Add category without image
- [ ] Add category with image
- [ ] View category with image in list
- [ ] Edit category - change image
- [ ] Edit category - remove image
- [ ] Edit category - add image to existing category without image
- [ ] Verify duplicate name validation
- [ ] Verify duplicate slug validation
- [ ] Test image file size validation (5MB limit)
- [ ] Test file type validation (images only)
- [ ] Verify error handling for network failures
- [ ] Verify responsive design on mobile

## Future Enhancements
1. Image crop/resize functionality
2. Multiple image upload per category
3. Batch category import with images
4. Image optimization pipeline
5. Category image analytics
