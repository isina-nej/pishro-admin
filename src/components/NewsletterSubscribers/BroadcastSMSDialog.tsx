"use client";

import React, { useState } from "react";
import { useBroadcastSMS } from "@/hooks/api/use-newsletter-subscribers";
import { toast } from "sonner";

interface BroadcastSMSDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BroadcastSMSDialog: React.FC<BroadcastSMSDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const broadcastSMS = useBroadcastSMS();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("لطفا متن پیام را وارد کنید");
      return;
    }

    try {
      await broadcastSMS.mutateAsync({ message: message.trim() });
      toast.success("پیامک با موفقیت برای همه مشترکین ارسال شد");
      setMessage("");
      setShowConfirm(false);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "خطا در ارسال پیامک");
      console.error(error);
    }
  };

  const handleClose = () => {
    if (!broadcastSMS.isPending) {
      setMessage("");
      setShowConfirm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={broadcastSMS.isPending}
          className="absolute right-4 top-4 text-body hover:text-dark dark:text-white"
        >
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
              d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
              fill=""
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            ارسال پیامک گروهی
          </h3>
          <p className="mt-2 text-body-sm text-body">
            پیام شما برای تمامی مشترکین خبرنامه ارسال خواهد شد
          </p>
        </div>

        {/* Form */}
        {!showConfirm ? (
          <div>
            <div className="mb-5.5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن پیام <span className="text-red">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="متن پیام خود را وارد کنید..."
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <p className="mt-1.5 text-body-sm text-body">
                تعداد کاراکتر: {message.length}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={!message.trim()}
                className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                ادامه
              </button>
            </div>
          </div>
        ) : (
          // Confirmation step
          <div>
            <div className="mb-6 rounded-lg border border-warning bg-warning/10 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 flex-shrink-0 fill-warning"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill=""/>
                </svg>
                <div>
                  <h4 className="mb-2 font-semibold text-warning">
                    آیا از ارسال پیامک اطمینان دارید؟
                  </h4>
                  <p className="text-body-sm text-body">
                    این پیام برای تمامی مشترکین خبرنامه ارسال خواهد شد. این عملیات قابل بازگشت نیست.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5.5">
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                پیش‌نمایش پیام:
              </label>
              <div className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-3">
                <p className="whitespace-pre-wrap text-dark dark:text-white">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={broadcastSMS.isPending}
                className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90 disabled:opacity-50"
              >
                بازگشت
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={broadcastSMS.isPending}
                className="rounded bg-success px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {broadcastSMS.isPending ? "در حال ارسال..." : "ارسال پیامک"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastSMSDialog;
