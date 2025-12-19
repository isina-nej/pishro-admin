"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateBook,
  useUpdateBook,
  useBook,
} from "@/hooks/api/use-books";
import { toast } from "sonner";
import { uploadBookPdf } from "@/lib/services/book-pdf-service";
import { uploadBookCover } from "@/lib/services/book-cover-service";
import { uploadBookAudio } from "@/lib/services/book-audio-service";
import { getPishro2ResourceUrl } from "@/lib/get-pishro2-url";
import PreviewModal from "./PreviewModal";
import type { CreateBookRequest } from "@/types/api";

interface BookFormProps {
  bookId?: string;
  isEdit?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ bookId, isEdit = false }) => {
  const router = useRouter();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const { data: bookData } = useBook(bookId || "");

  // Preview states
  const [showCoverPreview, setShowCoverPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showAudioPreview, setShowAudioPreview] = useState(false);

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverFileName, setCoverFileName] = useState<string>("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [audioPreview, setAudioPreview] = useState(false);

  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    slug: "",
    author: "",
    description: "",
    cover: "",
    publisher: "",
    year: new Date().getFullYear(),
    pages: null,
    isbn: "",
    language: "فارسی",
    category: "",
    formats: [],
    status: [],
    tags: [],
    readingTime: "",
    isFeatured: false,
    price: null,
    fileUrl: "",
    audioUrl: "",
    tagIds: [],
  });

  useEffect(() => {
    if (isEdit && bookData) {
      const book = bookData.data;
      setFormData({
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        cover: book.cover || "",
        publisher: book.publisher || "",
        year: book.year,
        pages: book.pages || null,
        isbn: book.isbn || "",
        language: book.language,
        category: book.category,
        formats: book.formats || [],
        status: book.status || [],
        tags: book.tags || [],
        readingTime: book.readingTime || "",
        isFeatured: book.isFeatured,
        price: book.price || null,
        fileUrl: book.fileUrl || "",
        audioUrl: book.audioUrl || "",
        tagIds: book.tagIds || [],
      });
      
      // اگر فایل PDF وجود دارد، نام فایل و وضعیت را استخراج کنید
      if (book.fileUrl) {
        const fileName = book.fileUrl.split("/").pop() || "";
        setPdfFileName(fileName);
        setPdfPreview(true); // نشان دادن که فایل موجود است
      }

      // اگر کاور وجود دارد، نام فایل و پیش‌نمایش را استخراج کنید
      if (book.cover) {
        const fileName = book.cover.split("/").pop() || "";
        setCoverFileName(fileName);
        // استفاده از URL درست از طریق util function
        const coverUrl = getPishro2ResourceUrl(book.cover);
        setCoverPreview(coverUrl);
      }

      // اگر فایل صوتی وجود دارد، نام فایل و وضعیت را استخراج کنید
      if (book.audioUrl) {
        const fileName = book.audioUrl.split("/").pop() || "";
        setAudioFileName(fileName);
        setAudioPreview(true); // نشان دادن که فایل موجود است
      }

      // اگر فایل PDF وجود دارد، نام فایل و وضعیت را استخراج کنید
      if (book.fileUrl) {
        setPdfPreview(true); // نشان دادن که فایل موجود است
      }
    }
  }, [isEdit, bookData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation: Check if required fields are filled
      if (!formData.title.trim()) {
        toast.error("عنوان کتاب الزامی است");
        return;
      }
      if (!formData.slug.trim()) {
        toast.error("Slug الزامی است");
        return;
      }
      if (!formData.author.trim()) {
        toast.error("نویسنده الزامی است");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("توضیحات الزامی است");
        return;
      }
      if (!formData.category.trim()) {
        toast.error("دسته‌بندی الزامی است");
        return;
      }
      if (!formData.cover?.trim()) {
        toast.error("تصویر جلد الزامی است");
        return;
      }
      if (!formData.fileUrl?.trim()) {
        toast.error("فایل PDF الزامی است");
        return;
      }

      console.log("Submitting book data:", formData);
      
      if (isEdit && bookId) {
        await updateBook.mutateAsync({ id: bookId, data: formData });
        toast.success("کتاب با موفقیت به‌روزرسانی شد");
      } else {
        await createBook.mutateAsync(formData);
        toast.success("کتاب با موفقیت ایجاد شد");
      }
      router.push("/books");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "خطا در ذخیره کتاب");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleArrayAdd = (
    field: "formats" | "status" | "tags",
    value: string,
  ) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleArrayRemove = (
    field: "formats" | "status" | "tags",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show PDF preview indicator
    setPdfPreview(true);

    setUploadingPdf(true);
    try {
      console.log("Starting PDF upload...", { fileName: file.name, fileSize: file.size });
      const result = await uploadBookPdf(file);
      console.log("PDF upload result:", result);
      
      setFormData((prev) => ({
        ...prev,
        fileUrl: result.fileUrl,
      }));
      setPdfFileName(result.fileName);
      toast.success("فایل PDF با موفقیت آپلود شد");
      console.log("Updated formData with fileUrl:", result.fileUrl);
    } catch (error: any) {
      console.error("PDF upload error:", error);
      toast.error(error?.message || "خطا در آپلود فایل PDF");
      setPdfPreview(false); // Clear preview on error
    } finally {
      setUploadingPdf(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemovePdf = () => {
    setFormData((prev) => ({
      ...prev,
      fileUrl: "",
    }));
    setPdfFileName("");
    setPdfPreview(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingCover(true);
    try {
      const result = await uploadBookCover(file);
      setFormData((prev) => ({
        ...prev,
        cover: result.fileUrl,
      }));
      setCoverFileName(result.fileName);
      toast.success("تصویر کاور با موفقیت آپلود شد");
    } catch (error: any) {
      toast.error(error?.message || "خطا در آپلود تصویر کاور");
      console.error(error);
      setCoverPreview(""); // Clear preview on error
    } finally {
      setUploadingCover(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemoveCover = () => {
    setFormData((prev) => ({
      ...prev,
      cover: "",
    }));
    setCoverFileName("");
    setCoverPreview("");
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show audio preview indicator
    setAudioPreview(true);

    setUploadingAudio(true);
    try {
      const result = await uploadBookAudio(file);
      setFormData((prev) => ({
        ...prev,
        audioUrl: result.fileUrl,
      }));
      setAudioFileName(result.fileName);
      toast.success("فایل صوتی با موفقیت آپلود شد");
    } catch (error: any) {
      toast.error(error?.message || "خطا در آپلود فایل صوتی");
      console.error(error);
      setAudioPreview(false); // Clear preview on error
    } finally {
      setUploadingAudio(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemoveAudio = () => {
    setFormData((prev) => ({
      ...prev,
      audioUrl: "",
    }));
    setAudioFileName("");
    setAudioPreview(false);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش کتاب" : "افزودن کتاب جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Slug <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نویسنده <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ناشر
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات <span className="text-red">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              سال انتشار <span className="text-red">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تعداد صفحات
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زبان
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زمان مطالعه
            </label>
            <input
              type="text"
              name="readingTime"
              value={formData.readingTime || ""}
              onChange={handleChange}
              placeholder="مثلاً: 5 ساعت"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر جلد <span className="text-red">*</span>
            </label>
            <div className="mb-3 rounded border border-dashed border-stroke p-4 dark:border-dark-3">
              {coverPreview ? (
                <div>
                  <div 
                    className="mb-3 flex cursor-pointer items-center justify-center rounded bg-gray-light p-2 transition hover:bg-gray-light/80 dark:bg-dark-3 dark:hover:bg-dark-3/80"
                    onClick={() => setShowCoverPreview(true)}
                  >
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="max-h-40 max-w-32 rounded object-cover"
                      onError={(e) => {
                        console.error("Image load error:", coverPreview);
                        e.currentTarget.src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded bg-green-light p-3">
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {coverFileName}
                      </p>
                      <p className="text-xs text-body dark:text-body-dark">
                        کاور کتاب (برای بزرگ‌نمایی کلیک کنید)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="text-red hover:text-opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg
                      className="mb-2 h-8 w-8 text-body dark:text-body-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {uploadingCover ? "در حال آپلود..." : "برای انتخاب تصویر کلیک کنید"}
                    </p>
                    <p className="text-xs text-body dark:text-body-dark">
                      PNG, JPG یا WebP (حداکثر 5MB)
                    </p>
                  </div>
                </label>
              )}
            </div>
            {formData.cover && !coverPreview && (
              <div className="mt-2">
                <p className="text-xs text-body dark:text-body-dark">
                  لینک فعلی: {formData.cover}
                </p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              قیمت (تومان)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            فایل PDF <span className="text-red">*</span>
          </label>
          <div className="mb-3 rounded border border-dashed border-stroke p-4 dark:border-dark-3">
            {pdfFileName || pdfPreview ? (
              <div>
                {pdfPreview && (
                  <div 
                    className="mb-3 flex cursor-pointer items-center justify-center rounded bg-blue-light p-4 transition hover:bg-blue-light/80 dark:bg-blue-dark/20 dark:hover:bg-blue-dark/30"
                    onClick={() => setShowPdfPreview(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-8 w-8 text-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        فایل PDF آپلود شد (برای پیش‌نمایش کلیک کنید)
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between rounded bg-green-light p-3">
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {pdfFileName}
                    </p>
                    <p className="text-xs text-body dark:text-body-dark">
                      فایل PDF کتاب
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePdf}
                    className="text-red hover:text-opacity-80"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center py-6">
                  <svg
                    className="mb-2 h-8 w-8 text-body dark:text-body-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {uploadingPdf ? "در حال آپلود..." : "برای انتخاب فایل PDF کلیک کنید"}
                  </p>
                  <p className="text-xs text-body dark:text-body-dark">
                    فقط فایل PDF (حداکثر 100MB)
                  </p>
                </div>
              </label>
            )}
          </div>
          {formData.fileUrl && !pdfFileName && (
            <div className="mt-2">
              <p className="text-xs text-body dark:text-body-dark">
                لینک فعلی: {formData.fileUrl}
              </p>
            </div>
          )}
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            فایل صوتی
          </label>
          <div className="mb-3 rounded border border-dashed border-stroke p-4 dark:border-dark-3">
            {audioFileName || audioPreview ? (
              <div>
                {audioPreview && (
                  <div className="mb-3 flex items-center justify-center rounded bg-purple-light p-4 dark:bg-purple-dark/20">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-8 w-8 text-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        فایل صوتی آپلود شد
                      </p>
                      {audioPreview && formData.audioUrl && (
                        <audio
                          controls
                          className="mt-2 w-full"
                          src={getPishro2ResourceUrl(formData.audioUrl)}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between rounded bg-green-light p-3">
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {audioFileName}
                    </p>
                    <p className="text-xs text-body dark:text-body-dark">
                      فایل صوتی کتاب
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAudio}
                    className="text-red hover:text-opacity-80"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  disabled={uploadingAudio}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center py-6">
                  <svg
                    className="mb-2 h-8 w-8 text-body dark:text-body-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {uploadingAudio ? "در حال آپلود..." : "برای انتخاب فایل صوتی کلیک کنید"}
                  </p>
                  <p className="text-xs text-body dark:text-body-dark">
                    MP3, WAV، OGG یا دیگر فرمت‌های صوتی (حداکثر 500MB)
                  </p>
                </div>
              </label>
            )}
          </div>
          {formData.audioUrl && !audioFileName && (
            <div className="mt-2">
              <p className="text-xs text-body dark:text-body-dark">
                لینک فعلی: {formData.audioUrl}
              </p>
            </div>
          )}
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            فرمت‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.formats.map((format, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {format}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("formats", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="format-input"
              placeholder="مثلاً: PDF, EPUB"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("formats", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "format-input",
                ) as HTMLInputElement;
                handleArrayAdd("formats", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            وضعیت‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.status.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {stat}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("status", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="status-input"
              placeholder="مثلاً: جدید، پرفروش"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("status", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "status-input",
                ) as HTMLInputElement;
                handleArrayAdd("status", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تگ‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("tags", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="tag-input"
              placeholder="یک تگ وارد کنید"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("tags", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "tag-input",
                ) as HTMLInputElement;
                handleArrayAdd("tags", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5 flex gap-5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              ویژه
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/books")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createBook.isPending || updateBook.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createBook.isPending || updateBook.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>

      {/* Preview Modals */}
      <PreviewModal
        isOpen={showCoverPreview}
        onClose={() => setShowCoverPreview(false)}
        title="پیش‌نمایش کاور"
        type="image"
        src={coverPreview}
      />
      <PreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        title="پیش‌نمایش PDF"
        type="pdf"
        src={formData.fileUrl ? getPishro2ResourceUrl(formData.fileUrl) : null}
      />
      <PreviewModal
        isOpen={showAudioPreview}
        onClose={() => setShowAudioPreview(false)}
        title="پیش‌نمایش صوت"
        type="audio"
        src={formData.audioUrl ? getPishro2ResourceUrl(formData.audioUrl) : null}
      />
    </div>
  );
};

export default BookForm;
