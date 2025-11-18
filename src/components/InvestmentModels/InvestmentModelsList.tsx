"use client";

import React, { useState } from "react";
import { InvestmentModel } from "@/types/api";
import { toast } from "sonner";
import InvestmentModelForm from "./InvestmentModelForm";
import { useDeleteInvestmentModel, useUpdateInvestmentModel } from "@/hooks/api";

interface InvestmentModelsListProps {
  pageId: string;
  models: InvestmentModel[];
  onModelsChange: () => void;
}

const InvestmentModelsList: React.FC<InvestmentModelsListProps> = ({
  pageId,
  models,
  onModelsChange,
}) => {
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const deleteModel = useDeleteInvestmentModel();
  const updateModel = useUpdateInvestmentModel();

  const sortedModels = [...models].sort((a, b) => a.order - b.order);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مدل اطمینان دارید؟")) return;

    try {
      await deleteModel.mutateAsync(id);
      toast.success("مدل با موفقیت حذف شد");
      onModelsChange();
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف مدل");
      console.error(error);
    }
  };

  const handleMoveUp = async (model: InvestmentModel, index: number) => {
    if (index === 0) return;

    const previousModel = sortedModels[index - 1];
    try {
      // Swap orders
      await updateModel.mutateAsync({
        id: model.id,
        data: { order: previousModel.order },
      });
      await updateModel.mutateAsync({
        id: previousModel.id,
        data: { order: model.order },
      });
      toast.success("ترتیب تغییر کرد");
      onModelsChange();
    } catch (error: any) {
      toast.error(error?.message || "خطا در تغییر ترتیب");
      console.error(error);
    }
  };

  const handleMoveDown = async (model: InvestmentModel, index: number) => {
    if (index === sortedModels.length - 1) return;

    const nextModel = sortedModels[index + 1];
    try {
      // Swap orders
      await updateModel.mutateAsync({
        id: model.id,
        data: { order: nextModel.order },
      });
      await updateModel.mutateAsync({
        id: nextModel.id,
        data: { order: model.order },
      });
      toast.success("ترتیب تغییر کرد");
      onModelsChange();
    } catch (error: any) {
      toast.error(error?.message || "خطا در تغییر ترتیب");
      console.error(error);
    }
  };

  const handleFormSuccess = () => {
    setIsAddingModel(false);
    setEditingModelId(null);
    onModelsChange();
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            مدل‌های سرمایه‌گذاری (حضوری/آنلاین)
          </h3>
          <button
            type="button"
            onClick={() => setIsAddingModel(true)}
            disabled={isAddingModel}
            className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            افزودن مدل جدید
          </button>
        </div>
      </div>

      <div className="p-7">
        {/* Add New Model Form */}
        {isAddingModel && (
          <div className="mb-7 rounded-[7px] border-2 border-dashed border-primary p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-dark dark:text-white">
                مدل جدید
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingModel(false)}
                className="text-red hover:underline"
              >
                انصراف
              </button>
            </div>
            <InvestmentModelForm
              pageId={pageId}
              onSuccess={handleFormSuccess}
              nextOrder={sortedModels.length}
            />
          </div>
        )}

        {/* Models List */}
        {sortedModels.length === 0 && !isAddingModel ? (
          <div className="py-8 text-center text-gray-500">
            <p>هیچ مدلی وجود ندارد. برای شروع یک مدل جدید اضافه کنید.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedModels.map((model, index) => (
              <div
                key={model.id}
                className="rounded-[7px] border border-stroke p-5 dark:border-dark-3"
              >
                {editingModelId === model.id ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-dark dark:text-white">
                        ویرایش مدل
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingModelId(null)}
                        className="text-red hover:underline"
                      >
                        انصراف
                      </button>
                    </div>
                    <InvestmentModelForm
                      pageId={pageId}
                      modelId={model.id}
                      isEdit
                      onSuccess={handleFormSuccess}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <span
                            className={`inline-block rounded px-3 py-1 text-sm font-medium text-white ${
                              model.type === "in-person"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {model.type === "in-person" ? "حضوری" : "آنلاین"}
                          </span>
                          <h4 className="text-lg font-semibold text-dark dark:text-white">
                            {model.title}
                          </h4>
                        </div>
                        <p className="mb-3 text-body-sm text-gray-600 dark:text-gray-400">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>آیکون: {model.icon}</span>
                          <span>•</span>
                          <span>رنگ: {model.color}</span>
                          <span>•</span>
                          <span>ترتیب: {model.order}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {/* Order controls */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(model, index)}
                            disabled={index === 0 || updateModel.isPending}
                            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                            title="انتقال به بالا"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(model, index)}
                            disabled={
                              index === sortedModels.length - 1 ||
                              updateModel.isPending
                            }
                            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                            title="انتقال به پایین"
                          >
                            ↓
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingModelId(model.id)}
                            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(model.id)}
                            disabled={deleteModel.isPending}
                            className="rounded bg-red px-3 py-1 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentModelsList;
