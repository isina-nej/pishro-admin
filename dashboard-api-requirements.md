# Dashboard API Requirements

## خلاصه
صفحه داشبورد یک صفحه اصلی است که آمار کلی سیستم آموزشی را نمایش می‌دهد. این صفحه شامل کارت‌های آماری، نمودارهای تحلیلی، و جداول اطلاعاتی است.

## کامپوننت‌های نمایشی فعلی

### 1. کارت‌های آماری (DataStats)
- **کل بازدیدها**: تعداد کل بازدید سایت
- **درآمد کل**: مجموع درآمد حاصل از فروش دوره‌ها
- **کل سفارشات**: تعداد کل سفارشات ثبت شده
- **کل کاربران**: تعداد کاربران ثبت نام شده

### 2. نمودار پرداخت‌ها (ChartOne)
- نمودار خطی ماهانه (12 ماه)
- مبلغ دریافتی و مبلغ معوق

### 3. نمودار سود هفتگی (ChartTwo)
- نمودار میله‌ای هفتگی (7 روز)
- فروش و درآمد روزانه

### 4. نمودار دستگاه‌های استفاده شده (ChartThree)
- نمودار دونات
- توزیع بازدیدکنندگان بر اساس نوع دستگاه (دسکتاپ، موبایل، تبلت)

---

## API های مورد نیاز

لطفاً API های زیر را برای صفحه داشبورد پیاده‌سازی کنید:

### 1. دریافت آمار کلی
```
GET /api/dashboard/stats
```

**Response Type:**
```typescript
{
  totalViews: {
    value: number;        // مثال: 3456
    growthRate: number;   // درصد رشد (مثبت یا منفی) - مثال: 0.43
  };
  totalRevenue: {
    value: number;        // مبلغ به تومان - مثال: 42200000
    growthRate: number;   // درصد رشد
  };
  totalOrders: {
    value: number;        // تعداد سفارشات - مثال: 2450
    growthRate: number;   // درصد رشد
  };
  totalUsers: {
    value: number;        // تعداد کاربران - مثال: 3465
    growthRate: number;   // درصد رشد
  };
}
```

**نکته**: growthRate مقدار اعشاری است (0.43 = 43%)

---

### 2. دریافت آمار پرداخت‌های ماهانه
```
GET /api/dashboard/payments/monthly
Query Parameters:
  - period: 'monthly' | 'yearly' (optional, default: 'monthly')
```

**Response Type:**
```typescript
{
  months: string[];           // نام ماه‌ها - مثال: ["فروردین", "اردیبهشت", ...]
  receivedAmount: number[];   // مبلغ دریافتی هر ماه - مثال: [0, 20000, 35000, ...]
  dueAmount: number[];        // مبلغ معوق هر ماه - مثال: [15000, 9000, 17000, ...]
  totalReceived: number;      // مجموع مبلغ دریافتی
  totalDue: number;           // مجموع مبلغ معوق
}
```

---

### 3. دریافت آمار سود هفتگی
```
GET /api/dashboard/profit/weekly
Query Parameters:
  - period: 'this_week' | 'last_week' (optional, default: 'this_week')
```

**Response Type:**
```typescript
{
  days: string[];         // نام روزها - مثال: ["شنبه", "یکشنبه", ...]
  sales: number[];        // مبلغ فروش روزانه - مثال: [44000, 55000, ...]
  revenue: number[];      // درآمد خالص روزانه - مثال: [13000, 23000, ...]
}
```

---

### 4. دریافت آمار دستگاه‌های بازدیدکنندگان
```
GET /api/dashboard/devices
Query Parameters:
  - period: 'monthly' | 'yearly' (optional, default: 'monthly')
```

**Response Type:**
```typescript
{
  desktop: number;    // درصد دسکتاپ - مثال: 65
  tablet: number;     // درصد تبلت - مثال: 34
  mobile: number;     // درصد موبایل - مثال: 45
  unknown: number;    // درصد نامشخص - مثال: 12
  totalVisitors: number; // تعداد کل بازدیدکنندگان
}
```

**نکته**: مقادیر به صورت درصد (0-100) هستند و مجموع آن‌ها باید 100 باشد.

---

## یادآوری‌های مهم برای Backend

1. **احراز هویت**: تمام این endpoint ها باید فقط برای ادمین‌ها قابل دسترسی باشند
2. **کش**: توصیه می‌شود آمارها را با TTL مناسب (مثلاً 5 دقیقه) کش کنید
3. **فرمت اعداد**:
   - درآمدها به تومان
   - growthRate به صورت اعشار (0.43 نه 43)
   - درصدها به صورت عدد صحیح (65 نه 0.65)
4. **تاریخ**: از تقویم شمسی استفاده شود
5. **خطاها**: از status code های استاندارد HTTP استفاده کنید:
   - 200: موفق
   - 401: عدم احراز هویت
   - 403: عدم دسترسی (غیر ادمین)
   - 500: خطای سرور

---

## TypeScript Types (برای مرجع)

```typescript
// Stats Card Data
interface DashboardStats {
  totalViews: StatItem;
  totalRevenue: StatItem;
  totalOrders: StatItem;
  totalUsers: StatItem;
}

interface StatItem {
  value: number;
  growthRate: number; // decimal format: 0.43 = 43%
}

// Payments Chart Data
interface PaymentsData {
  months: string[];
  receivedAmount: number[];
  dueAmount: number[];
  totalReceived: number;
  totalDue: number;
}

// Profit Chart Data
interface ProfitData {
  days: string[];
  sales: number[];
  revenue: number[];
}

// Devices Chart Data
interface DevicesData {
  desktop: number;
  tablet: number;
  mobile: number;
  unknown: number;
  totalVisitors: number;
}
```

---

## مثال Curl برای تست

```bash
# دریافت آمار کلی
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/dashboard/stats

# دریافت آمار پرداخت‌ها
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/dashboard/payments/monthly?period=monthly

# دریافت آمار سود
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/dashboard/profit/weekly?period=this_week

# دریافت آمار دستگاه‌ها
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/dashboard/devices?period=monthly
```
