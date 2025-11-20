import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/settings - دریافت تنظیمات سایت
export async function GET() {
  try {
    // بررسی احراز هویت
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "لطفا وارد شوید",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // بررسی نقش ادمین
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی محدود به ادمین",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // دریافت یا ایجاد تنظیمات
    let settings = await prisma.siteSettings.findFirst();

    // اگر تنظیمات وجود نداشت، یک رکورد جدید ایجاد کن
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    return NextResponse.json({
      success: true,
      message: "تنظیمات با موفقیت دریافت شد",
      data: settings,
    });
  } catch (error) {
    console.error("خطا در دریافت تنظیمات:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت تنظیمات",
        code: "DATABASE_ERROR",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/settings - به‌روزرسانی تنظیمات سایت
export async function PATCH(request: NextRequest) {
  try {
    // بررسی احراز هویت
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "لطفا وارد شوید",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // بررسی نقش ادمین
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی محدود به ادمین",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // دریافت داده‌های ارسالی
    const body = await request.json();

    // اعتبارسنجی zarinpalMerchantId
    if (body.zarinpalMerchantId !== undefined && body.zarinpalMerchantId !== null && body.zarinpalMerchantId !== "") {
      const merchantId = body.zarinpalMerchantId.trim();

      // بررسی طول UUID (36 کاراکتر با خط تیره‌ها)
      if (merchantId.length !== 36) {
        return NextResponse.json(
          {
            success: false,
            message: "فرمت شناسه پذیرنده صحیح نیست",
            errors: {
              zarinpalMerchantId: "شناسه پذیرنده باید 36 کاراکتر باشد (فرمت UUID)",
            },
            code: "VALIDATION_ERROR",
          },
          { status: 400 }
        );
      }

      // بررسی فرمت UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(merchantId)) {
        return NextResponse.json(
          {
            success: false,
            message: "فرمت شناسه پذیرنده صحیح نیست",
            errors: {
              zarinpalMerchantId: "شناسه پذیرنده باید در فرمت UUID باشد (مثال: a1b2c3d4-e5f6-7890-abcd-ef1234567890)",
            },
            code: "VALIDATION_ERROR",
          },
          { status: 400 }
        );
      }
    }

    // پیدا کردن یا ایجاد تنظیمات
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData: {
      zarinpalMerchantId?: string | null;
      siteName?: string | null;
      siteDescription?: string | null;
      supportEmail?: string | null;
      supportPhone?: string | null;
    } = {};

    if (body.zarinpalMerchantId !== undefined) {
      updateData.zarinpalMerchantId = body.zarinpalMerchantId || null;
    }
    if (body.siteName !== undefined) {
      updateData.siteName = body.siteName || null;
    }
    if (body.siteDescription !== undefined) {
      updateData.siteDescription = body.siteDescription || null;
    }
    if (body.supportEmail !== undefined) {
      updateData.supportEmail = body.supportEmail || null;
    }
    if (body.supportPhone !== undefined) {
      updateData.supportPhone = body.supportPhone || null;
    }

    // به‌روزرسانی تنظیمات
    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "تنظیمات با موفقیت به‌روزرسانی شد",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("خطا در به‌روزرسانی تنظیمات:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در به‌روزرسانی تنظیمات",
        code: "DATABASE_ERROR",
      },
      { status: 500 }
    );
  }
}
