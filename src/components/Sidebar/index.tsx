"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  FaGraduationCap,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaUsers,
  FaUserShield,
  FaLock,
  FaShoppingCart,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaChartLine,
  FaMobileAlt,
  FaHome,
  FaCertificate,
  FaUserTie,
  FaFileAlt,
  FaInfoCircle,
  FaVideo,
  FaTags,
  FaNewspaper,
  FaComments,
  FaBookOpen,
  FaImage,
  FaCog,
  FaEnvelope,
  FaList,
  FaFileInvoice,
  FaLayerGroup,
} from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "منو اصلی",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.00009 17.2498C8.58588 17.2498 8.25009 17.5856 8.25009 17.9998C8.25009 18.414 8.58588 18.7498 9.00009 18.7498H15.0001C15.4143 18.7498 15.7501 18.414 15.7501 17.9998C15.7501 17.5856 15.4143 17.2498 15.0001 17.2498H9.00009Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C11.2749 1.25 10.6134 1.44911 9.88928 1.7871C9.18832 2.11428 8.37772 2.59716 7.36183 3.20233L5.90622 4.06943C4.78711 4.73606 3.89535 5.26727 3.22015 5.77524C2.52314 6.29963 1.99999 6.8396 1.65907 7.55072C1.31799 8.26219 1.22554 9.0068 1.25519 9.87584C1.2839 10.717 1.43105 11.7397 1.61556 13.0219L1.90792 15.0537C2.14531 16.7036 2.33368 18.0128 2.61512 19.0322C2.90523 20.0829 3.31686 20.9169 4.05965 21.5565C4.80184 22.1956 5.68984 22.4814 6.77634 22.6177C7.83154 22.75 9.16281 22.75 10.8423 22.75H13.1577C14.8372 22.75 16.1685 22.75 17.2237 22.6177C18.3102 22.4814 19.1982 22.1956 19.9404 21.5565C20.6831 20.9169 21.0948 20.0829 21.3849 19.0322C21.6663 18.0129 21.8547 16.7036 22.0921 15.0537L22.3844 13.0219C22.569 11.7396 22.7161 10.717 22.7448 9.87584C22.7745 9.0068 22.682 8.26219 22.3409 7.55072C22 6.8396 21.4769 6.29963 20.7799 5.77524C20.1047 5.26727 19.2129 4.73606 18.0938 4.06943L16.6382 3.20233C15.6223 2.59716 14.8117 2.11428 14.1107 1.7871C13.3866 1.44911 12.7251 1.25 12 1.25ZM8.09558 4.51121C9.15309 3.88126 9.89923 3.43781 10.5237 3.14633C11.1328 2.86203 11.5708 2.75 12 2.75C12.4293 2.75 12.8672 2.86203 13.4763 3.14633C14.1008 3.43781 14.8469 3.88126 15.9044 4.51121L17.2893 5.33615C18.4536 6.02973 19.2752 6.52034 19.8781 6.9739C20.4665 7.41662 20.7888 7.78294 20.9883 8.19917C21.1877 8.61505 21.2706 9.09337 21.2457 9.82469C21.2201 10.5745 21.0856 11.5163 20.8936 12.8511L20.6148 14.7884C20.3683 16.5016 20.1921 17.7162 19.939 18.633C19.6916 19.5289 19.3939 20.0476 18.9616 20.4198C18.5287 20.7926 17.9676 21.0127 17.037 21.1294C16.086 21.2486 14.8488 21.25 13.1061 21.25H10.8939C9.15124 21.25 7.91405 21.2486 6.963 21.1294C6.03246 21.0127 5.47129 20.7926 5.03841 20.4198C4.60614 20.0476 4.30838 19.5289 4.06102 18.633C3.80791 17.7162 3.6317 16.5016 3.3852 14.7884L3.10643 12.851C2.91437 11.5163 2.77991 10.5745 2.75432 9.82469C2.72937 9.09337 2.81229 8.61505 3.01167 8.19917C3.21121 7.78294 3.53347 7.41662 4.12194 6.9739C4.72482 6.52034 5.54643 6.02973 6.71074 5.33615L8.09558 4.51121Z"
              fill=""
            />
          </svg>
        ),
        label: "داشبورد",
        route: "/",
      },
    ],
  },
  {
    name: "مدیریت محتوا",
    menuItems: [
      {
        icon: <FaTags className="w-5 h-5" />,
        label: "برچسب‌ها",
        route: "/tags",
      },
      {
        icon: <FaLayerGroup className="w-5 h-5" />,
        label: "دسته‌بندی‌ها",
        route: "/categories",
      },
      {
        icon: <FaFileAlt className="w-5 h-5" />,
        label: "محتوای صفحات",
        route: "/page-content",
      },
      {
        icon: <FaInfoCircle className="w-5 h-5" />,
        label: "صفحه درباره ما",
        route: "/about-page",
      },
      {
        icon: <FaHome className="w-5 h-5" />,
        label: "صفحه لندینگ",
        route: "/home-landing",
      },
    ],
  },
  {
    name: "آموزش و دوره‌ها",
    menuItems: [
      {
        icon: <FaGraduationCap className="w-5 h-5" />,
        label: "کورس‌ها",
        route: "#",
        children: [
          { label: "لیست کورس‌ها", route: "/courses" },
          { label: "دسته‌بندی کورس‌ها", route: "/course-categories" },
          { label: "درس‌ها", route: "/lessons" },
        ],
      },
      {
        icon: <FaUserGraduate className="w-5 h-5" />,
        label: "ثبت‌نام‌ها",
        route: "/enrollments",
      },
      {
        icon: <FaClipboardList className="w-5 h-5" />,
        label: "آزمون‌ها",
        route: "#",
        children: [
          { label: "لیست آزمون‌ها", route: "/quizzes" },
          { label: "سوالات", route: "/quiz-questions" },
          { label: "تلاش‌های آزمون", route: "/quiz-attempts" },
        ],
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 8.25C2 7.00736 3.00736 6 4.25 6H19.75C20.9926 6 22 7.00736 22 8.25V15.75C22 16.9926 20.9926 18 19.75 18H4.25C3.00736 18 2 16.9926 2 15.75V8.25ZM4.25 7.5C3.83579 7.5 3.5 7.83579 3.5 8.25V15.75C3.5 16.1642 3.83579 16.5 4.25 16.5H19.75C20.1642 16.5 20.5 16.1642 20.5 15.75V8.25C20.5 7.83579 20.1642 7.5 19.75 7.5H4.25Z"
              fill=""
            />
            <path
              d="M8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12H16C16.5523 12 17 11.5523 17 11C17 10.4477 16.5523 10 16 10H8Z"
              fill=""
            />
            <path
              d="M7 13C7 12.4477 7.44772 12 8 12H12C12.5523 12 13 12.4477 13 13C13 13.5523 12.5523 14 12 14H8C7.44772 14 7 13.5523 7 13Z"
              fill=""
            />
          </svg>
        ),
        label: "کلاس‌های Skyroom",
        route: "/skyroom-classes",
      },
      {
        icon: <FaBookOpen className="w-5 h-5" />,
        label: "کتاب‌ها",
        route: "/books",
      },
      {
        icon: <FaCertificate className="w-5 h-5" />,
        label: "گواهینامه‌ها",
        route: "/certificates",
      },
    ],
  },
  {
    name: "اخبار و نظرات",
    menuItems: [
      {
        icon: <FaNewspaper className="w-5 h-5" />,
        label: "اخبار",
        route: "/news",
      },
      {
        icon: <FaComments className="w-5 h-5" />,
        label: "نظرات",
        route: "#",
        children: [
          { label: "نظرات دوره‌ها", route: "/comments" },
          { label: "نظرات اخبار", route: "/news-comments" },
        ],
      },
    ],
  },
  {
    name: "سرمایه‌گذاری",
    menuItems: [
      {
        icon: <FaChartLine className="w-5 h-5" />,
        label: "مدل‌های سرمایه‌گذاری",
        route: "#",
        children: [
          { label: "لیست مدل‌ها", route: "/investment-models" },
          { label: "صفحه مدل‌ها", route: "/investment-models-page" },
        ],
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 10.5C3.17 10.5 2.5 11.17 2.5 12C2.5 12.83 3.17 13.5 4 13.5C4.83 13.5 5.5 12.83 5.5 12C5.5 11.17 4.83 10.5 4 10.5ZM4 4.5C3.17 4.5 2.5 5.17 2.5 6C2.5 6.83 3.17 7.5 4 7.5C4.83 7.5 5.5 6.83 5.5 6C5.5 5.17 4.83 4.5 4 4.5ZM4 16.5C3.17 16.5 2.5 17.18 2.5 18C2.5 18.82 3.18 19.5 4 19.5C4.82 19.5 5.5 18.82 5.5 18C5.5 17.18 4.83 16.5 4 16.5ZM7 19H21V17H7V19ZM7 13H21V11H7V13ZM7 5V7H21V5H7Z"
              fill=""
            />
          </svg>
        ),
        label: "سبدهای سرمایه‌گذاری",
        route: "#",
        children: [
          { label: "لیست سبدها", route: "/investment-plans" },
          { label: "آیتم‌های طرح", route: "/investment-plan-items" },
          { label: "برچسب‌های سرمایه‌گذاری", route: "/investment-tags" },
        ],
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z"
              fill=""
            />
            <path
              d="M12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12Z"
              fill=""
            />
          </svg>
        ),
        label: "مشاوره کسب‌وکار",
        route: "/business-consulting",
      },
    ],
  },
  {
    name: "کاربران و تیم",
    menuItems: [
      {
        icon: <FaUsers className="w-5 h-5" />,
        label: "کاربران",
        route: "/users",
      },
      {
        icon: <FaUserTie className="w-5 h-5" />,
        label: "اعضای تیم",
        route: "/team-members",
      },
    ],
  },
  {
    name: "مالی",
    menuItems: [
      {
        icon: <FaShoppingCart className="w-5 h-5" />,
        label: "سفارشات",
        route: "/orders",
      },
      {
        icon: <FaMoneyBillWave className="w-5 h-5" />,
        label: "تراکنش‌ها",
        route: "/transactions",
      },
    ],
  },
  {
    name: "ارتباطات",
    menuItems: [
      {
        icon: <FaEnvelope className="w-5 h-5" />,
        label: "مشترکین خبرنامه",
        route: "/newsletter-subscribers",
      },
      {
        icon: <FaQuestionCircle className="w-5 h-5" />,
        label: "سوالات متداول",
        route: "/faqs",
      },
    ],
  },
  {
    name: "رسانه و آپلود",
    menuItems: [
      {
        icon: <FaImage className="w-5 h-5" />,
        label: "تصاویر",
        route: "/images",
      },
      {
        icon: <FaVideo className="w-5 h-5" />,
        label: "ویدیوها",
        route: "/videos",
      },
    ],
  },
  {
    name: "ابزارها و رابط کاربری",
    menuItems: [
      {
        icon: <FaMobileAlt className="w-5 h-5" />,
        label: "مراحل اسکرولر موبایل",
        route: "/home-landing/scroller",
      },
      {
        icon: <FaFileInvoice className="w-5 h-5" />,
        label: "آیتم‌های رزومه",
        route: "/resume-items",
      },
    ],
  },
  {
    name: "تنظیمات سیستم",
    menuItems: [
      {
        icon: <FaCog className="w-5 h-5" />,
        label: "تنظیمات",
        route: "/pages/settings",
      },
    ],
  },
  {
    name: "سایر",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z"
              fill=""
            />
            <path
              d="M2.00098 11.249C1.58676 11.249 1.25098 11.5848 1.25098 11.999C1.25098 12.4132 1.58676 12.749 2.00098 12.749L13.9735 12.749L12.0129 14.4296C11.6984 14.6991 11.662 15.1726 11.9315 15.4871C12.2011 15.8016 12.6746 15.838 12.9891 15.5685L16.4891 12.5685C16.6553 12.426 16.751 12.218 16.751 11.999C16.751 11.7801 16.6553 11.5721 16.4891 11.4296L12.9891 8.42958C12.6746 8.16002 12.2011 8.19644 11.9315 8.51093C11.662 8.82543 11.6984 9.2989 12.0129 9.56847L13.9735 11.249L2.00098 11.249Z"
              fill=""
            />
          </svg>
        ),
        label: "خروج",
        route: "/auth/logout",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <h3 className="text-4xl font-bold text-white">پیشرو</h3>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
