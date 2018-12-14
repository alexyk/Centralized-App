// @flow
import superagent from "superagen";
import moment from "moment";
import * as _ from "ramda";
import { AffiliatesServiceInterface } from "./affiliates-rest-client.flow";
import type {
  AffiliateBooking,
  RevenueChartData,
  AffiliatesChartData
} from "../AffiliatesComponent.flow";

const HOST = "";

const requests = {
  getBookings(page) {
    let resp = {
      content: [
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        },
        {
          id: 2,
          date: 1539698779000,
          revenue: 0
        }
      ],
      totalPages: 3,
      totalElements: 22,
      last: false,
      size: 10,
      number: 0,
      sort: null,
      first: true,
      numberOfElements: 10
    };

    const query = `?page=${page}&size=20`;
    return superagent
      .get(`${HOST}/me/affiliates/bookings${query}`)
      .then(response => {
        let bookings = (response.content || []).map(booking => {
          return {
            affiliateId: booking.id,
            revenue: booking.revenue,
            date: booking.date // format is MM/YYYY
          };
        });
      });
  },
  getGeneralAffiliateData() {
    return superagent.get(`${HOST}/me/affiliates/stats`).then(response => {
      return {
        totalRevenue: response.totalRevenue,
        totalAffiliates: response.totalAffiliates
      };
    });
  },
  getChartData() {
    return superagent.get(`${HOST}me/affiliates/statistics`).then(response => {
      // let example = {
      //   initialDate: new Date("2018-12-02T00:00:00.000+0000").getTime(),
      //   affiliates: {
      //     "2018-12-10T00:00:00.000+0000": 1,
      //     "2018-12-14T00:00:00.000+0000": 2
      //   },
      //   revenue: {
      //     "2018-10-16T00:00:00.000+0000": 0
      //   }
      // };

      let initialData = moment(response.initialData);
      let today = moment();
      let totalDaysWithAffiliates = today.diff(initialData, "days");

      let givenAffiliatesDailyStats = turnKeysIntoTimestamps(
        response.affiliates
      );
      let affiliatesChartData = _.times(i => {
        let stamp = initialData.add(i, "days").time();
        let affiliates = givenAffiliatesDailyStats[stamp] || 0;
        return [i, 0];
      }, totalDaysWithAffiliates);

      let givenRevenueDailyStats = turnKeysIntoTimestamps(response.revenue);
      let revenueChartData = _.times(i => {
        let stamp = initialData.add(i, "days").time();
        let affiliates = givenRevenueDailyStats[stamp] || 0;
        return [i, 0];
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
    });
  }
};

const AffiliatesService: AffiliatesServiceInterface = {
  getBookings(page) {
    return requests.getBookings(page);
    // let list = createAListOf(20, page * 20);
    // return Promise.resolve(list);
  },
  getChartData() {
    return requests.getChartData();

    return Promise.resolve({
      revenueChartData: generateChartData(),
      affiliatesChartData: generateChartData()
    });
  },

  getGeneralAffiliateData() {
    return requests.getGeneralAffiliateData();

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
