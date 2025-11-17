# لیست صفحات CMS و ساید‌بار

> این فایل شامل لیست کامل صفحاتی است که باید در پنل مدیریت CMS پیاده‌سازی شوند.

## 1. مدیریت محتوا (Content Management)

### 1.1 برچسب‌ها (Tags)
- **مسیر:** `/admin/tags`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** published, search, pagination
- **API Base:** `/api/admin/tags`

### 1.2 دسته‌بندی‌ها (Categories)
- **مسیر:** `/admin/categories`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** published, search, pagination
- **API Base:** `/api/admin/categories`

### 1.3 محتوای صفحات (Page Content)
- **مسیر:** `/admin/page-content`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** published, search, pagination
- **API Base:** `/api/admin/page-content`

### 1.4 صفحه درباره ما (About Page)
- **مسیر:** `/admin/about-page`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/about-page`

### 1.5 صفحه اصلی (Home Landing)
- **مسیر:** `/admin/home-landing`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/home-landing`

---

## 2. دوره‌ها و آموزش (Courses & Learning)

### 2.1 دوره‌ها (Courses)
- **مسیر:** `/admin/courses`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** categoryId, published, featured, status, level, pagination
- **API Base:** `/api/admin/courses`

### 2.2 درس‌ها (Lessons)
- **مسیر:** `/admin/lessons`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** courseId, published, pagination
- **API Base:** `/api/admin/lessons`

### 2.3 ثبت‌نام‌ها (Enrollments)
- **مسیر:** `/admin/enrollments`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** userId, courseId, status, pagination
- **API Base:** `/api/admin/enrollments`

### 2.4 کلاس‌های آنلاین (Skyroom Classes)
- **مسیر:** `/admin/skyroom-classes`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** published
- **API Base:** `/api/admin/skyroom-classes`

---

## 3. آزمون‌ها (Quizzes & Assessment)

### 3.1 آزمون‌ها (Quizzes)
- **مسیر:** `/admin/quizzes`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** courseId, published, pagination
- **API Base:** `/api/admin/quizzes`

### 3.2 سوالات آزمون (Quiz Questions)
- **مسیر:** `/admin/quiz-questions`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** quizId, pagination
- **API Base:** `/api/admin/quiz-questions`

### 3.3 تلاش‌های آزمون (Quiz Attempts)
- **مسیر:** `/admin/quiz-attempts`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** userId, quizId, pagination
- **API Base:** `/api/admin/quiz-attempts`

---

## 4. منابع و محتوا (Content & Resources)

### 4.1 کتاب‌ها (Books)
- **مسیر:** `/admin/books`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** published, featured, search, pagination
- **API Base:** `/api/admin/books`

### 4.2 گواهینامه‌ها (Certificates)
- **مسیر:** `/admin/certificates`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** userId, courseId, pagination
- **API Base:** `/api/admin/certificates`

---

## 5. اخبار و نظرات (News & Comments)

### 5.1 اخبار (News)
- **مسیر:** `/admin/news`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** categoryId, published, featured, search, pagination
- **API Base:** `/api/admin/news`

### 5.2 نظرات دوره‌ها (Comments)
- **مسیر:** `/admin/comments`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** courseId, userId, approved, pagination
- **API Base:** `/api/admin/comments`

### 5.3 نظرات اخبار (News Comments)
- **مسیر:** `/admin/news-comments`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** newsId, userId, approved, pagination
- **API Base:** `/api/admin/news-comments`

---

## 6. سرمایه‌گذاری و کسب‌وکار (Investment & Business)

### 6.1 طرح‌های سرمایه‌گذاری (Investment Plans)
- **مسیر:** `/admin/investment-plans`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** published, pagination
- **API Base:** `/api/admin/investment-plans`

### 6.2 آیتم‌های طرح سرمایه‌گذاری (Investment Plan Items)
- **مسیر:** `/admin/investment-plan-items`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/investment-plan-items`

### 6.3 برچسب‌های سرمایه‌گذاری (Investment Tags)
- **مسیر:** `/admin/investment-tags`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/investment-tags`

### 6.4 مشاوره کسب‌وکار (Business Consulting)
- **مسیر:** `/admin/business-consulting`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/business-consulting`

---

## 7. کاربران و تیم (Users & Team)

### 7.1 کاربران (Users)
- **مسیر:** `/admin/users`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** role, phoneVerified, search, pagination
- **API Base:** `/api/admin/users`

### 7.2 اعضای تیم (Team Members)
- **مسیر:** `/admin/team-members`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/team-members`

---

## 8. سفارشات و تراکنش‌ها (Orders & Transactions)

### 8.1 سفارشات (Orders)
- **مسیر:** `/admin/orders`
- **عملیات:** لیست، مشاهده جزئیات، ویرایش
- **فیلترها:** userId, status, startDate, endDate, pagination
- **API Base:** `/api/admin/orders`

### 8.2 تراکنش‌ها (Transactions)
- **مسیر:** `/admin/transactions`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **فیلترها:** userId, orderId, status, pagination
- **API Base:** `/api/admin/transactions`

---

## 9. ارتباطات (Communication)

### 9.1 مشترکین خبرنامه (Newsletter Subscribers)
- **مسیر:** `/admin/newsletter-subscribers`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو، ارسال پیامک گروهی
- **فیلترها:** active, search, pagination
- **API Base:** `/api/admin/newsletter-subscribers`
- **ویژگی خاص:** ارسال پیامک گروهی (Broadcast SMS)

### 9.2 سوالات متداول (FAQs)
- **مسیر:** `/admin/faqs`
- **عملیات:** لیست، ایجاد، ویرایش، حذف، جستجو
- **فیلترها:** published, search, pagination
- **API Base:** `/api/admin/faqs`

---

## 10. داشبورد و تحلیل (Dashboard & Analytics)

### 10.1 داشبورد اصلی (Main Dashboard)
- **مسیر:** `/admin/dashboard` یا `/admin`
- **نمایش:** آمار کلی سیستم
- **API:** `/api/admin/dashboard/stats`

### 10.2 آمار دستگاه‌ها (Device Stats)
- **مسیر:** `/admin/dashboard/devices`
- **نمایش:** آمار دستگاه‌های کاربران (ماهانه/سالانه)
- **API:** `/api/admin/dashboard/devices`

### 10.3 پرداخت‌های ماهانه (Monthly Payments)
- **مسیر:** `/admin/dashboard/payments`
- **نمایش:** آمار پرداخت‌های ماهانه
- **API:** `/api/admin/dashboard/payments/monthly`

### 10.4 سود هفتگی (Weekly Profit)
- **مسیر:** `/admin/dashboard/profit`
- **نمایش:** آمار سود هفتگی
- **API:** `/api/admin/dashboard/profit/weekly`

---

## 11. ابزارها و رابط کاربری (UI & Utilities)

### 11.1 مراحل اسکرولر موبایل (Mobile Scroller Steps)
- **مسیر:** `/admin/mobile-scroller-steps`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/mobile-scroller-steps`

### 11.2 آیتم‌های رزومه (Resume Items)
- **مسیر:** `/admin/resume-items`
- **عملیات:** لیست، ایجاد، ویرایش، حذف
- **API Base:** `/api/admin/resume-items`

---

## 12. نگهداری و ابزارها (Maintenance & Tools)

### 12.1 بازخوانی کش (Revalidate Cache)
- **مسیر:** `/admin/tools/revalidate`
- **عملیات:** بازخوانی دستی کش ISR
- **API:** `/api/admin/revalidate`

### 12.2 تصحیح UpdatedAt (Fix UpdatedAt)
- **مسیر:** `/admin/tools/fix-updated-at`
- **عملیات:** تصحیح فیلد updatedAt رکوردها
- **API:** `/api/admin/fix-updatedAt`

### 12.3 ایجاد داده‌های تستی آزمون (Seed Quizzes)
- **مسیر:** `/admin/tools/seed-quizzes`
- **عملیات:** ایجاد داده‌های تستی برای آزمون‌ها
- **API:** `/api/admin/seed/quizzes`

---

## ساختار پیشنهادی ساید‌بار

```
📊 داشبورد
   └─ آمار کلی (/admin/dashboard)
   └─ آمار دستگاه‌ها (/admin/dashboard/devices)
   └─ پرداخت‌های ماهانه (/admin/dashboard/payments)
   └─ سود هفتگی (/admin/dashboard/profit)

📝 مدیریت محتوا
   ├─ برچسب‌ها (/admin/tags)
   ├─ دسته‌بندی‌ها (/admin/categories)
   ├─ محتوای صفحات (/admin/page-content)
   ├─ صفحه درباره ما (/admin/about-page)
   └─ صفحه اصلی (/admin/home-landing)

🎓 دوره‌ها و آموزش
   ├─ دوره‌ها (/admin/courses)
   ├─ درس‌ها (/admin/lessons)
   ├─ ثبت‌نام‌ها (/admin/enrollments)
   └─ کلاس‌های آنلاین (/admin/skyroom-classes)

📋 آزمون‌ها
   ├─ آزمون‌ها (/admin/quizzes)
   ├─ سوالات (/admin/quiz-questions)
   └─ تلاش‌های آزمون (/admin/quiz-attempts)

📚 منابع و محتوا
   ├─ کتاب‌ها (/admin/books)
   └─ گواهینامه‌ها (/admin/certificates)

📰 اخبار و نظرات
   ├─ اخبار (/admin/news)
   ├─ نظرات دوره‌ها (/admin/comments)
   └─ نظرات اخبار (/admin/news-comments)

💰 سرمایه‌گذاری و کسب‌وکار
   ├─ طرح‌های سرمایه‌گذاری (/admin/investment-plans)
   ├─ آیتم‌های طرح (/admin/investment-plan-items)
   ├─ برچسب‌های سرمایه‌گذاری (/admin/investment-tags)
   └─ مشاوره کسب‌وکار (/admin/business-consulting)

👥 کاربران و تیم
   ├─ کاربران (/admin/users)
   └─ اعضای تیم (/admin/team-members)

🛒 سفارشات و تراکنش‌ها
   ├─ سفارشات (/admin/orders)
   └─ تراکنش‌ها (/admin/transactions)

📧 ارتباطات
   ├─ مشترکین خبرنامه (/admin/newsletter-subscribers)
   └─ سوالات متداول (/admin/faqs)

🎨 ابزارها و رابط کاربری
   ├─ مراحل اسکرولر موبایل (/admin/mobile-scroller-steps)
   └─ آیتم‌های رزومه (/admin/resume-items)

🔧 نگهداری و ابزارها
   ├─ بازخوانی کش (/admin/tools/revalidate)
   ├─ تصحیح UpdatedAt (/admin/tools/fix-updated-at)
   └─ ایجاد داده‌های تستی (/admin/tools/seed-quizzes)
```

---

## خلاصه آمار

- **تعداد کل صفحات:** 42 صفحه
- **تعداد بخش‌های اصلی:** 12 بخش
- **تعداد کل APIها:** 65+ endpoint
- **صفحاتی که نیاز به CRUD کامل دارند:** 35 صفحه
- **صفحات نمایش آمار/گزارش:** 7 صفحه

---

## نکات پیاده‌سازی

1. **احراز هویت:** همه صفحات نیاز به لاگین و نقش ADMIN دارند
2. **صفحه‌بندی:** اکثر لیست‌ها نیاز به pagination دارند (page, limit)
3. **جستجو:** بسیاری از صفحات نیاز به قابلیت جستجو دارند
4. **فیلتر:** هر صفحه فیلترهای خاص خود را دارد
5. **عملیات CRUD:** اکثر صفحات نیاز به Create, Read, Update, Delete دارند
6. **کش:** برخی APIها (مانند dashboard) کش دارند
7. **Validation:** هر فرم نیاز به اعتبارسنجی مطابق با API docs دارد

---

**تاریخ ایجاد:** 2025-11-17
**بر اساس:** ADMIN_APIS.md نسخه 1.0.1
