# PDF Upload Configuration - پیشرو ادمین

## موقعیت فولدر آپلود
- **مسیر سرور:** `/opt/pishro-admin/public/uploads/pdfs`
- **مسیر public:** `/uploads/pdfs`
- **مسیر Temp:** `/opt/pishro-admin/public/uploads/temp`

## مشخصات API

### Endpoint
```
POST /api/uploads/pdf
```

### محدودیت‌ها
- **حجم فایل:** حداکثر 50 MB
- **نوع فایل:** فقط PDF
- **مجوز:** صحت‌سنجی کاربر (اختیاری)

### Response موفق
```json
{
  "success": true,
  "fileName": "1702472410123-abc123-document.pdf",
  "originalName": "document.pdf",
  "url": "/uploads/pdfs/1702472410123-abc123-document.pdf",
  "size": 102400,
  "uploadedAt": "2024-12-13T03:50:10.000Z"
}
```

### Response خطا
```json
{
  "error": "پیام خطا"
}
```

## تست با Curl

```bash
# تست آپلود فایل
curl -X POST http://localhost:3000/api/uploads/pdf \
  -F "file=@./test.pdf"

# برای سرور
curl -X POST https://pishro-admin.example.com/api/uploads/pdf \
  -F "file=@./test.pdf"
```

## تست با JavaScript/React

```javascript
async function uploadPDF(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/uploads/pdf', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('آپلود موفق:', data.url);
    } else {
      console.error('خطا:', data.error);
    }
  } catch (error) {
    console.error('خطا در آپلود:', error);
  }
}
```

## مجوزها

سرور تنظیم شد:
- مالک: `www-data`
- مجوز: `755` (خواندن و نوشتن برای www-data)

## نظافت خودکار

فایل‌های موقت بیشتر از 7 روز پاک می‌شوند:

```bash
find /opt/pishro-admin/public/uploads/temp -type f -mtime +7 -delete
```

می‌توانی این را به cron job اضافه کنی:
```bash
0 2 * * * find /opt/pishro-admin/public/uploads/temp -type f -mtime +7 -delete
```

## وضعیت کنونی

✅ فولدر ایجاد شد
✅ مجوزها تنظیم شدند  
✅ تست نوشتن/خواندن موفق بود
✅ API endpoint آماده است
