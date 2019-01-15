import { parseAccommodationDates } from "./parse-accomodation-dates";

describe("parseAccommodationDates", () => {
  describe("works with correct arrivalTime and nights", () => {
    const arrivalDate = 1552089600000;
    const nights = 4;
    it("start date is correct", () => {
      let result = parseAccommodationDates(arrivalDate, nights);
      expect(result.startDate).toEqual({
        date: "09",
        month: "Mar",
        year: "2019",
        day: "Sat"
      });
    });
    it("end date is correct", () => {
      let result = parseAccommodationDates(arrivalDate, nights);
      expect(result.endDate).toEqual({
        date: "13",
        month: "Mar",
        year: "2019",
        day: "Wed"
      });
    });

    describe("throws with incorrect values", () => {
      it("when 'arrivalTime' is undefined", () => {
        expect(function() {
          parseAccommodationDates(undefined, 10);
        }).toThrow(Error);
      });

      it("when arrivalTime is not a timestamp", () => {
        const arrivalDate = "";
        const nights = 4;
        expect(function() {
          parseAccommodationDates(arrivalDate, nights);
        }).toThrow(Error);
      });

      it("when arrivalTime is not set to 00:00h", () => {
        const goodArrivalDate = new Date(
          "Tue Jan 08 2019 00:00:00 GMT"
        ).getTime();
        const badArrivalDate = new Date(
          "Tue Jan 08 2019 14:54:08 GMT+0200"
        ).getTime();
        const nights = 4;
        expect(function() {
          parseAccommodationDates(goodArrivalDate, nights);
        }).not.toThrow(Error);
        expect(function() {
          parseAccommodationDates(badArrivalDate, nights);
        }).toThrow(Error);
      });

      it("when nights is not a number greater than zero", () => {
        const arrivalDate = 1552089600000;
        expect(function() {
          parseAccommodationDates(arrivalDate, 0);
        }).toThrow(Error);
        expect(function() {
          parseAccommodationDates(arrivalDate, NaN);
        }).toThrow(Error);
      });
    });
  });

  describe("works with correct arrivalTime and leavingTime", () => {
    const arrivalTime = 1552089600000; //"Sat, 09 Mar 2019 00:00:00 GMT"
    const badTime = 1552478400000; //"Wed, 13 Mar 2019 12:00:00 GMT"
    const goodTime = 1552435200000; //"Wed, 13 Mar 2019 00:00:00 GMT"
    it("start date is correct", () => {
      let result = parseAccommodationDates(arrivalTime, null, goodTime);
      expect(result.startDate).toEqual({
        date: "09",
        month: "Mar",
        year: "2019",
        day: "Sat"
      });
    });
    it("end date is correct", () => {
      let result = parseAccommodationDates(arrivalTime, null, goodTime);
      expect(result.endDate).toEqual({
        date: "13",
        month: "Mar",
        year: "2019",
        day: "Wed"
      });
    });

    describe("throws with incorrect values", () => {
      const arrivalTime = 1552089600000; //"Sat, 09 Mar 2019 00:00:00 GMT"

      it("when leavingTime is not a timestamp", () => {
        let badTime = "";
        expect(function() {
          parseAccommodationDates(arrivalTime, null, badTime);
        }).toThrow(Error);
      });

      it("when leavingTime is not set to 00:00h", () => {
        expect(function() {
          parseAccommodationDates(arrivalTime, null, goodTime);
        }).not.toThrow(Error);
        expect(function() {
          parseAccommodationDates(arrivalTime, null, badTime);
        }).toThrow(Error);
      });
    });
  });
});
