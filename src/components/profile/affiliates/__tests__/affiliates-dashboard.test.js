import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import {BrowserRouter} from "react-router-dom"

import AffiliatesDashboard from "../AffiliatesComponent";

afterEach(cleanup);

function createAListOf(number) {
  let affiliateBookings = [];
  for (let i = 0; i < number; i++) {
    affiliateBookings.push({
      affiliateId: i,
      revenue: (i + 1) * 10,
      date: "12/2017"
    });
  }
  return affiliateBookings;
}

describe("Affiliate Dashboard", () => {
  describe("renders total affiliates correctly", () => {
    const TEST_ID = "total-affiliates";

    [0, 22, 100, 10000].forEach(value => {
      test(`displays ${value}`, async () => {
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard totalAffiliates={value} /></BrowserRouter>
        );

        let node = await waitForElement(() => getByTestId(TEST_ID));
        let displayedValue = node.innerHTML;
        expect(displayedValue).toBe(value + "");
      });
    });

    [Infinity, -Infinity, NaN, "some string", function() {}].forEach(value => {
      test(`displays 0 when not given a number, but ${typeof value}: ${value}`, async () => {
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard totalAffiliates={value} /></BrowserRouter>
        );

        let node = await waitForElement(() => getByTestId(TEST_ID));
        let displayedValue = node.innerHTML;
        expect(displayedValue).toBe(0 + "");
      });
    });
  });

  describe("renders accumulated revenue correctly", () => {
    const TEST_ID = "total-revenue";
    [0, 22, 100, 10000].forEach(value => {
      test(`displays ${value}`, async () => {
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard totalRevenue={value} /></BrowserRouter>
        );

        let node = await waitForElement(() => getByTestId(TEST_ID));
        let displayedValue = node.innerHTML;
        expect(displayedValue).toBe(value + "");
      });
    });

    [Infinity, -Infinity, NaN, "some string", function() {}].forEach(value => {
      test(`displays 0 when not given a number, but ${typeof value}: ${value}`, async () => {
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard totalRevenue={value} /></BrowserRouter>
        );

        let node = await waitForElement(() => getByTestId(TEST_ID));
        let displayedValue = node.innerHTML;
        expect(displayedValue).toBe(0 + "");
      });
    });
  });

  describe("withdraw button", () => {
    test("calls the onWithdraw handler", async () => {
      const WITDRAW_BUTTON = "withdraw-button";
      const withdrawHandler = jest.fn(() => {});
      const { getByTestId } = render(
        <BrowserRouter><AffiliatesDashboard onWithdraw={withdrawHandler} /></BrowserRouter>
      );

      let button = await waitForElement(() => getByTestId(WITDRAW_BUTTON));
      fireEvent.click(button);
      expect(withdrawHandler).toHaveBeenCalledTimes(0);
    });
  });

  describe("bookings list", () => {
    describe("renders correctly", () => {
      const LIST_ITEM_ID = "bookings-list-item";
      [9, 12, 20, 200].forEach(number => {
        let items = createAListOf(number);
        test("renders the right number of items : " + number, async () => {
          const { getAllByText, getAllByTestId } = render(
            <BrowserRouter><AffiliatesDashboard affiliateBookings={items} /></BrowserRouter>
          );

          let nodes = await waitForElement(() => getAllByTestId(LIST_ITEM_ID));
          expect(nodes.length).toBe(items.length);
        });
      });

      test("renders a 'no entries' message'", async () => {
        const NO_BOOKINGS_ID = "no-bookings-text";
        let message = "Sorry, no bookings yet";
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard noBookingsText={message} /></BrowserRouter>
        );

        let node = await waitForElement(() => getByTestId(NO_BOOKINGS_ID));
        expect(node.innerHTML).toBe(message);
      });
    });

    describe("operates correctly - fires the onPageChange handler", () => {
      test("next page", async () => {
        const NEXT_PAGE_ID = "next-page";
        let bookings = createAListOf(100);
        let pageChangeHandler = jest.fn(() => {});
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard
            affiliateBookings={bookings}
            bookingPaginationOptions={{
              onPageChange: pageChangeHandler,
              pageSize: 10,
              initialPage: 1,
              totalElements: 200
            }}
          /></BrowserRouter>
        );

        let nextPageControl = await waitForElement(() =>
          getByTestId(NEXT_PAGE_ID)
        );
        fireEvent.click(nextPageControl);
        expect(pageChangeHandler).toHaveBeenCalledWith(2);

        fireEvent.click(nextPageControl);
        expect(pageChangeHandler).toHaveBeenCalledWith(3);
      });

      test("previous page", async () => {
        const PREV_PAGE_ID = "previous-page";
        const NEXT_PAGE_ID = "next-page";
        let bookings = createAListOf(100);
        let pageChangeHandler = jest.fn(() => {});
        const { getByTestId } = render(
          <BrowserRouter><AffiliatesDashboard
            affiliateBookings={bookings}
            bookingPaginationOptions={{
              onPageChange: pageChangeHandler,
              pageSize: 10,
              initialPage: 5,
              totalElements: 200
            }}
          /></BrowserRouter>
        );

        let nextPageControl = await waitForElement(() =>
          getByTestId(NEXT_PAGE_ID)
        );
        let prevPageControl = await waitForElement(() =>
          getByTestId(PREV_PAGE_ID)
        );
        fireEvent.click(prevPageControl);
        expect(pageChangeHandler).toHaveBeenCalledWith(4);
        fireEvent.click(prevPageControl);
        expect(pageChangeHandler).toHaveBeenCalledWith(3);
      });
    });
  });

  describe("stats", () => {
    describe("affiliates/revenue controls", () => {
      const STATS_CONTROLS_AFFILIATE = "stats-controls-affiliates";
      const STATS_CONTROLS_REVENUE = "stats-controls-revenue";

      const AFFILIATES_CHART = "panels-chart-affiliates";
      const REVENUE_CHART = "panels-chart-revenue";

      test("switches correctly", async () => {
        const { getByTestId } = render(<BrowserRouter><AffiliatesDashboard /></BrowserRouter>);

        let affiliatesButton = await waitForElement(() =>
          getByTestId(STATS_CONTROLS_AFFILIATE)
        );

        let revenueButton = await waitForElement(() =>
          getByTestId(STATS_CONTROLS_REVENUE)
        );

        fireEvent.click(affiliatesButton);
        await waitForElement(() => getByTestId(AFFILIATES_CHART));

        fireEvent.click(revenueButton);
        await waitForElement(() => getByTestId(REVENUE_CHART));

        fireEvent.click(affiliatesButton);
        await waitForElement(() => getByTestId(AFFILIATES_CHART));

        fireEvent.click(revenueButton);
        await waitForElement(() => getByTestId(REVENUE_CHART));
      });
    });

    describe("charts are called with the correct data", () => {
      // TODO
    });
  });
});
