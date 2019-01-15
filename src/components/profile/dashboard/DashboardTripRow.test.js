import DashboardTripRow from "./DashboardTripRow";
import React from "react";
import { render, cleanup, waitForElement } from "react-testing-library";

afterEach(cleanup);

describe("DashboardTripRow", () => {
  describe("visualizes status correctly", () => {
    const BOKKING_VALUE = "some value";

    const mockedProps = {
      getHostName: () => "",
      parseBookingStatus: jest.fn(() => BOKKING_VALUE),
      parseAccommodationDates: () => {
        return {
          startDate: {
            date: "",
            month: "",
            year: "",
            day: ""
          },
          endDate: {
            date: "",
            month: "",
            year: "",
            day: ""
          }
        };
      }
    };

    const TEST_ID = "status-field";
    test(`displays the value from 'parseBookingStatus'`, async () => {
      const { getByTestId } = render(
        <DashboardTripRow {...mockedProps} trip={{}} />
      );
      let node = await waitForElement(() => getByTestId(TEST_ID));
      let displayedValue = node.innerHTML;
      expect(displayedValue).toBe(BOKKING_VALUE);
    });
  });
});
