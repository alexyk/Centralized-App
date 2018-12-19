// @flow
import { AffiliatesServiceInterface } from "./affiliates-rest-client.flow";
import type {
  AffiliateBooking
  // RevenueChartData,
  // AffiliatesChartData
} from "../AffiliatesComponent.flow";

const AffiliatesService: AffiliatesServiceInterface = {
  getBookings(page) {
    let list = createAListOf(20, page * 20);
    return Promise.resolve(list);
  },
  getChartData() {
    return Promise.resolve({
      revenueChartData: generateChartData(),
      affiliatesChartData: generateChartData()
    });
  },

  getGeneralAffiliateData() {
    return Promise.resolve({
      totalAffiliates: 21,
      totalRevenue: 225.5,
      affiliateBookings: createAListOf(20, 1)
    });
  }
};

export { AffiliatesService };

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
