# Reviews Troubleshooting Guide

## Problem: Reviews not appearing after creation

### Symptoms
- Review is created successfully (200 OK response)
- Review doesn't appear in "Written Reviews" page
- Order still shows as "not reviewed" in "To Write" page
- Seller shows no reviews

### Common Causes & Solutions

#### 1. **Next.js Cache Not Cleared**
The most common issue. Next.js aggressively caches pages.

**Solution:**
- Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear browser cache
- Restart the Next.js development server
- Navigate away and back to the reviews page

#### 2. **Array vs Object in Request**
The API expects a single review object, not an array.

**Fixed in:** `/storefront/src/lib/data/reviews.ts`
- Added check to unwrap array if accidentally sent
- Logs added to debug request/response

#### 3. **Missing customer_id**
Reviews need to be associated with an authenticated customer.

**Check:**
- User is logged in
- Auth headers are being sent
- Customer ID is valid

**Debug:**
```typescript
// In ReviewForm.tsx - check console logs:
console.log("Submitting review:", body)
console.log("Review response:", response)
```

#### 4. **Query Not Including Reviews**
Orders query might not be fetching the reviews relationship.

**Current query includes:** `*reviews` in fields

**Check in:** `/storefront/src/lib/data/orders.ts`

```typescript
fields: "*items,+items.metadata,*items.variant,*items.product,*seller,*reviews,*order_set,shipping_total,total,created_at"
```

#### 5. **Review Module Not Properly Configured**
The `@mercurjs/reviews` module might not be configured correctly.

**Check:**
- `/backend/medusa-config.ts` includes `@mercurjs/reviews` plugin
- Backend has been restarted after adding the module
- Database migrations have run

### Testing Reviews

1. **Create a test review:**
```bash
# Check browser console for logs
# You should see:
# "Submitting review: { order_id: ..., rating: 5, ... }"
# "Review response: { review: { id: ..., ... } }"
```

2. **Verify in database:**
```sql
SELECT * FROM review WHERE reference = 'seller';
```

3. **Check API directly:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:9000/store/reviews
```

### Expected Flow

1. **User submits review** → Creates review in database
2. **Revalidation triggered** → Clears Next.js cache
3. **Page refresh** → Fetches updated data with new review
4. **Order shows review** → `order.reviews.length > 0`
5. **Review appears in "Written"** → Listed in reviews page

### Debug Checklist

- [ ] Check browser console for errors
- [ ] Verify review is created (check database or API)
- [ ] Hard refresh the page
- [ ] Check that `order.reviews` includes the new review
- [ ] Verify customer_id matches logged-in user
- [ ] Check backend logs for errors
- [ ] Ensure `@mercurjs/reviews` is in package.json and installed
- [ ] Verify orders query includes `*reviews` field

### Files Modified for Fix

- `/storefront/src/lib/data/reviews.ts` - Added array unwrap and better revalidation
- `/storefront/src/components/molecules/ReviewForm/ReviewForm.tsx` - Added debug logs

### Additional Notes

- Reviews are tied to orders via `order_id`
- Each order can have multiple reviews (one per seller if multiple sellers)
- The `reference` field determines what is being reviewed (seller, product, etc.)
- `reference_id` should be the seller's ID for seller reviews

### Still Not Working?

1. Check backend logs for API errors
2. Verify the review was actually created in the database
3. Check if the order query is returning the reviews
4. Try creating a review via API directly (Postman/curl)
5. Check if there are any CORS or authentication issues
