// @flow
import superagent from "superagent";
import moment from "moment";
import * as _ from "ramda";
import { AffiliatesServiceInterface } from "./affiliates-rest-client.flow";
import type {
  AffiliateBooking,
  RevenueChartData,
  AffiliatesChartData
} from "../AffiliatesComponent.flow";

import mockedGeneralStats from "./example-responses/get-general-stats";
import { page1, page2, page3 } from "./example-responses/get-bookings";
import mockedChartData from "./example-responses/get-affiliate-revenue-chart-data";
const HOST = "";

const requests = {
  async getBookings(_page = 1) {
    let page = _page - 1;
    let pages = [page1, page2, page3];
    return adaptBookings(pages[page]);
    // real
    const query = `?page=${page}&size=20`;
    return superagent
      .get(`${HOST}/me/affiliates/bookings${query}`)
      .then(response => {
        return adaptBookings(response);
      });
  },
  async getGeneralAffiliateData() {
    return mockedGeneralStats;
    return superagent.get(`${HOST}/me/affiliates/stats`);
  },
  async getChartData() {
    return adaptChartData(mockedChartData);
    return superagent
      .get(`${HOST}me/affiliates/statistics`)
      .then(adaptChartData);
  }
};

function adaptBookings(response) {
  let bookings = (response.content || []).map(booking => {
    return {
      affiliateId: booking.id,
      revenue: booking.revenue,
      date: booking.date // format is MM/YYYY
    };
  });

  let result = _.omit(["content"], response);
  result.bookings = bookings;

  return result;
}

function adaptChartData(response) {
  debugger;
  let initialDate = moment.utc(response.initialDate);
  let today = moment();
  let totalDaysWithAffiliates = today.diff(initialDate, "days");

  let givenAffiliatesDailyStats = turnKeysIntoTimestamps(response.affiliates);
  let affiliatesChartData = _.times(i => {
    let stamp = initialDate.add(i, "days").utc();
    let affiliates = givenAffiliatesDailyStats[stamp] || 0;
    return [i, affiliates];
  }, totalDaysWithAffiliates);

  let givenRevenueDailyStats = turnKeysIntoTimestamps(response.revenue);
  let revenueChartData = _.times(i => {
    let stamp = initialDate.add(i, "days").time();
    let revenue = givenRevenueDailyStats[stamp] || 0;
    return [i, revenue];
  }, totalDaysWithAffiliates);

  function turnKeysIntoTimestamps(originalObject) {
    return Object.keys(originalObject).reduce((acc, date) => {
      return {
        ...acc,
        [new Date(date).getTime()]: originalObject[date]
      };
    }, {});
  }
  let result = {
    affiliatesChartData: affiliatesChartData,
    revenueChartData: revenueChartData
  };

  return result;
}

const AffiliatesService: AffiliatesServiceInterface = {
  getBookings(page) {
    return requests.getBookings(page);
  },
  getChartData() {
    return requests.getChartData();
  },

  getGeneralAffiliateData() {
    return requests.getGeneralAffiliateData();
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
