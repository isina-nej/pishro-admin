"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useComments, useUpdateComment, useDeleteComment } from "@/hooks/api/use-comments";

import type { CommentWithRelations } from "@/types/api";

const CommentsTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useComments({ page, limit: 10, search });
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const handleApprove = async (commentId: string) => {
    if (confirm("آیا از تایید این نظر مطمئن هستید؟")) {
      try {
        await updateComment.mutateAsync({ id: commentId, data: { published: true } });
        alert("نظر با موفقیت تایید شد");
      } catch (error: any) {
        alert(error?.message || "خطا در تایید نظر");
      }
    }
  };

  const handleReject = async (commentId: string) => {
    if (confirm("آیا از رد این نظر مطمئن هستید؟")) {
      try {
        await updateComment.mutateAsync({ id: commentId, data: { published: false } });
        alert("نظر رد شد");
      } catch (error: any) {
        alert(error?.message || "خطا در رد نظر");
      }
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm("آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست.")) {
      try {
        await deleteComment.mutateAsync(commentId);
        alert("نظر با موفقیت حذف شد");
      } catch (error: any) {
        alert(error?.message || "خطا در حذف نظر");
      }
    }
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4">
        <p className="text-danger">خطا در بارگذاری نظرات</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">لیست نظرات</h3>

          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 rounded border border-stroke bg-transparent px-3 py-1.5 outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto p-4 sm:p-7.5">
        {isLoading ? (
          <div className="text-center">در حال بارگذاری...</div>
        ) : (
          <>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    نظر
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    کاربر
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    دوره
                  </th>

                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    امتیاز
                  </th>

                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (comment: CommentWithRelations, index: number) => (
                    <tr key={comment.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="line-clamp-2 text-dark dark:text-white">
                          {comment.text}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {comment.userName || comment.user?.firstName}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {comment.course?.subject || "-"}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {comment.rating ? `${comment.rating}/5` : "-"}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${comment.published ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"}`}
                        >
                          {comment.published ? "منتشر شده" : "در انتظار"}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/comments/${comment.id}`}
                            className="hover:text-primary"
                            title="مشاهده"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                              />
                            </svg>
                          </Link>

                          <Link
                            href={`/comments/edit/${comment.id}`}
                            className="hover:text-primary"
                            title="ویرایش"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z" />
                              <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" />
                            </svg>
                          </Link>

                          {!comment.published ? (
                            <button
                              onClick={() => handleApprove(comment.id)}
                              className="hover:text-[#219653]"
                              title="تایید"
                              disabled={updateComment.isPending}
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
                                  d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReject(comment.id)}
                              className="hover:text-[#FFA70B]"
                              title="رد کردن"
                              disabled={updateComment.isPending}
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
                                  d="M10 6V10M10 14H10.01M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="hover:text-[#D34053]"
                            title="حذف"
                            disabled={deleteComment.isPending}
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.5 3.5C8.5 3.22386 8.72386 3 9 3H11C11.2761 3 11.5 3.22386 11.5 3.5V4H8.5V3.5ZM7 4V3.5C7 2.39543 7.89543 1.5 9 1.5H11C12.1046 1.5 13 2.39543 13 3.5V4H16.5C16.7761 4 17 4.22386 17 4.5C17 4.77614 16.7761 5 16.5 5H15.9311L15.1305 16.1148C15.0645 17.1836 14.1696 18 13.0986 18H6.90135C5.83045 18 4.93546 17.1836 4.86949 16.1148L4.06888 5H3.5C3.22386 5 3 4.77614 3 4.5C3 4.22386 3.22386 4 3.5 4H7ZM8.5 7.5C8.77614 7.5 9 7.72386 9 8V14C9 14.2761 8.77614 14.5 8.5 14.5C8.22386 14.5 8 14.2761 8 14V8C8 7.72386 8.22386 7.5 8.5 7.5ZM11.5 7.5C11.7761 7.5 12 7.72386 12 8V14C12 14.2761 11.7761 14.5 11.5 14.5C11.2239 14.5 11 14.2761 11 14V8C11 7.72386 11.2239 7.5 11.5 7.5Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {data && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} نظر
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded bg-gray px-3 py-1 text-body-sm disabled:opacity-50"
                  >
                    قبلی
                  </button>

                  <span className="px-3 py-1">
                    صفحه {page} از {data.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.pagination.hasNextPage}
                    className="rounded bg-gray px-3 py-1 text-body-sm disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsTable;
