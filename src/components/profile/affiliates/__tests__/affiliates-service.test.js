import referralIdPersister from "../service/persist-referral-id";
import { mockedRequests } from "../service/affiliates-rest-client-mocks";
import {
  AffiliatesServiceClass,
  getAdapters
} from "../service/affiliates-rest-client";

describe("services", () => {
  describe("rest client", () => {
    describe("adapters", () => {
      const adapters = getAdapters();

      describe("getBookings", () => {
        test("", async () => {});
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
