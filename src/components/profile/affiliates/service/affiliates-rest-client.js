// @flow
import superagent from "superagent";
import moment from "moment";
import * as _ from "ramda";
import { AffiliatesServiceInterface } from "./affiliates-rest-client.flow";
import type {
  AffiliateBooking
  // RevenueChartData,
  // AffiliatesChartData
} from "../AffiliatesComponent.flow";

import mockedGeneralStats from "./example-responses/get-general-stats";
import { page1, page2, page3 } from "./example-responses/get-bookings";
import mockedChartData from "./example-responses/get-affiliate-revenue-chart-data";
const HOST = "https://dev.locktrip.com/api";

const requests = {
  async getBookings(_page = 1) {
    /*
    let page = _page - 1;
    let pages = [page1, page2, page3];
    return adaptBookings(pages[page]);
    */
    // real
    const query = `?page=${_page - 1}&size=20`;
    return superagent
      .get(`${HOST}/me/affiliates/bookings${query}`)
      .set("authorization", localStorage.getItem("rc.auth.locktrip"))
      .then(response => {
        if (!response.body) {
          return [];
        }
        return adaptBookings(response.body);
      });
  },
  async getGeneralAffiliateData() {
    //return mockedGeneralStats;
    return superagent
      .get(`${HOST}/me/affiliates/stats`)
      .set("authorization", localStorage.getItem("rc.auth.locktrip"))
      .then(response => {
        return response.body;
      });
  },
  async getChartData() {
    //return adaptChartData(mockedChartData);
    return superagent
      .get(`${HOST}/me/affiliates/statistics`)
      .set("authorization", localStorage.getItem("rc.auth.locktrip"))
      .then(response => {
        return response.body
          ? adaptChartData(response.body)
          : {
              affiliatesChartData: [],
              revenueChartData: []
            };
      });
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
  return {
    pagination: {
      totalElements: result.totalElements,
      pageSize: result.size
    },
    bookings
  };
}

function adaptChartData(response) {
  debugger;
  // let initialDate = moment(response.initialDate).subtract(1, "days");
  let initialDate = moment(response.initialDate)
    .utcOffset(0)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  let iu = moment(initialDate).unix();
  let today = moment();
  let totalDaysWithAffiliates = today.diff(initialDate, "days");

  let givenAffiliatesDailyStats = turnKeysIntoTimestamps(response.affiliates);
  let affiliatesChartData = _.times(i => {
    let stamp = moment(initialDate)
      .add(i, "days")
      .unix();
    let affiliates = givenAffiliatesDailyStats[stamp] || 0;
    return [i, affiliates];
  }, totalDaysWithAffiliates + 1);

  let givenRevenueDailyStats = turnKeysIntoTimestamps(response.revenue);
  let revenueChartData = _.times(i => {
    let stamp = moment(initialDate)
      .add(i, "days")
      .unix();
    let revenue = givenRevenueDailyStats[stamp] || 0;
    return [i, revenue];
  }, totalDaysWithAffiliates + 1);

  function turnKeysIntoTimestamps(originalObject) {
    return Object.keys(originalObject).reduce((acc, date) => {
      let initialDate = moment.utc(date);
      let iu = moment(initialDate).unix();
      return {
        ...acc,
        [iu]: originalObject[date]
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
