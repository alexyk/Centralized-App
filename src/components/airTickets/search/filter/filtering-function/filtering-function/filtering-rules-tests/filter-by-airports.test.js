import { filterByAirports } from "../filtering-function";
import * as _ from "ramda";

describe("filterByAirports", () => {
  describe("testing with filters for one city", () => {
    //  { airportId: "LCY", airportName: "London City Arpt" },
    //  { airportId: "LHR", airportName: "London Heathrow" }

    let flights = [
      {
        id: "5ca346876ddc006486ea329f", // Airports - SOFIA: SOF | IST | LONDON: LHR, LGW | MAD, TXL
        price: { currency: "EUR", total: 200.0 },
        segments: [
          {
            group: "0",
            carrier: { name: "Blue Air" },
            origin: {
              code: "SOF",
              name: "Sofia",
              date: "2019-04-03",
              time: "16:05",
              timeZone: "+03:00",
              terminal: "2"
            },
            destination: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-03",
              time: "17:20",
              timeZone: "+03:00",
              terminal: "I"
            },
            flightTime: 75,
            journeyTime: 400,
            waitTime: 75
          },
          {
            group: "0",
            carrier: { name: "Blue Air" },
            origin: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-03",
              time: "18:35",
              timeZone: "+03:00",
              terminal: "I"
            },
            destination: {
              code: "LHR",
              name: "London Heathrow",
              date: "2019-04-03",
              time: "20:45",
              timeZone: "+01:00",
              terminal: "2"
            },
            flightTime: 250,
            journeyTime: 400,
            waitTime: null
          },
          {
            group: "1",
            carrier: { name: "Blue Air" },
            origin: {
              code: "LGW",
              name: "London Gatwick",
              date: "2019-04-04",
              time: "11:50",
              timeZone: "+01:00",
              terminal: "S"
            },
            destination: {
              code: "AYT",
              name: "Antalya",
              date: "2019-04-04",
              time: "18:15",
              timeZone: "+03:00",
              terminal: "1"
            },
            flightTime: 265,
            journeyTime: 1305,
            waitTime: 245
          },
          {
            group: "1",
            carrier: { name: "Blue Air" },
            origin: {
              code: "AYT",
              name: "Antalya",
              date: "2019-04-04",
              time: "22:20",
              timeZone: "+03:00",
              terminal: "D"
            },
            destination: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-04",
              time: "23:50",
              timeZone: "+03:00",
              terminal: "D"
            },
            flightTime: 90,
            journeyTime: 1305,
            waitTime: 435
          },
          {
            group: "1",
            carrier: { name: "Blue Air" },
            origin: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-05",
              time: "07:05",
              timeZone: "+03:00",
              terminal: "I"
            },
            destination: {
              code: "MAD",
              name: "Madrid",
              date: "2019-04-05",
              time: "10:35",
              timeZone: "+02:00",
              terminal: "1"
            },
            flightTime: 270,
            journeyTime: 1305,
            waitTime: null
          },
          {
            group: "2",
            carrier: { name: "Blue Air" },
            origin: {
              code: "MAD",
              name: "Madrid",
              date: "2019-04-05",
              time: "14:35",
              timeZone: "+02:00",
              terminal: "1"
            },
            destination: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-05",
              time: "19:45",
              timeZone: "+03:00",
              terminal: "I"
            },
            flightTime: 250,
            journeyTime: 1685,
            waitTime: 1260
          },
          {
            group: "2",
            carrier: { name: "Blue Air" },
            origin: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-06",
              time: "16:45",
              timeZone: "+03:00",
              terminal: "I"
            },
            destination: {
              code: "TXL",
              name: "Berlin-Tegel",
              date: "2019-04-06",
              time: "18:40",
              timeZone: "+02:00",
              terminal: null
            },
            flightTime: 175,
            journeyTime: 1685,
            waitTime: null
          }
        ],
        isLowCost: false,
        isRefundable: false,
        searchId: "5ca346876ddc006486ea329e",
        orderedSegments: {
          "0": [
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "SOF",
                name: "Sofia",
                date: "2019-04-03",
                time: "16:05",
                timeZone: "+03:00",
                terminal: "2"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-03",
                time: "17:20",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 75,
              journeyTime: 400,
              waitTime: 75
            },
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-03",
                time: "18:35",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "LHR",
                name: "London Heathrow",
                date: "2019-04-03",
                time: "20:45",
                timeZone: "+01:00",
                terminal: "2"
              },
              flightTime: 250,
              journeyTime: 400,
              waitTime: null
            }
          ],
          "1": [
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "LGW",
                name: "London Gatwick",
                date: "2019-04-04",
                time: "11:50",
                timeZone: "+01:00",
                terminal: "S"
              },
              destination: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "18:15",
                timeZone: "+03:00",
                terminal: "1"
              },
              flightTime: 265,
              journeyTime: 1305,
              waitTime: 245
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "22:20",
                timeZone: "+03:00",
                terminal: "D"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-04",
                time: "23:50",
                timeZone: "+03:00",
                terminal: "D"
              },
              flightTime: 90,
              journeyTime: 1305,
              waitTime: 435
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "07:05",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "10:35",
                timeZone: "+02:00",
                terminal: "1"
              },
              flightTime: 270,
              journeyTime: 1305,
              waitTime: null
            }
          ],
          "2": [
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "14:35",
                timeZone: "+02:00",
                terminal: "1"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "19:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 250,
              journeyTime: 1685,
              waitTime: 1260
            },
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-06",
                time: "16:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "TXL",
                name: "Berlin-Tegel",
                date: "2019-04-06",
                time: "18:40",
                timeZone: "+02:00",
                terminal: null
              },
              flightTime: 175,
              journeyTime: 1685,
              waitTime: null
            }
          ]
        }
      },
      {
        id: "5ca346876ddc006486ea32a0", // Airports - SOFIA: SOF | LONDON: LHR |  MAD
        price: { currency: "EUR", total: 2988.5 },
        segments: [
          {
            group: "0",
            carrier: { name: "Blue Air" },
            origin: {
              code: "SOF",
              name: "Sofia",
              date: "2019-04-03",
              time: "21:40",
              timeZone: "+03:00",
              terminal: "2"
            },
            destination: {
              code: "LHR",
              name: "London Heathrow",
              date: "2019-04-03",
              time: "20:45",
              timeZone: "+01:00",
              terminal: "2"
            },
            flightTime: 85,
            journeyTime: 850,
            waitTime: 520
          },
          {
            group: "1",
            carrier: { name: "Helvetic Airways" },
            origin: {
              code: "LHR",
              name: "London Heathrow",
              date: "2019-04-03",
              time: "20:45",
              timeZone: "+01:00",
              terminal: "2"
            },
            destination: {
              code: "MAD",
              name: "Madrid",
              date: "2019-04-05",
              time: "10:35",
              timeZone: "+02:00",
              terminal: "1"
            },
            flightTime: 270,
            journeyTime: 1305,
            waitTime: null
          }
        ],
        isLowCost: false,
        isRefundable: false,
        searchId: "5ca346876ddc006486ea329e",
        orderedSegments: {
          "0": [
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "SOF",
                name: "Sofia",
                date: "2019-04-03",
                time: "21:40",
                timeZone: "+03:00",
                terminal: "2"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-03",
                time: "23:05",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 85,
              journeyTime: 850,
              waitTime: 520
            },
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-04",
                time: "07:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "LHR",
                name: "London Heathrow",
                date: "2019-04-04",
                time: "09:50",
                timeZone: "+01:00",
                terminal: "2"
              },
              flightTime: 245,
              journeyTime: 850,
              waitTime: null
            }
          ],
          "1": [
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "LGW",
                name: "London Gatwick",
                date: "2019-04-04",
                time: "11:50",
                timeZone: "+01:00",
                terminal: "S"
              },
              destination: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "18:15",
                timeZone: "+03:00",
                terminal: "1"
              },
              flightTime: 265,
              journeyTime: 1305,
              waitTime: 245
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "22:20",
                timeZone: "+03:00",
                terminal: "D"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-04",
                time: "23:50",
                timeZone: "+03:00",
                terminal: "D"
              },
              flightTime: 90,
              journeyTime: 1305,
              waitTime: 435
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "07:05",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "10:35",
                timeZone: "+02:00",
                terminal: "1"
              },
              flightTime: 270,
              journeyTime: 1305,
              waitTime: null
            }
          ],
          "2": [
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "14:35",
                timeZone: "+02:00",
                terminal: "1"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "19:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 250,
              journeyTime: 1685,
              waitTime: 1260
            },
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-06",
                time: "16:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "TXL",
                name: "Berlin-Tegel",
                date: "2019-04-06",
                time: "18:40",
                timeZone: "+02:00",
                terminal: null
              },
              flightTime: 175,
              journeyTime: 1685,
              waitTime: null
            }
          ]
        }
      },
      {
        id: "5ca346876ddc006486ea32a1", // Airports - SOFIA: SOF | LONDON: LTN | MAD
        price: { currency: "EUR", total: 1164 },
        segments: [
          {
            group: "0",
            carrier: { name: "Blue Air" },
            origin: {
              code: "SOF",
              name: "Sofia",
              date: "2019-04-03",
              time: "16:05",
              timeZone: "+03:00",
              terminal: "2"
            },
            destination: {
              code: "LTN",
              name: "Luton",
              date: "2019-04-03",
              time: "20:45",
              timeZone: "+01:00",
              terminal: "2"
            },
            flightTime: 75,
            journeyTime: 400,
            waitTime: 75
          },
          {
            group: "1",
            carrier: { name: "Helvetic Airways" },
            origin: {
              code: "LTN",
              name: "Luton",
              date: "2019-04-03",
              time: "20:45",
              timeZone: "+01:00",
              terminal: "2"
            },
            destination: {
              code: "IST",
              name: "Istanbul",
              date: "2019-04-05",
              time: "17:25",
              timeZone: "+03:00",
              terminal: "I"
            },
            flightTime: 265,
            journeyTime: 1305,
            waitTime: 245
          }
        ],
        isLowCost: false,
        isRefundable: false,
        searchId: "5ca346876ddc006486ea329e",
        orderedSegments: {
          "0": [
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "SOF",
                name: "Sofia",
                date: "2019-04-03",
                time: "16:05",
                timeZone: "+03:00",
                terminal: "2"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-03",
                time: "17:20",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 75,
              journeyTime: 400,
              waitTime: 75
            },
            {
              group: "0",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-03",
                time: "18:35",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "LHR",
                name: "London Heathrow",
                date: "2019-04-03",
                time: "20:45",
                timeZone: "+01:00",
                terminal: "2"
              },
              flightTime: 250,
              journeyTime: 400,
              waitTime: null
            }
          ],
          "1": [
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "LGW",
                name: "London Gatwick",
                date: "2019-04-04",
                time: "11:50",
                timeZone: "+01:00",
                terminal: "S"
              },
              destination: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "18:15",
                timeZone: "+03:00",
                terminal: "1"
              },
              flightTime: 265,
              journeyTime: 1305,
              waitTime: 245
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "AYT",
                name: "Antalya",
                date: "2019-04-04",
                time: "22:20",
                timeZone: "+03:00",
                terminal: "D"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-04",
                time: "23:50",
                timeZone: "+03:00",
                terminal: "D"
              },
              flightTime: 90,
              journeyTime: 1305,
              waitTime: 435
            },
            {
              group: "1",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "07:05",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "10:35",
                timeZone: "+02:00",
                terminal: "1"
              },
              flightTime: 270,
              journeyTime: 1305,
              waitTime: null
            }
          ],
          "2": [
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "MAD",
                name: "Madrid",
                date: "2019-04-05",
                time: "12:10",
                timeZone: "+02:00",
                terminal: "1"
              },
              destination: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-05",
                time: "17:25",
                timeZone: "+03:00",
                terminal: "I"
              },
              flightTime: 255,
              journeyTime: 1830,
              waitTime: 1400
            },
            {
              group: "2",
              carrier: { name: "Turkish Airlines" },
              origin: {
                code: "IST",
                name: "Istanbul",
                date: "2019-04-06",
                time: "16:45",
                timeZone: "+03:00",
                terminal: "I"
              },
              destination: {
                code: "TXL",
                name: "Berlin-Tegel",
                date: "2019-04-06",
                time: "18:40",
                timeZone: "+02:00",
                terminal: null
              },
              flightTime: 175,
              journeyTime: 1830,
              waitTime: null
            }
          ]
        }
      }
    ];

    test("with LHR, SOF, MAD", () => {
      let filters = {
        airports: {
          all: [
            {
              airportId: "LHR",
              airportName: "London Heathrow",
              city: "London",
              selected: true
            },
            {
              airportId: "LCY",
              airportName: "London City Arpt",
              city: "London"
            },
            {
              airportId: "LGW",
              airportName: "London Gatwick",
              city: "London"
            },
            {
              airportId: "STN",
              airportName: "London Stansted",
              city: "London"
            },
            { airportId: "LTN", airportName: "Luton", city: "London" },
            {
              airportId: "SOF",
              airportName: "Sofia",
              city: "Sofia",
              selected: true
            },
            {
              airportId: "MAD",
              airportName: "Madrid",
              city: "Madrid",
              selected: true
            }
          ]
        }
      };
      let result = filterByAirports(filters, flights);
      let resultIds = result.map(_.prop("id"));
      let expectedResultIds = [flights[1].id];
      expect(resultIds).toEqual(expectedResultIds);
    });
    test("with TXL, IST | SOF, MAD | LHR, LGW, AYT", () => {
      let filters = {
        airports: {
          all: [
            {
              airportId: "STN",
              airportName: "London Stansted",
              city: "London"
            },
            {
              airportId: "LCY",
              airportName: "London City Arpt",
              city: "London"
            },
            {
              airportId: "TXL",
              airportName: "Berlin-Tegel",
              city: "Berlin",
              selected: true
            },
            {
              airportId: "IST",
              airportName: "Istanbul",
              city: "Istanbul",
              selected: true
            },
            {
              airportId: "LTN",
              airportName: "Luton",
              city: "London"
              // selected: true
            },
            {
              airportId: "SOF",
              airportName: "Sofia",
              city: "Sofia",
              selected: true
            },
            {
              airportId: "MAD",
              airportName: "Madrid",
              city: "Madrid",
              selected: true
            },
            {
              airportId: "LHR",
              airportName: "London Heathrow",
              city: "London",
              selected: true
            },

            {
              airportId: "LGW",
              airportName: "London Gatwick",
              city: "London",
              selected: true
            },
            {
              airportId: "AYT",
              airportName: "Antalya",
              city: "Antalya",
              selected: true
            }
          ]
        }
      };
      let result = filterByAirports(filters, flights);
      let resultIds = result.map(_.prop("id"));
      let expectedResultIds = [flights[0].id, flights[1].id];
      expect(resultIds).toEqual(expectedResultIds);
    });
    test("with LTN | AYT | IST | LHR | SOF", () => {
      let filters = {
        airports: {
          // LTN | AYT | IST | LHR | SOF
          all: [
            {
              airportId: "LTN",
              airportName: "Luton",
              city: "London",
              selected: true
            },
            {
              airportId: "AYT",
              airportName: "Antalya",
              city: "Antalya",
              selected: true
            },
            {
              airportId: "IST",
              airportName: "Istanbul",
              city: "Istanbul",
              selected: true
            },
            {
              airportId: "LHR",
              airportName: "London Heathrow",
              city: "London",
              selected: true
            },

            {
              airportId: "SOF",
              airportName: "Sofia",
              city: "Sofia",
              selected: true
            },

            {
              airportId: "LCY",
              airportName: "London City Arpt",
              city: "London"
            },
            {
              airportId: "LGW",
              airportName: "London Gatwick",
              city: "London"
            },
            {
              airportId: "STN",
              airportName: "London Stansted",
              city: "London"
            }
          ]
        }
      };
      let result = filterByAirports(filters, flights);
      let resultIds = result.map(_.prop("id"));
      let expectedResultIds = [flights[2].id];
      expect(resultIds).toEqual(expectedResultIds);
    });
    test("with LHR, LGW, LTN, SOF", () => {
      let filters = {
        airports: {
          all: [
            {
              airportId: "LHR",
              airportName: "London Heathrow",
              city: "London",
              selected: true
            },
            {
              airportId: "LGW",
              airportName: "London Gatwick",
              city: "London",
              selected: true
            },
            {
              airportId: "LTN",
              airportName: "Luton",
              city: "London",
              selected: true
            },
            {
              airportId: "SOF",
              airportName: "Sofia",
              city: "Sofia",
              selected: true
            },

            {
              airportId: "LCY",
              airportName: "London City Arpt",
              city: "London"
            },

            {
              airportId: "STN",
              airportName: "London Stansted",
              city: "London"
            }
          ]
        }
      };
      let result = filterByAirports(filters, flights);
      let resultIds = result.map(_.prop("id"));
      let expectedResultIds = [];
      expect(resultIds).toEqual(expectedResultIds);
    });

    test("with 0 selected cities, returns []", () => {
      let filters = {
        airports: {
          all: [
            {
              airportId: "LHR",
              airportName: "London Heathrow",
              city: "London"
            },
            {
              airportId: "SOF",
              airportName: "Sofia",
              city: "Sofia"
            },

            {
              airportId: "LCY",
              airportName: "London City Arpt",
              city: "London"
            },
            {
              airportId: "LGW",
              airportName: "London Gatwick",
              city: "London"
            },
            {
              airportId: "STN",
              airportName: "London Stansted",
              city: "London"
            },
            {
              airportId: "LTN",
              airportName: "Luton",
              city: "London"
            }
          ]
        }
      };
      let result = filterByAirports(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual([]);
    });
  });
});

describe("threw with", () => {
  let flights = [
    {
      id: "5cac8e97d752b957e7490720", // SOF, LHR, LGW, MAD, TXL
      price: { currency: "EUR", total: 408 },
      segments: [
        {
          group: "0",
          carrier: { name: "British Airways" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-05-12",
            time: "14:20",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-12",
            time: "15:50",
            timeZone: "+01:00",
            terminal: "5"
          },
          flightTime: 210,
          journeyTime: 210,
          waitTime: null
        },
        {
          group: "1",
          carrier: { name: "Iberia" },
          origin: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-05-14",
            time: "10:50",
            timeZone: "+01:00",
            terminal: "S"
          },
          destination: {
            code: "MAD",
            name: "Madrid",
            date: "2019-05-14",
            time: "14:20",
            timeZone: "+02:00",
            terminal: "4"
          },
          flightTime: 150,
          journeyTime: 150,
          waitTime: null
        },
        {
          group: "2",
          carrier: { name: "British Airways" },
          origin: {
            code: "MAD",
            name: "Madrid",
            date: "2019-05-16",
            time: "07:00",
            timeZone: "+02:00",
            terminal: "4"
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-16",
            time: "08:25",
            timeZone: "+01:00",
            terminal: "5"
          },
          flightTime: 145,
          journeyTime: 685,
          waitTime: 425
        },
        {
          group: "2",
          carrier: { name: "British Airways" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-16",
            time: "15:30",
            timeZone: "+01:00",
            terminal: "5"
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-05-16",
            time: "18:25",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 115,
          journeyTime: 685,
          waitTime: null
        }
      ],
      isLowCost: false,
      isRefundable: false,
      searchId: "5cac8e97d752b957e7490715"
    },

    {
      id: "5cac90e2d752b957e7490ba6", // SOF, LHR, LGW, MAD, TXL
      price: { currency: "EUR", total: 408 },
      segments: [
        {
          group: "0",
          carrier: { name: "British Airways" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-05-12",
            time: "14:20",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-12",
            time: "15:50",
            timeZone: "+01:00",
            terminal: "5"
          },
          flightTime: 210,
          journeyTime: 210,
          waitTime: null
        },
        {
          group: "1",
          carrier: { name: "Iberia" },
          origin: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-05-14",
            time: "10:50",
            timeZone: "+01:00",
            terminal: "S"
          },
          destination: {
            code: "MAD",
            name: "Madrid",
            date: "2019-05-14",
            time: "14:20",
            timeZone: "+02:00",
            terminal: "4"
          },
          flightTime: 150,
          journeyTime: 150,
          waitTime: null
        },
        {
          group: "2",
          carrier: { name: "British Airways" },
          origin: {
            code: "MAD",
            name: "Madrid",
            date: "2019-05-16",
            time: "15:50",
            timeZone: "+02:00",
            terminal: "4S"
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-16",
            time: "17:15",
            timeZone: "+01:00",
            terminal: "5"
          },
          flightTime: 145,
          journeyTime: 1095,
          waitTime: 840
        },
        {
          group: "2",
          carrier: { name: "British Airways" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-05-17",
            time: "07:15",
            timeZone: "+01:00",
            terminal: "5"
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-05-17",
            time: "10:05",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 110,
          journeyTime: 1095,
          waitTime: null
        }
      ],
      isLowCost: false,
      isRefundable: false,
      searchId: "5cac90ddd752b957e7490b85"
    }
  ];

  test("1", () => {
    let filters = {
      airports: {
        all: [
          {
            airportId: "LHR",
            airportName: "London Heathrow",
            city: "London",
            selected: true
          },
          {
            airportId: "LCY",
            airportName: "London City Arpt",
            city: "London"
          },
          {
            airportId: "LGW",
            airportName: "London Gatwick",
            city: "London"
          },
          {
            airportId: "STN",
            airportName: "London Stansted",
            city: "London"
          },
          { airportId: "LTN", airportName: "Luton", city: "London" }
        ]
      }
    };
    let result = filterByAirports(filters, flights);
    let resultIds = result.map(_.prop("id"));
    let expectedResultIds = [];
    expect(resultIds).toEqual(expectedResultIds);
  });

  test("2", () => {
    let filters = {
      airports: {
        all: [
          // SOF, LHR, LGW, MAD, TXL
          {
            airportId: "SOF",
            airportName: "Sofia",
            city: "Sofia",
            selected: true
          },
          {
            airportId: "LHR",
            airportName: "London Heathrow",
            city: "London",
            selected: true
          },
          {
            airportId: "LGW",
            airportName: "London Gatwick",
            city: "London",
            selected: true
          },
          {
            airportId: "MAD",
            airportName: "Madrid",
            city: "Madrid",
            selected: true
          },
          {
            airportId: "TXL",
            airportName: "Berlin",
            city: "Berlin",
            selected: true
          },
          {
            airportId: "LCY",
            airportName: "London City Arpt",
            city: "London"
          },

          {
            airportId: "STN",
            airportName: "London Stansted",
            city: "London"
          },
          { airportId: "LTN", airportName: "Luton", city: "London" }
        ]
      }
    };
    let result = filterByAirports(filters, flights);
    let resultIds = result.map(_.prop("id"));
    let expectedResultIds = [
      "5cac8e97d752b957e7490720",
      "5cac90e2d752b957e7490ba6"
    ];
    expect(resultIds).toEqual(expectedResultIds);
  });

  test("3", () => {
    let filters = {
      airports: {
        all: [
          {
            airportId: "LHR",
            airportName: "London Heathrow",
            city: "London",
            selected: true
          },
          { airportId: "LGW", airportName: "London Gatwick", city: "London" }
        ],
        transfers: [
          { airportName: "Amsterdam", airportId: "AMS" },
          { airportName: "London Heathrow", airportId: "LHR" }
        ]
      }
    };
    let result = filterByAirports(filters, flights);
    let resultIds = result.map(_.prop("id"));
    let expectedResultIds = [];
    expect(resultIds).toEqual(expectedResultIds);
  });
});
