# Testing Guide for Category Image Upload

## Prerequisites
- Application running locally (localhost:3000)
- Admin dashboard access
- ImgBB API key configured in `.env.local`

## Test Case 1: Add Category Without Image
**Expected**: Category created and displayed in list without image placeholder

Steps:
1. Go to `/auth/dashboard/add-category`
2. Enter:
   - Name: "Electronics"
   - Slug: "electronics"
   - Description: "Electronic items"
3. Skip image upload
4. Click "Create Category"
5. Verify success toast appears
6. Navigate to `/auth/dashboard/categories`
7. Verify "Electronics" appears with "No Image" placeholder

---

## Test Case 2: Add Category With Image
**Expected**: Category created with image displayed in list

Steps:
1. Go to `/auth/dashboard/add-category`
2. Enter:
   - Name: "Fashion"
   - Slug: "fashion"
   - Description: "Fashion products"
3. Click image upload area
4. Select a small image file (<5MB)
5. Verify image preview displays
6. Click "Create Category"
7. Wait for image upload to complete
8. Verify success toast
9. Navigate to `/auth/dashboard/categories`
10. Verify image displays in "Fashion" row

---

## Test Case 3: Edit Category - Change Image
**Expected**: Category image updated successfully

Steps:
1. Go to `/auth/dashboard/categories`
2. Find category with image
3. Click "Edit" button
4. Verify form pre-filled with current data
5. Click "Remove Image" button
6. Verify preview cleared
7. Upload a different image
8. Verify new preview shows
9. Click "Update Category"
10. Modal closes
11. Verify table shows updated image

---

## Test Case 4: Edit Category - Add Image to Existing
**Expected**: Image added to category that previously had none

Steps:
1. Go to `/auth/dashboard/categories`
2. Find category without image (showing "No Image" placeholder)
3. Click "Edit" button
4. Upload an image
5. Click "Update Category"
6. Verify image now displays in table

---

## Test Case 5: Edit Category - Remove Image
**Expected**: Image removed from category

Steps:
1. Go to `/auth/dashboard/categories`
2. Find category with image
3. Click "Edit" button
4. Click "Remove Image" button
5. Verify preview cleared and "No Image" shows
6. Click "Update Category"
7. Navigate to `/auth/dashboard/categories`
8. Verify "No Image" placeholder now shows for that category

---

## Test Case 6: File Size Validation
**Expected**: Error toast for files >5MB

Steps:
1. Go to `/auth/dashboard/add-category`
2. Try uploading image >5MB
3. Verify error toast: "Image size exceeds 5MB limit"
4. Verify form state unchanged

---

## Test Case 7: Duplicate Name Validation
**Expected**: Error preventing duplicate category names

Steps:
1. Go to `/auth/dashboard/categories`
2. Note an existing category name (e.g., "Electronics")
3. Go to `/auth/dashboard/add-category`
4. Enter:
   - Name: "Electronics" (same as existing)
   - Slug: "electronics-new"
   - Description: "Test"
5. Click "Create Category"
6. Verify error toast: 'Category "Electronics" already exists'

---

## Test Case 8: Duplicate Slug Validation
**Expected**: Error preventing duplicate category slugs

Steps:
1. Go to `/auth/dashboard/categories`
2. Note an existing category slug (e.g., "electronics")
3. Go to `/auth/dashboard/add-category`
4. Enter:
   - Name: "Electronics New"
   - Slug: "electronics" (same as existing)
   - Description: "Test"
5. Click "Create Category"
6. Verify error toast: 'Slug "electronics" is already in use'

---

## Test Case 9: Edit Modal - Slug Validation Across Categories
**Expected**: Allow same category to keep its slug, prevent duplicates with others

Steps:
1. Go to `/auth/dashboard/categories`
2. Edit a category without changing slug
3. Click "Update Category"
4. Verify update succeeds (not prevented by slug validation)

---

## Test Case 10: Responsive Design on Mobile
**Expected**: UI elements properly sized and centered on small screens

Steps:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set viewport to iPhone 12 (390x844)
4. Test Steps 1-5 from Test Case 2
5. Verify:
   - Modal is readable on small screen
   - Buttons are clickable
   - Image preview is visible
   - No horizontal scrolling needed

---

## Test Case 11: Image Upload Loading State
**Expected**: Loading spinner during image upload to ImgBB

Steps:
1. Go to `/auth/dashboard/add-category`
2. Upload a large image file (but <5MB)
3. Click "Create Category"
4. Observe loading spinner and "Uploading..." text
5. Verify spinner disappears when upload completes

---

## Test Case 12: Network Error Handling
**Expected**: Error message if ImgBB API fails

Steps:
1. Go to Network tab in DevTools
2. Offline the browser (DevTools > Network > Offline)
3. Go to `/auth/dashboard/add-category`
4. Upload image and click "Create Category"
5. Verify error toast appears
6. Go back online
7. Refresh and try again
8. Verify it succeeds

---

## Verification Checklist

After completing all test cases, verify:

- [ ] All 12 test cases pass
- [ ] No console errors in DevTools
- [ ] Toast notifications appear correctly
- [ ] Images display without broken links
- [ ] Modal opens/closes smoothly
- [ ] Form validation messages are clear
- [ ] Loading states show properly
- [ ] Edit modal pre-fills with current data
- [ ] Images persist after page refresh
- [ ] Category list updates in real-time after edits

---

## Common Issues & Solutions

### Issue: "Image size exceeds 5MB limit" appears immediately
**Solution**: Check if file is actually under 5MB. Some images may report differently due to compression.

### Issue: Image uploads but doesn't display in table
**Solution**: Check browser console for errors. Verify ImgBB API key is configured.

### Issue: "No Image" placeholder appears for categories with images
**Solution**: Check if icon URL is valid. Test URL in browser directly to verify ImgBB returned valid link.

### Issue: Modal won't close after edit
**Solution**: Check browser console for JavaScript errors. Verify updateCategory function returned successfully.

### Issue: Old image still shows after upload
**Solution**: Hard refresh browser (Ctrl+Shift+R). Check if browser cache is preventing image reload.
