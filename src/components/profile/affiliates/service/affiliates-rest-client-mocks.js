import type { AffiliateBooking } from "../AffiliatesComponent.flow";
import mockedGeneralStats from "./example-responses/get-general-stats";
import { page1, page2, page3 } from "./example-responses/get-bookings";
import mockedChartData from "./example-responses/get-affiliate-revenue-chart-data";

export const mockedRequests = {
  async getBookings(_page = 1) {
    return [page1, page2, page3][_page - 1];
  },
  async getGeneralAffiliateData() {
    return mockedGeneralStats;
  },
  async getChartData() {
    return mockedChartData;
  }
};

/**
 * Stubbed Data
 */
function createAListOf(number: number, from: number): Array<AffiliateBooking> {
  let affiliateBookings = [];
  for (let i: number = from; i < from + number; i++) {
    affiliateBookings.push({
      affiliateId: from + i,
      revenue: (from + i + 1) * 10,
      date: "12/2017"
    });
  }
  return affiliateBookings;
}

function generateChartData() {
  let data = [];
  for (let i = 1; i < 50; i++) {
    data.push([i, Math.random() * 100]);
  }
  return data;
}
