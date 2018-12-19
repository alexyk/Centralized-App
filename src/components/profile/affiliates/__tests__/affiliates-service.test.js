import referralIdPersister from "../service/persist-referral-id";
import { mockedRequests } from "../service/affiliates-rest-client-mocks";
import {
  AffiliatesServiceClass,
  getAdapters
} from "../service/affiliates-rest-client";

import { page1 } from "../service/example-responses/get-bookings";
import moment from "moment";

describe("services", () => {
  describe("rest client", () => {
    describe("adapters", () => {
      const adapters = getAdapters();

      describe("getBookings", () => {
        const page1 = {
          content: [
            {
              id: 0,
              date: 1539698779000,
              revenue: 10
            },
            {
              id: 1,
              date: 1539698779000,
              revenue: 12
            },
            {
              id: 3,
              date: 1539698779000,
              revenue: 14
            },
            {
              id: 4,
              date: 1539698779000,
              revenue: 16
            },
            {
              id: 5,
              date: 1539698779000,
              revenue: 10
            },
            {
              id: 6,
              date: 1539698779000,
              revenue: 12
            },
            {
              id: 7,
              date: 1539698779000,
              revenue: 14
            },
            {
              id: 8,
              date: 1539698779000,
              revenue: 16
            },
            {
              id: 9,
              date: 1539698779000,
              revenue: 10
            },
            {
              id: 10,
              date: 1539698779000,
              revenue: 12
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
        let DDMMYYYY = moment(1539698779000)
          .format("DD/MM/YYYY")
          .toString();
        test("page 1", async () => {
          let adaptedPageResponse = adapters.getBookings({ body: page1 });
          expect(adaptedPageResponse.bookings.length).toBe(10);
          adaptedPageResponse.bookings.forEach(bk => {
            expect(bk.date).toBe(DDMMYYYY);
          });
          expect(adaptedPageResponse.pagination.pageSize).toBe(10);
          expect(adaptedPageResponse.pagination.totalElements).toBe(22);
        });
      });

      describe("getChartData", () => {
        const response = {
          body: {
            initialDate: new Date("2018-12-10T00:00:00.000+0000").getTime(), //1544400000000
            affiliates: {
              "2018-12-15T00:00:00.000+0000": 1,
              "2018-12-17T00:00:00.000+0000": 2
            },
            revenue: {
              "2018-12-15T00:00:00.000+0000": 12.12,
              "2018-12-17T00:00:00.000+0000": 34.55
            }
          }
        };
        let today = "2018-12-18T00:00:00.000+0000";
        let affiliatesPerDays = [0, 0, 0, 0, 0, 1, 0, 2, 0, 0];
        let revenuePerDays = [0, 0, 0, 0, 0, 12.12, 0, 34.55, 0, 0];

        test("correct number of days", async () => {
          let adaptedResponse = adapters.getChartData(response, today);
          let { affiliatesChartData, revenueChartData } = adaptedResponse;
          expect(affiliatesChartData.length).toBe(9);
          expect(revenueChartData.length).toBe(9);
        });

        test("correct numbers in affiliates", async () => {
          let adaptedResponse = adapters.getChartData(response, today);
          let { affiliatesChartData, revenueChartData } = adaptedResponse;

          affiliatesChartData.forEach((cd, i) => {
            let [day, affiliates] = cd;
            expect(day).toBe(i);
            expect(affiliatesPerDays[i]).toBe(affiliates);
          });
        });

        test("correct numbers in revenues", async () => {
          let adaptedResponse = adapters.getChartData(response, today);
          let { affiliatesChartData, revenueChartData } = adaptedResponse;

          revenueChartData.forEach((cd, i) => {
            let [day, revenue] = cd;
            expect(day).toBe(i);
            expect(revenuePerDays[i]).toBe(revenue);
          });
        });
      });
    });
  });
  describe("local storage - referral id", () => {
    test("", async () => {});
  });
});
