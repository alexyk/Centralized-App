// @flow
import type {
  AffiliateBooking,
  AffiliatesChartData,
  RevenueChartData
} from "../AffiliatesComponent.flow";

type AffiliateStats = {
  totalAffiliates: number,
  totalRevenue: number
};

export interface AffiliatesServiceInterface {
  getBookings(page: number): Promise<Array<AffiliateBooking>>;
  getGeneralAffiliateData(): Promise<AffiliateStats>;
  getChartData(): Promise<{
    affiliatesChartData: AffiliatesChartData,
    revenueChartData: RevenueChartData
  }>;
}
