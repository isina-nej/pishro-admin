"use client";
import React, { useState, useEffect } from "react";

interface SiteSettings {
  id: string;
  zarinpalMerchantId?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

const ZarinpalSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState("");

  // بارگذاری تنظیمات فعلی
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        setMerchantId(result.data.zarinpalMerchantId || "");
      } else {
        setError(result.error || "خطا در بارگذاری تنظیمات");
      }
    } catch (err) {
      setError("خطا در بارگذاری تنظیمات");
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zarinpalMerchantId: merchantId.trim() || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        setSuccess("✅ تنظیمات با موفقیت به‌روزرسانی شد");
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(result.message || result.error || "خطا در ذخیره تنظیمات");
      }
    } catch (err) {
      setError("خطا در ذخیره تنظیمات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!settings && !error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            تنظیمات درگاه پرداخت
          </h3>
        </div>
        <div className="p-7">
          <div className="text-center">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          تنظیمات درگاه پرداخت
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {success}
            </div>
          )}

          <div className="mb-5.5">
            <label
              className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
              htmlFor="zarinpalMerchantId"
            >
              شناسه پذیرنده زرین‌پال (Merchant ID)
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM1.25 10C1.25 5.16751 5.16751 1.25 10 1.25C14.8325 1.25 18.75 5.16751 18.75 10C18.75 14.8325 14.8325 18.75 10 18.75C5.16751 18.75 1.25 14.8325 1.25 10Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 5.625C10.3452 5.625 10.625 5.90482 10.625 6.25V10C10.625 10.3452 10.3452 10.625 10 10.625C9.65482 10.625 9.375 10.3452 9.375 10V6.25C9.375 5.90482 9.65482 5.625 10 5.625Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.375 13.125C9.375 12.7798 9.65482 12.5 10 12.5H10.0063C10.3514 12.5 10.6313 12.7798 10.6313 13.125C10.6313 13.4702 10.3514 13.75 10.0063 13.75H10C9.65482 13.75 9.375 13.4702 9.375 13.125Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                type="text"
                name="zarinpalMerchantId"
                id="zarinpalMerchantId"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                maxLength={36}
                dir="ltr"
              />
            </div>
            <small className="mt-2 block text-body-xs text-dark-5 dark:text-dark-6">
              فرمت: UUID با 36 کاراکتر (مثال: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
            </small>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => setMerchantId(settings?.zarinpalMerchantId || "")}
            >
              انصراف
            </button>
            <button
              className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
          </div>
        </form>

        {settings?.zarinpalMerchantId && (
          <div className="mt-6 rounded-md border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
            <h4 className="mb-2 text-sm font-medium text-dark dark:text-white">
              وضعیت فعلی
            </h4>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-body-sm text-dark-5 dark:text-dark-6">
                شناسه پذیرنده تنظیم شده است
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZarinpalSettings;
