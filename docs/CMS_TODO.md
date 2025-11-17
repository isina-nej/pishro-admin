# TODO: صفحات CMS که باید پیاده‌سازی شوند

> این فایل شامل لیست صفحاتی است که هنوز پیاده‌سازی نشده‌اند و باید به CMS اضافه شوند.

---

## ✅ صفحات پیاده‌سازی شده

### مدیریت محتوا

- [x] برچسب‌ها (Tags) - `/tags`
- [x] دسته‌بندی‌ها (Categories) - `/categories`
- [x] صفحه درباره ما (About Page) - `/about-page`
- [x] صفحه اصلی (Home Landing) - `/home-landing`

### دوره‌ها و آموزش

- [x] دوره‌ها (Courses) - `/courses`
- [x] ثبت‌نام‌ها (Enrollments) - `/enrollments`
- [x] کلاس‌های آنلاین (Skyroom Classes) - `/skyroom-classes`

### منابع و محتوا

- [x] کتاب‌ها (Books) - `/books`
- [x] گواهینامه‌ها (Certificates) - `/certificates`

### اخبار و نظرات

- [x] اخبار (News) - `/news`
- [x] نظرات دوره‌ها (Comments) - `/comments`

### سرمایه‌گذاری و کسب‌وکار

- [x] طرح‌های سرمایه‌گذاری (Investment Plans) - `/investment-plans`
- [x] آیتم‌های طرح سرمایه‌گذاری (Investment Plan Items) - `/investment-plan-items`
- [x] برچسب‌های سرمایه‌گذاری (Investment Tags) - `/investment-tags`
- [x] مشاوره کسب‌وکار (Business Consulting) - `/business-consulting`

### کاربران و تیم

- [x] کاربران (Users) - `/users`
- [x] اعضای تیم (Team Members) - `/team-members`

### سفارشات و تراکنش‌ها

- [x] سفارشات (Orders) - `/orders`

### ارتباطات

- [x] سوالات متداول (FAQs) - `/faqs`

### ابزارها و رابط کاربری

- [x] مراحل اسکرولر موبایل (Mobile Scroller Steps) - `/home-landing/scroller`
- [x] آیتم‌های رزومه (Resume Items) - `/resume-items`

---

## ❌ صفحات که باید پیاده‌سازی شوند

### 1. مدیریت محتوا (Content Management)

#### 1.1 محتوای صفحات (Page Content)

- [ ] **لیست محتوای صفحات** - `/page-content`

  - API: `GET /api/admin/page-content`
  - عملیات: لیست، جستجو، فیلتر (published)

- [ ] **ایجاد محتوای صفحه** - `/page-content/create`

  - API: `POST /api/admin/page-content`
  - فیلدها: title, slug, content, published

- [ ] **ویرایش محتوای صفحه** - `/page-content/edit/[id]`
  - API: `PATCH /api/admin/page-content/[id]`
  - عملیات: ویرایش، حذف

---

### 2. دوره‌ها و آموزش (Courses & Learning)

#### 2.1 درس‌ها (Lessons)

- [ ] **لیست درس‌ها** - `/lessons`

  - API: `GET /api/admin/lessons`
  - فیلترها: courseId, published, search

- [ ] **ایجاد درس** - `/lessons/create`

  - API: `POST /api/admin/lessons`
  - فیلدها: courseId, title, content, videoUrl, duration, order, published

- [ ] **ویرایش درس** - `/lessons/edit/[id]`

  - API: `PATCH /api/admin/lessons/[id]`

- [ ] **مشاهده جزئیات درس** - `/lessons/[id]`
  - API: `GET /api/admin/lessons/[id]`

---

### 3. آزمون‌ها (Quizzes & Assessment)

#### 3.1 آزمون‌ها (Quizzes)

- [ ] **لیست آزمون‌ها** - `/quizzes`

  - API: `GET /api/admin/quizzes`
  - فیلترها: courseId, published

- [ ] **ایجاد آزمون** - `/quizzes/create`

  - API: `POST /api/admin/quizzes`
  - فیلدها: courseId, title, description, passingScore, timeLimit, published

- [ ] **ویرایش آزمون** - `/quizzes/edit/[id]`

  - API: `PATCH /api/admin/quizzes/[id]`

- [ ] **مشاهده جزئیات آزمون** - `/quizzes/[id]`
  - API: `GET /api/admin/quizzes/[id]`

#### 3.2 سوالات آزمون (Quiz Questions)

- [ ] **لیست سوالات** - `/quiz-questions`

  - API: `GET /api/admin/quiz-questions`
  - فیلترها: quizId

- [ ] **ایجاد سوال** - `/quiz-questions/create`

  - API: `POST /api/admin/quiz-questions`
  - فیلدها: quizId, question, options[], correctAnswer, points

- [ ] **ویرایش سوال** - `/quiz-questions/edit/[id]`

  - API: `PATCH /api/admin/quiz-questions/[id]`

- [ ] **مشاهده جزئیات سوال** - `/quiz-questions/[id]`
  - API: `GET /api/admin/quiz-questions/[id]`

#### 3.3 تلاش‌های آزمون (Quiz Attempts)

- [ ] **لیست تلاش‌ها** - `/quiz-attempts`

  - API: `GET /api/admin/quiz-attempts`
  - فیلترها: userId, quizId

- [ ] **ایجاد تلاش** - `/quiz-attempts/create`

  - API: `POST /api/admin/quiz-attempts`

- [ ] **ویرایش تلاش** - `/quiz-attempts/edit/[id]`

  - API: `PATCH /api/admin/quiz-attempts/[id]`

- [ ] **مشاهده جزئیات تلاش** - `/quiz-attempts/[id]`
  - API: `GET /api/admin/quiz-attempts/[id]`

---

### 4. اخبار و نظرات (News & Comments)

#### 4.1 نظرات اخبار (News Comments)

- [ ] **لیست نظرات اخبار** - `/news-comments`

  - API: `GET /api/admin/news-comments`
  - فیلترها: newsId, userId, approved

- [ ] **ایجاد نظر خبر** - `/news-comments/create`

  - API: `POST /api/admin/news-comments`

- [ ] **ویرایش نظر خبر** - `/news-comments/edit/[id]`

  - API: `PATCH /api/admin/news-comments/[id]`

- [ ] **مشاهده جزئیات نظر** - `/news-comments/[id]`
  - API: `GET /api/admin/news-comments/[id]`

---

### 5. سفارشات و تراکنش‌ها (Orders & Transactions)

#### 5.1 تراکنش‌ها (Transactions)

- [ ] **لیست تراکنش‌ها** - `/transactions`

  - API: `GET /api/admin/transactions`
  - فیلترها: userId, orderId, status

- [ ] **ایجاد تراکنش** - `/transactions/create`

  - API: `POST /api/admin/transactions`

- [ ] **ویرایش تراکنش** - `/transactions/edit/[id]`

  - API: `PATCH /api/admin/transactions/[id]`

- [ ] **مشاهده جزئیات تراکنش** - `/transactions/[id]`
  - API: `GET /api/admin/transactions/[id]`

---

### 6. ارتباطات (Communication)

#### 6.1 مشترکین خبرنامه (Newsletter Subscribers)

- [ ] **لیست مشترکین خبرنامه** - `/newsletter-subscribers`

  - API: `GET /api/admin/newsletter-subscribers`
  - فیلترها: active, search

- [ ] **ایجاد مشترک** - `/newsletter-subscribers/create`

  - API: `POST /api/admin/newsletter-subscribers`

- [ ] **ویرایش مشترک** - `/newsletter-subscribers/edit/[id]`

  - API: `PATCH /api/admin/newsletter-subscribers/[id]`

- [ ] **مشاهده جزئیات مشترک** - `/newsletter-subscribers/[id]`

  - API: `GET /api/admin/newsletter-subscribers/[id]`

- [ ] **ارسال پیامک گروهی** - `/newsletter-subscribers/broadcast`
  - API: `POST /api/admin/newsletter-subscribers/broadcast-sms`
  - ویژگی: ارسال پیامک به تمام اعضای خبرنامه

---

### 7. داشبورد و تحلیل (Dashboard & Analytics)

#### 7.1 داشبورد اصلی

- [ ] **داشبورد آمار کلی** - بهبود `/` یا `/dashboard`
  - API: `GET /api/admin/dashboard/stats`
  - نمایش: totalUsers, totalCourses, totalOrders, totalRevenue

#### 7.2 آمار دستگاه‌ها

- [ ] **آمار دستگاه‌ها** - `/dashboard/devices`
  - API: `GET /api/admin/dashboard/devices`
  - فیلترها: period (monthly | yearly)

#### 7.3 پرداخت‌های ماهانه

- [ ] **آمار پرداخت‌های ماهانه** - `/dashboard/payments`
  - API: `GET /api/admin/dashboard/payments/monthly`

#### 7.4 سود هفتگی

- [ ] **آمار سود هفتگی** - `/dashboard/profit`
  - API: `GET /api/admin/dashboard/profit/weekly`

---

### 8. نگهداری و ابزارها (Maintenance & Tools)

#### 8.1 بازخوانی کش (Revalidate)

- [ ] **بازخوانی کش** - `/tools/revalidate`
  - API: `GET /api/admin/revalidate` (لیست مسیرها)
  - API: `POST /api/admin/revalidate` (بازخوانی)
  - عملیات: بازخوانی دستی کش ISR

#### 8.2 تصحیح UpdatedAt

- [ ] **تصحیح UpdatedAt** - `/tools/fix-updated-at`
  - API: `POST /api/admin/fix-updatedAt`
  - عملیات: تصحیح فیلد updatedAt رکوردها

#### 8.3 ایجاد داده‌های تستی

- [ ] **ایجاد داده‌های تستی آزمون** - `/tools/seed-quizzes`
  - API: `POST /api/admin/seed/quizzes`
  - عملیات: ایجاد داده‌های تستی برای آزمون‌ها

---

## 📊 خلاصه آمار

### صفحات پیاده‌سازی شده

- **تعداد کل:** 18 بخش اصلی
- **درصد پیشرفت:** ~43%

### صفحات باقی‌مانده

- **تعداد کل:** 24 بخش اصلی + 30+ صفحه جزئی
- **اولویت بالا:**
  1. آزمون‌ها (Quizzes) - 12 صفحه
  2. درس‌ها (Lessons) - 4 صفحه
  3. داشبورد و آمار - 4 صفحه
  4. تراکنش‌ها - 4 صفحه
  5. مشترکین خبرنامه - 5 صفحه

---

## 🎯 اولویت‌بندی پیاده‌سازی

### اولویت 1 (حیاتی)

1. **آزمون‌ها و سوالات** - برای تکمیل سیستم آموزشی
2. **درس‌ها** - برای مدیریت محتوای دوره‌ها
3. **داشبورد آمار** - برای نمای کلی سیستم

### اولویت 2 (مهم)

1. **تراکنش‌ها** - برای مدیریت مالی
2. **مشترکین خبرنامه** - برای ارتباط با کاربران
3. **نظرات اخبار** - برای تعامل با کاربران

### اولویت 3 (معمولی)

1. **محتوای صفحات** - برای مدیریت صفحات استاتیک
2. **ابزارهای نگهداری** - برای مدیریت سیستم

---

## 🔗 نکات پیاده‌سازی

### الگوی CRUD استاندارد

هر صفحه نیاز به این موارد دارد:

1. **List Page** - لیست با pagination, search, filter
2. **Create Page** - فرم ایجاد با validation
3. **Edit Page** - فرم ویرایش + دکمه حذف
4. **Detail Page** (در صورت نیاز) - نمایش جزئیات کامل

### کامپوننت‌های مشترک

- `DataTable` - برای لیست‌ها
- `FormLayout` - برای فرم‌ها
- `Breadcrumb` - برای مسیریابی
- `DeleteButton` - برای حذف با تایید
- `StatusBadge` - برای نمایش وضعیت

### API Integration

- استفاده از `fetch` یا `axios`
- مدیریت خطاها با `try-catch`
- نمایش loading state
- نمایش پیام موفقیت/خطا با toast

---

**تاریخ آخرین بروزرسانی:** 2025-11-17

**نسخه:** 1.0.0
