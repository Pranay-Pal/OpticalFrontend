// Centralized TypeScript types for Shop Admin endpoints

// DASHBOARD METRICS
export interface ShopAdminMetrics {
  today: {
    sales: number;
    orders: number;
    patients: number;
    staff: number;
  };
  monthly: {
    sales: number;
    orders: number;
    salesGrowth: number; // percentage +/-
    orderGrowth: number; // percentage +/-
  };
  inventory: {
    totalProducts: number;
    lowStockAlerts: number;
  };
  cached?: boolean;
  // Allow the backend to add extra fields without breaking the UI
  [key: string]: unknown;
}

// DASHBOARD GROWTH
export type GrowthPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface GrowthItem {
  // Label for the period item (e.g., '2025-09-01', 'Week 38', 'Sep 2025', '2025')
  period: string;
  sales: number;
  orders: number;
  patients: number;
}

// Some backends may return an array, some an object keyed by index/date
export type GrowthResponse = GrowthItem[] | Record<string, GrowthItem>;

// DASHBOARD ACTIVITIES
export interface ActivityItem {
  type: string; // e.g., 'sales' | 'orders' | 'patients' | 'inventory' | 'alert'
  message: string;
  amount?: number;
  timestamp: string; // ISO string
  [key: string]: unknown;
}

export interface ActivitiesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ActivitiesResponse =
  | ActivityItem[]
  | {
      activities: ActivityItem[];
      pagination?: ActivitiesPagination;
      cached?: boolean;
      [key: string]: unknown;
    };
