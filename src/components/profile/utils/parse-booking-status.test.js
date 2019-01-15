import { parseBookingStatus } from "./parse-booking-status";

const STATUSES = {
  DONE: "COMPLETE",
  CONFIRMED: "PENDING",
  FAIL: "BOOKING FAILED",
  FAILED: "BOOKING FAILED",
  PENDING: "PENDING",
  QUEUED: "PENDING",
  QUEUED_FOR_CONFIRMATION: "PENDING",
  CANCELLED: "CANCELLED",
  PENDING_SAFECHARGE_CONFIRMATION: "PENDING"
};

describe("parseBookingStatus", () => {
  describe("visualizes status correctly", () => {
    test(`default status - BOOKING FAILED`, async () => {
      let value1 = parseBookingStatus("unknown");
      expect(value1).toBe(STATUSES["FAIL"]);

      let value2 = parseBookingStatus();
      expect(value2).toBe(STATUSES["FAIL"]);
    });

    Object.keys(STATUSES).forEach(status => {
      test(`${status} status - ${STATUSES[status]}`, async () => {
        let value = parseBookingStatus(status);
        expect(value).toBe(STATUSES[status]);
      });
    });
  });
});
