# Upload Error Fix - Network Error Resolution

## Problem
Users were experiencing "Network error - no response received" when attempting to upload book covers, PDFs, and audio files in the admin panel at `admin.pishrosarmaye.com`.

### Error Details
```
Network error - no response received
Upload error: {status: 'error', message: 'Network error. Please check your connection.', code: 'NETWORK_ERROR'}
```

## Root Causes

### 1. Incorrect Environment Variable (PRIMARY ISSUE)
The `.env` file had:
```
NEXT_PUBLIC_FILE_UPLOAD_URL="http://localhost:3000"
```

This was pointing to a local development server instead of the production pishro2 server. When deployed to production (`admin.pishrosarmaye.com`), this localhost URL was inaccessible, causing XMLHttpRequest to fail with "no response received".

### 2. Missing Error Context
The upload services (cover, PDF, audio) had minimal error logging and no timeout handling, making it difficult to diagnose what went wrong.

### 3. No Request Error Validation
The services didn't validate if the URL was correctly formed or accessible before attempting to send the file.

## Solutions Implemented

### 1. Fixed Environment Variable ✅
**File:** `.env`

Changed:
```
NEXT_PUBLIC_FILE_UPLOAD_URL="http://localhost:3000"
```

To:
```
NEXT_PUBLIC_FILE_UPLOAD_URL="https://www.pishrosarmaye.com"
```

This now correctly points to the pishro2 server where the upload endpoints exist at:
- `POST https://www.pishrosarmaye.com/api/admin/books/upload-cover`
- `POST https://www.pishrosarmaye.com/api/admin/books/upload-pdf`
- `POST https://www.pishrosarmaye.com/api/admin/books/upload-audio`

### 2. Enhanced Error Handling
**Files Updated:**
- `src/lib/services/book-cover-service.ts`
- `src/lib/services/book-pdf-service.ts`
- `src/lib/services/book-audio-service.ts`

**Improvements:**
- Added timeout handling (60-120 seconds based on file type)
- Better error messages in Persian
- Logs the URL being attempted for debugging
- Try-catch wrapper around XMLHttpRequest.open()
- Console logging for network errors

**New Error Messages:**
```typescript
// Timeout
"مهلت زمانی آپلود به پایان رسید. لطفاً دوباره تلاش کنید"

// Network issues
"خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید"

// Invalid URL
"نتوانست درخواست را ارسال کند. آدرس سرور غلط است"

// Server errors
"خطا در آپلود فایل کاور (کد خطا: {status})"
```

## Verification Checklist

After deployment, verify:

- [ ] Environment variable is set: `NEXT_PUBLIC_FILE_UPLOAD_URL="https://www.pishrosarmaye.com"`
- [ ] Pishro2 server is running and accessible
- [ ] CORS headers are properly configured (they are: `Access-Control-Allow-Origin: *`)
- [ ] Upload endpoints respond to POST requests at:
  - `https://www.pishrosarmaye.com/api/admin/books/upload-cover`
  - `https://www.pishrosarmaye.com/api/admin/books/upload-pdf`
  - `https://www.pishrosarmaye.com/api/admin/books/upload-audio`
- [ ] No firewall/reverse proxy blocking requests between admin and main server
- [ ] File permissions allow writing to upload directories

## Testing

### Manual Test
```bash
# Test endpoint accessibility
curl -X OPTIONS https://www.pishrosarmaye.com/api/admin/books/upload-cover

# Should return 200 with CORS headers
```

### Browser Console
When uploading, you should see more descriptive errors if something fails:
```javascript
// Network logs in Console tab will show:
POST https://www.pishrosarmaye.com/api/admin/books/upload-cover
Status: 200 (on success)
```

## Environment Configuration

### Development
```
NEXT_PUBLIC_FILE_UPLOAD_URL="http://localhost:3001"  # local pishro2
```

### Production
```
NEXT_PUBLIC_FILE_UPLOAD_URL="https://www.pishrosarmaye.com"  # production pishro2
```

### Fallback
If the environment variable is not set, the services default to `http://localhost:3001`.

## Common Issues

### Issue: Still getting network errors after fix
**Solution:** Check if pishro2 server is running on the specified URL:
```bash
# Test connectivity
curl -I https://www.pishrosarmaye.com/api/admin/books/upload-cover

# Should return 405 (Method Not Allowed) or 200 (Preflight), not connection refused
```

### Issue: CORS errors
**Solution:** The pishro2 endpoints already have CORS headers, but if you see CORS errors:
1. Verify the endpoint includes `OPTIONS` method handler (it does)
2. Check browser console for specific header issues
3. Verify request origin matches allowed origins

### Issue: File uploads work locally but not in production
**Solution:** Verify `.env` file is properly configured before deployment. Docker or CI/CD environments may need explicit env variable passing.

## Files Modified

1. `.env` - Fixed NEXT_PUBLIC_FILE_UPLOAD_URL
2. `src/lib/services/book-cover-service.ts` - Enhanced error handling
3. `src/lib/services/book-pdf-service.ts` - Enhanced error handling
4. `src/lib/services/book-audio-service.ts` - Enhanced error handling

## References

- pishro2 upload endpoints: `/app/api/admin/books/upload-*/route.ts`
- pishro-admin2 services: `/src/lib/services/book-*-service.ts`
- Consumer component: `src/components/Books/BookForm.tsx`
