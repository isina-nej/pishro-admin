// @/types/api.ts
/**
 * TypeScript types for API responses
 * Based on Prisma schema models
 */

import type {
  User,
  Course,
  Comment,
  Order,
  NewsArticle,
  NewsComment,
  DigitalBook,
  Category,
  Tag,
  FAQ,
  PageContent,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Transaction,
  Enrollment,
  NewsletterSubscriber,
  OrderItem,
  UserRole,
  CourseLevel,
  CourseStatus,
  OrderStatus,
  TransactionType,
  TransactionStatus,
  PageContentType,
  Language,
  FAQCategory,
  UserRoleType,
  QuestionType,
  HomeLanding,
  MobileScrollerStep,
  AboutPage,
  ResumeItem,
  TeamMember,
  Certificate,
  InvestmentConsulting,
  InvestmentPlans,
  InvestmentPlan,
  InvestmentTag,
} from '@prisma/client';

import type { ApiSuccessResponse, PaginatedData } from '@/lib/api-response';

// Re-export Prisma types
export type {
  User,
  Course,
  Comment,
  Order,
  NewsArticle,
  NewsComment,
  DigitalBook,
  Category,
  Tag,
  FAQ,
  PageContent,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Transaction,
  Enrollment,
  NewsletterSubscriber,
  OrderItem,
  UserRole,
  CourseLevel,
  CourseStatus,
  OrderStatus,
  TransactionType,
  TransactionStatus,
  PageContentType,
  Language,
  FAQCategory,
  UserRoleType,
  QuestionType,
  HomeLanding,
  MobileScrollerStep,
  AboutPage,
  ResumeItem,
  TeamMember,
  Certificate,
  InvestmentConsulting,
  InvestmentPlans,
  InvestmentPlan,
  InvestmentTag,
};

/**
 * Extended types with relations
 */

export interface UserWithRelations extends Omit<User, 'passwordHash'> {
  _count?: {
    comments: number;
    orders: number;
    enrollments: number;
    transactions: number;
    newsComments: number;
    quizAttempts: number;
  };
}

export interface CourseWithRelations extends Course {
  category?: Category | null;
  relatedTags?: Tag[];
  _count?: {
    comments: number;
    enrollments: number;
    orderItems: number;
    quizzes: number;
  };
}

export interface CommentWithRelations extends Comment {
  user?: Omit<User, 'passwordHash'> | null;
  course?: Course | null;
  category?: Category | null;
}

export interface NewsArticleWithRelations extends NewsArticle {
  relatedCategory?: Category | null;
  relatedTags?: Tag[];
  _count?: {
    comments: number;
  };
}

export interface DigitalBookWithRelations extends DigitalBook {
  relatedTags?: Tag[];
}

export interface CategoryWithRelations extends Category {
  tags?: Tag[];
  _count?: {
    courses: number;
    content: number;
    news: number;
    faqs: number;
    comments: number;
    quizzes: number;
  };
}

export interface TagWithRelations extends Tag {
  categories?: Category[];
  courses?: Course[];
  news?: NewsArticle[];
  books?: DigitalBook[];
}

export interface QuizWithRelations extends Quiz {
  course?: Course | null;
  category?: Category | null;
  questions?: QuizQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface OrderWithRelations extends Order {
  user?: Omit<User, 'passwordHash'> | null;
  orderItems?: OrderItem[];
  transactions?: Transaction[];
}

export interface TransactionWithRelations extends Transaction {
  user: Omit<User, 'passwordHash'>;
  order?: OrderWithRelations | null;
}

export interface EnrollmentWithRelations extends Enrollment {
  user: Omit<User, 'passwordHash'>;
  course: Course;
}

export interface QuizAttemptWithRelations extends QuizAttempt {
  quiz: Quiz;
  user: Omit<User, 'passwordHash'>;
}

/**
 * API Response Types
 */

// Users
export type UsersListResponse = ApiSuccessResponse<PaginatedData<UserWithRelations>>;
export type UserResponse = ApiSuccessResponse<UserWithRelations>;
export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string };
export type UpdateUserRequest = Partial<CreateUserRequest>;

// Courses
export type CoursesListResponse = ApiSuccessResponse<PaginatedData<CourseWithRelations>>;
export type CourseResponse = ApiSuccessResponse<CourseWithRelations>;
export type CreateCourseRequest = Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'categoryId' | 'tagIds'> & {
  categoryId?: string;
  tagIds?: string[];
};
export type UpdateCourseRequest = Partial<CreateCourseRequest>;

// Comments
export type CommentsListResponse = ApiSuccessResponse<PaginatedData<CommentWithRelations>>;
export type CommentResponse = ApiSuccessResponse<CommentWithRelations>;
export type CreateCommentRequest = Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'courseId' | 'categoryId' | 'likes' | 'dislikes' | 'views'> & {
  userId?: string;
  courseId?: string;
  categoryId?: string;
};
export type UpdateCommentRequest = Partial<CreateCommentRequest>;

// News Articles
export type NewsListResponse = ApiSuccessResponse<PaginatedData<NewsArticleWithRelations>>;
export type NewsResponse = ApiSuccessResponse<NewsArticleWithRelations>;
export type CreateNewsRequest = Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'categoryId' | 'tagIds' | 'views' | 'likes'> & {
  categoryId?: string;
  tagIds?: string[];
};
export type UpdateNewsRequest = Partial<CreateNewsRequest>;

// Digital Books
export type BooksListResponse = ApiSuccessResponse<PaginatedData<DigitalBookWithRelations>>;
export type BookResponse = ApiSuccessResponse<DigitalBookWithRelations>;
export type CreateBookRequest = Omit<DigitalBook, 'id' | 'createdAt' | 'updatedAt' | 'tagIds' | 'rating' | 'votes' | 'views' | 'downloads'> & {
  tagIds?: string[];
};
export type UpdateBookRequest = Partial<CreateBookRequest>;

// Categories
export interface StatsBox {
  title: string;
  value: string;
  icon: string;
}

export type CategoriesListResponse = ApiSuccessResponse<PaginatedData<CategoryWithRelations>>;
export type CategoryResponse = ApiSuccessResponse<CategoryWithRelations>;
export type CreateCategoryRequest = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'tagIds' | 'statsBoxes'> & {
  tagIds?: string[];
  statsBoxes: StatsBox[];
};
export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

// Tags
export type TagsListResponse = ApiSuccessResponse<PaginatedData<TagWithRelations>>;
export type TagResponse = ApiSuccessResponse<TagWithRelations>;
export type CreateTagRequest = Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'categoryIds' | 'courseIds' | 'newsIds' | 'bookIds' | 'usageCount' | 'clicks'>;
export type UpdateTagRequest = Partial<CreateTagRequest>;

// FAQs
export type FAQsListResponse = ApiSuccessResponse<PaginatedData<FAQ>>;
export type FAQResponse = ApiSuccessResponse<FAQ>;
export type CreateFAQRequest = Omit<FAQ, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'helpful' | 'notHelpful'>;
export type UpdateFAQRequest = Partial<CreateFAQRequest>;

// Page Content
export type PageContentsListResponse = ApiSuccessResponse<PaginatedData<PageContent>>;
export type PageContentResponse = ApiSuccessResponse<PageContent>;
export type CreatePageContentRequest = Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePageContentRequest = Partial<CreatePageContentRequest>;

// Quizzes
export type QuizzesListResponse = ApiSuccessResponse<PaginatedData<QuizWithRelations>>;
export type QuizResponse = ApiSuccessResponse<QuizWithRelations>;
export type CreateQuizRequest = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'courseId' | 'categoryId'> & {
  courseId?: string;
  categoryId?: string;
};
export type UpdateQuizRequest = Partial<CreateQuizRequest>;

// Quiz Questions
export type QuizQuestionsListResponse = ApiSuccessResponse<PaginatedData<QuizQuestion>>;
export type QuizQuestionResponse = ApiSuccessResponse<QuizQuestion>;
export type CreateQuizQuestionRequest = Omit<QuizQuestion, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuizQuestionRequest = Partial<CreateQuizQuestionRequest>;

// Quiz Attempts
export type QuizAttemptsListResponse = ApiSuccessResponse<PaginatedData<QuizAttemptWithRelations>>;
export type QuizAttemptResponse = ApiSuccessResponse<QuizAttemptWithRelations>;

// Orders
export type OrdersListResponse = ApiSuccessResponse<PaginatedData<OrderWithRelations>>;
export type OrderResponse = ApiSuccessResponse<OrderWithRelations>;
export type UpdateOrderRequest = Partial<Pick<Order, 'status' | 'paymentRef'>>;

// Transactions
export type TransactionsListResponse = ApiSuccessResponse<PaginatedData<TransactionWithRelations>>;
export type TransactionResponse = ApiSuccessResponse<TransactionWithRelations>;

// Enrollments
export type EnrollmentsListResponse = ApiSuccessResponse<PaginatedData<EnrollmentWithRelations>>;
export type EnrollmentResponse = ApiSuccessResponse<EnrollmentWithRelations>;
export type CreateEnrollmentRequest = {
  userId: string;
  courseId: string;
  progress?: number;
};
export type UpdateEnrollmentRequest = Partial<Pick<Enrollment, 'progress' | 'completedAt' | 'lastAccessAt'>>;

// Newsletter Subscribers
export type NewsletterSubscribersListResponse = ApiSuccessResponse<PaginatedData<NewsletterSubscriber>>;
export type NewsletterSubscriberResponse = ApiSuccessResponse<NewsletterSubscriber>;

/**
 * Query Parameters Types
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  search?: string;
}

export interface UsersQueryParams extends PaginationParams, SearchParams {
  role?: UserRole;
  phoneVerified?: boolean;
}

export interface CoursesQueryParams extends PaginationParams, SearchParams {
  categoryId?: string;
  published?: boolean;
  featured?: boolean;
  status?: CourseStatus;
  level?: CourseLevel;
}

export interface CommentsQueryParams extends PaginationParams, SearchParams {
  courseId?: string;
  categoryId?: string;
  published?: boolean;
  verified?: boolean;
  featured?: boolean;
}

export interface NewsQueryParams extends PaginationParams, SearchParams {
  categoryId?: string;
  published?: boolean;
  featured?: boolean;
}

export interface BooksQueryParams extends PaginationParams, SearchParams {
  category?: string;
  isFeatured?: boolean;
}

export interface CategoriesQueryParams extends PaginationParams, SearchParams {
  published?: boolean;
  featured?: boolean;
}

export interface TagsQueryParams extends PaginationParams, SearchParams {
  published?: boolean;
}

export interface FAQsQueryParams extends PaginationParams, SearchParams {
  categoryId?: string;
  faqCategory?: FAQCategory;
  published?: boolean;
  featured?: boolean;
}

export interface QuizzesQueryParams extends PaginationParams, SearchParams {
  courseId?: string;
  categoryId?: string;
  published?: boolean;
}

export interface OrdersQueryParams extends PaginationParams {
  userId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export interface TransactionsQueryParams extends PaginationParams {
  userId?: string;
  orderId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}

export interface EnrollmentsQueryParams extends PaginationParams {
  userId?: string;
  courseId?: string;
  completed?: boolean;
}

export interface QuizAttemptsQueryParams extends PaginationParams {
  quizId?: string;
  userId?: string;
  passed?: boolean;
}

/**
 * Dashboard Types
 */

export interface DashboardStatItem {
  value: number;
  growthRate: number; // decimal format: 0.43 = 43%
}

export interface DashboardStats {
  totalViews: DashboardStatItem;
  totalRevenue: DashboardStatItem;
  totalOrders: DashboardStatItem;
  totalUsers: DashboardStatItem;
}

export interface PaymentsData {
  months: string[];
  receivedAmount: number[];
  dueAmount: number[];
  totalReceived: number;
  totalDue: number;
}

export interface ProfitData {
  days: string[];
  sales: number[];
  revenue: number[];
}

export interface DevicesData {
  desktop: number;
  tablet: number;
  mobile: number;
  unknown: number;
  totalVisitors: number;
}

// Dashboard API Responses
export type DashboardStatsResponse = ApiSuccessResponse<DashboardStats>;
export type PaymentsDataResponse = ApiSuccessResponse<PaymentsData>;
export type ProfitDataResponse = ApiSuccessResponse<ProfitData>;
export type DevicesDataResponse = ApiSuccessResponse<DevicesData>;

// Dashboard Query Parameters
export interface PaymentsQueryParams {
  period?: 'monthly' | 'yearly';
}

export interface ProfitQueryParams {
  period?: 'this_week' | 'last_week';
}

export interface DevicesQueryParams {
  period?: 'monthly' | 'yearly';
}

/**
 * CMS Landing Pages Types
 */

// Home Landing - using Prisma type
export type HomeLandingListResponse = ApiSuccessResponse<PaginatedData<HomeLanding>>;
export type HomeLandingResponse = ApiSuccessResponse<HomeLanding>;
export type CreateHomeLandingRequest = Omit<HomeLanding, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHomeLandingRequest = Partial<CreateHomeLandingRequest>;

export interface HomeLandingQueryParams extends PaginationParams {
  published?: boolean;
}

// Mobile Scroller Steps - using Prisma type
export type MobileScrollerStepListResponse = ApiSuccessResponse<PaginatedData<MobileScrollerStep>>;
export type MobileScrollerStepResponse = ApiSuccessResponse<MobileScrollerStep>;
export type CreateMobileScrollerStepRequest = Omit<MobileScrollerStep, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMobileScrollerStepRequest = Partial<CreateMobileScrollerStepRequest>;

export interface MobileScrollerStepQueryParams extends PaginationParams {
  published?: boolean;
}

// About Page - using Prisma types
export interface AboutPageWithRelations extends AboutPage {
  resumeItems?: ResumeItem[];
  teamMembers?: TeamMember[];
  certificates?: Certificate[];
}

export type AboutPageListResponse = ApiSuccessResponse<PaginatedData<AboutPageWithRelations>>;
export type AboutPageResponse = ApiSuccessResponse<AboutPageWithRelations>;
export type CreateAboutPageRequest = Omit<AboutPage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAboutPageRequest = Partial<CreateAboutPageRequest>;

export interface AboutPageQueryParams extends PaginationParams {
  published?: boolean;
}

// Resume Items - using Prisma type
export type ResumeItemListResponse = ApiSuccessResponse<PaginatedData<ResumeItem>>;
export type ResumeItemResponse = ApiSuccessResponse<ResumeItem>;
export type CreateResumeItemRequest = Omit<ResumeItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateResumeItemRequest = Partial<CreateResumeItemRequest>;

export interface ResumeItemQueryParams extends PaginationParams, SearchParams {
  aboutPageId?: string;
  published?: boolean;
}

// Team Members - using Prisma type
export type TeamMemberListResponse = ApiSuccessResponse<PaginatedData<TeamMember>>;
export type TeamMemberResponse = ApiSuccessResponse<TeamMember>;
export type CreateTeamMemberRequest = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTeamMemberRequest = Partial<CreateTeamMemberRequest>;

export interface TeamMemberQueryParams extends PaginationParams, SearchParams {
  aboutPageId?: string;
  published?: boolean;
}

// Certificates - using Prisma type
export type CertificateListResponse = ApiSuccessResponse<PaginatedData<Certificate>>;
export type CertificateResponse = ApiSuccessResponse<Certificate>;
export type CreateCertificateRequest = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCertificateRequest = Partial<CreateCertificateRequest>;

export interface CertificateQueryParams extends PaginationParams, SearchParams {
  aboutPageId?: string;
  published?: boolean;
}

// Investment Consulting - using Prisma type
export type InvestmentConsultingListResponse = ApiSuccessResponse<PaginatedData<InvestmentConsulting>>;
export type InvestmentConsultingResponse = ApiSuccessResponse<InvestmentConsulting>;
export type CreateInvestmentConsultingRequest = Omit<InvestmentConsulting, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvestmentConsultingRequest = Partial<CreateInvestmentConsultingRequest>;

export interface InvestmentConsultingQueryParams extends PaginationParams {
  published?: boolean;
}

// Investment Plans - using Prisma types
export interface InvestmentPlansWithRelations extends InvestmentPlans {
  plans?: InvestmentPlan[];
  tags?: InvestmentTag[];
}

export type InvestmentPlansListResponse = ApiSuccessResponse<PaginatedData<InvestmentPlansWithRelations>>;
export type InvestmentPlansResponse = ApiSuccessResponse<InvestmentPlansWithRelations>;
export type CreateInvestmentPlansRequest = Omit<InvestmentPlans, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvestmentPlansRequest = Partial<CreateInvestmentPlansRequest>;

export interface InvestmentPlansQueryParams extends PaginationParams {
  published?: boolean;
}

// Investment Plan Items - using Prisma type
export type InvestmentPlanListResponse = ApiSuccessResponse<PaginatedData<InvestmentPlan>>;
export type InvestmentPlanResponse = ApiSuccessResponse<InvestmentPlan>;
export type CreateInvestmentPlanRequest = Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvestmentPlanRequest = Partial<CreateInvestmentPlanRequest>;

export interface InvestmentPlanQueryParams extends PaginationParams, SearchParams {
  investmentPlansId?: string;
  published?: boolean;
}

// Investment Tags - using Prisma type
export type InvestmentTagListResponse = ApiSuccessResponse<PaginatedData<InvestmentTag>>;
export type InvestmentTagResponse = ApiSuccessResponse<InvestmentTag>;
export type CreateInvestmentTagRequest = Omit<InvestmentTag, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvestmentTagRequest = Partial<CreateInvestmentTagRequest>;

export interface InvestmentTagQueryParams extends PaginationParams, SearchParams {
  investmentPlansId?: string;
  published?: boolean;
}
