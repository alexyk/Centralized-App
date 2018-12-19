// @flow
import superagent from "superagent";
import moment from "moment";
import * as _ from "ramda";
import { AffiliatesServiceInterface } from "./affiliates-rest-client.flow";
import { mockedRequests } from "./affiliates-rest-client-mocks";

import { Config } from "../../../../config";
// const HOST = "https://dev.locktrip.com/api";
const HOST = Config.getValue("apiHost");

const _request = getRequests();
const _adapters = getAdapters();

export class AffiliatesServiceClass {
  constructor(requests = _request, adapters = _adapters) {
    this.requests = requests;
    this.adapters = adapters;
  }

  async getBookings(page) {
    // let a = await mockedRequests.getBookings(page);
    // return this.adapters.getBookings(a);
    let response = await this.requests.getBookings(page);
    return this.adapters.getBookings(response);
  }

  async getChartData() {
    let response = await this.requests.getChartData();
    return this.adapters.getChartData(response);
  }

  async getGeneralAffiliateData() {
    let response = await this.requests.getGeneralAffiliateData();
    return this.adapters.getGeneralAffiliateData(response);
  }
}

function getRequests() {
  return {
    async getBookings(_page = 1) {
      const query = `?page=${_page - 1}&size=20`;
      return superagent
        .get(`${HOST}/me/affiliates/bookings${query}`)
        .set("authorization", localStorage.getItem("rc.auth.locktrip"));
    },
    async getGeneralAffiliateData() {
      return superagent
        .get(`${HOST}/me/affiliates/stats`)
        .set("authorization", localStorage.getItem("rc.auth.locktrip"));
    },
    async getChartData() {
      return superagent
        .get(`${HOST}/me/affiliates/statistics`)
        .set("authorization", localStorage.getItem("rc.auth.locktrip"));
    }
  };
}

export function getAdapters() {
  return {
    getGeneralAffiliateData(response) {
      if (!response.body) {
        return {
          totalAffiliates: 0,
          totalRevenue: 0
        };
      }
      return {
        totalAffiliates: response.body.totalAffiliatesLevelOne,
        totalRevenue: response.body.totalRevenueLevelOne
      };
    },

    getBookings(response) {
      if (!response.body) {
        return [];
      }
      let body = response.body;

      let bookings = (body.content || []).map(booking => {
        return {
          affiliateId: booking.id,
          revenue: booking.revenue,
          date: moment(booking.date).format("DD/MM/YYYY") // format is MM/YYYY
        };
      });

      return {
        pagination: {
          totalElements: body.totalElements,
          pageSize: body.size
        },
        bookings
      };
    },
    getChartData(response, _today) {
      let body = response.body;
      if (!body) {
        return {
          affiliatesChartData: [],
          revenueChartData: []
        };
      }
      if (!body.initialDate) {
        return {
          affiliatesChartData: [],
          revenueChartData: []
        };
      }

      let initialDate = moment(body.initialDate)
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      let today = moment(_today || undefined);
      let totalDaysWithAffiliates = today.diff(initialDate, "days");

      let givenAffiliatesDailyStats = turnKeysIntoTimestamps(body.affiliates);
      let affiliatesChartData = _.times(i => {
        let stamp = moment(initialDate)
          .add(i, "days")
          .unix();
        let affiliates = givenAffiliatesDailyStats[stamp] || 0;
        return [i, affiliates];
      }, totalDaysWithAffiliates + 1);

      let givenRevenueDailyStats = turnKeysIntoTimestamps(body.revenue);
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
  };
}

export const AffiliatesService: AffiliatesServiceInterface = new AffiliatesServiceClass();
