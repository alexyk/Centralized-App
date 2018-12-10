// @flow

export type AffiliatesChartData = Array<Array<number>>;
export type RevenueChartData = Array<Array<number>>;

export type AffiliateBooking = {
  affiliateId: number,
  revenue: number,
  date: string // format is MM/YYYY
};

export type Props = {
  totalAffiliates: number,
  totalRevenue: number,
  affiliateBookings: Array<AffiliateBooking>,
  noBookingsText: string,
  onPageChange: Function,
  onWithdraw: Function,
  affiliatesChartData: AffiliatesChartData,
  revenueChartData: RevenueChartData
};
