"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUploadImage, useUpdateImage, useImage } from "@/hooks/api/use-images";
import { toast } from "sonner";
import type { ImageCategory } from "@/types/api";

interface ImageFormProps {
  imageId?: string;
  isEdit?: boolean;
}

const ImageForm: React.FC<ImageFormProps> = ({ imageId, isEdit = false }) => {
  const router = useRouter();
  const uploadImage = useUploadImage();
  const updateImage = useUpdateImage(imageId || "");
  const { data: imageData } = useImage(imageId || "");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alt: "",
    tags: "",
    category: "OTHER" as ImageCategory,
    published: true,
  });

  useEffect(() => {
    if (isEdit && imageData) {
      const image = imageData.data;
      setFormData({
        title: image.title || "",
        description: image.description || "",
        alt: image.alt || "",
        tags: image.tags?.join(", ") || "",
        category: image.category as ImageCategory,
        published: image.published,
      });
      if (image.filePath) {
        setPreview(image.filePath);
      }
    }
  }, [isEdit, imageData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && imageId) {
        await updateImage.mutateAsync({
          title: formData.title,
          description: formData.description,
          alt: formData.alt,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          category: formData.category,
          published: formData.published,
        });
        toast.success("تصویر با موفقیت به‌روزرسانی شد");
      } else {
        if (!file) {
          toast.error("لطفا یک تصویر انتخاب کنید");
          return;
        }
        await uploadImage.mutateAsync({
          file,
          category: formData.category,
          title: formData.title,
          description: formData.description,
          alt: formData.alt,
          tags: formData.tags,
        });
        toast.success("تصویر با موفقیت آپلود شد");
      }
      router.push("/images");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره تصویر");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش تصویر" : "آپلود تصویر جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* File Upload (only for create) */}
        {!isEdit && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              فایل تصویر <span className="text-red">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke bg-transparent file:mr-4 file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              پیش‌نمایش
            </label>
            <img
              src={preview}
              alt="Preview"
              className="h-auto max-h-60 w-auto rounded-lg object-contain"
            />
          </div>
        )}

        {/* Title */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان تصویر"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="توضیحات تصویر"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2">
          {/* Alt Text */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              متن جایگزین (Alt)
            </label>
            <input
              type="text"
              name="alt"
              value={formData.alt}
              onChange={handleChange}
              placeholder="متن جایگزین برای SEO"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی <span className="text-red">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="COURSE">دوره</option>
              <option value="NEWS">خبر</option>
              <option value="PRODUCT">محصول</option>
              <option value="PROFILE">پروفایل</option>
              <option value="BANNER">بنر</option>
              <option value="OTHER">سایر</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-5.5 mt-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            برچسب‌ها (با کاما جدا کنید)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="مثال: طبیعت, منظره, کوهستان"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Published */}
        <div className="mb-5.5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-5 w-5 rounded border-stroke bg-white dark:border-dark-3 dark:bg-dark-2"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              انتشار تصویر
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploadImage.isPending || updateImage.isPending}
            className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {uploadImage.isPending || updateImage.isPending
              ? "در حال ذخیره..."
              : isEdit
                ? "به‌روزرسانی"
                : "آپلود"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/images")}
            className="inline-flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;
