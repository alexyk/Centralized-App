import orderFlights from "./order-flights";
import * as _ from "ramda";

let destinationsFromSearch = `[{"origin":"SOF","destination":"BER","date":"28/03/2019"},{"origin":"BER","destination":"PAR","date":"29/03/2019"},{"origin":"PAR","destination":"LON","date":"30/03/2019"}]`;

describe("orderFlights", () => {
  it("works with 3 destinations", () => {
    let testSegments = [
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-28",
          time: "20:20",
          timeZone: "+02:00",
          terminal: "I"
        },
        destination: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-28",
          time: "21:25",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 185,
        journeyTime: 385,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-29",
          time: "18:50",
          timeZone: "+01:00",
          terminal: null
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-29",
          time: "23:50",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 180,
        journeyTime: 1020,
        waitTime: 370
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-28",
          time: "16:00",
          timeZone: "+02:00",
          terminal: "2"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-28",
          time: "18:20",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 80,
        journeyTime: 385,
        waitTime: 120
      },
      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-31",
          time: "07:25",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-03-31",
          time: "09:30",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 1190,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "ESB",
          name: "Esenboga Arpt",
          date: "2019-03-30",
          time: "09:40",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-30",
          time: "11:50",
          timeZone: "+01:00",
          terminal: "1"
        },
        flightTime: 250,
        journeyTime: 1020,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-30",
          time: "06:00",
          timeZone: "+02:00",
          terminal: "D"
        },
        destination: {
          code: "ESB",
          name: "Esenboga Arpt",
          date: "2019-03-30",
          time: "07:20",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 80,
        journeyTime: 1020,
        waitTime: 140
      },
      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-30",
          time: "13:40",
          timeZone: "+01:00",
          terminal: "1"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-30",
          time: "19:05",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 205,
        journeyTime: 1190,
        waitTime: 740
      }
    ];
    let result = orderFlights(testSegments);
    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-28",
            time: "16:00",
            timeZone: "+02:00",
            terminal: "2"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-28",
            time: "18:20",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 80,
          journeyTime: 385,
          waitTime: 120
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-28",
            time: "20:20",
            timeZone: "+02:00",
            terminal: "I"
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-28",
            time: "21:25",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 185,
          journeyTime: 385,
          waitTime: null
        }
      ],

      "1": [
        // -- good
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-29",
            time: "18:50",
            timeZone: "+01:00",
            terminal: null
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-29",
            time: "23:50",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 180,
          journeyTime: 1020,
          waitTime: 370
        },
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-30",
            time: "06:00",
            timeZone: "+02:00",
            terminal: "D"
          },
          destination: {
            code: "ESB",
            name: "Esenboga Arpt",
            date: "2019-03-30",
            time: "07:20",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 80,
          journeyTime: 1020,
          waitTime: 140
        },
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "ESB",
            name: "Esenboga Arpt",
            date: "2019-03-30",
            time: "09:40",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-30",
            time: "11:50",
            timeZone: "+01:00",
            terminal: "1"
          },
          flightTime: 250,
          journeyTime: 1020,
          waitTime: null
        }
      ],
      "2": [
        // -- good
        {
          group: "2",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-30",
            time: "13:40",
            timeZone: "+01:00",
            terminal: "1"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-30",
            time: "19:05",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 205,
          journeyTime: 1190,
          waitTime: 740
        },
        {
          group: "2",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-31",
            time: "07:25",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-03-31",
            time: "09:30",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 1190,
          waitTime: null
        }
      ]
    };
    expect(result).toEqual(expectedData);
  });

  it("works with 3 again", function() {
    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-28",
            time: "09:50",
            timeZone: "+02:00",
            terminal: "2"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-28",
            time: "12:05",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 75,
          journeyTime: 510,
          waitTime: 255
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-28",
            time: "16:20",
            timeZone: "+02:00",
            terminal: "I"
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-28",
            time: "17:20",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 180,
          journeyTime: 510,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-29",
            time: "18:50",
            timeZone: "+01:00",
            terminal: null
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-29",
            time: "23:50",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 180,
          journeyTime: 1020,
          waitTime: 370
        },
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-30",
            time: "06:00",
            timeZone: "+02:00",
            terminal: "D"
          },
          destination: {
            code: "ESB",
            name: "Esenboga Arpt",
            date: "2019-03-30",
            time: "07:20",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 80,
          journeyTime: 1020,
          waitTime: 140
        },
        {
          group: "1",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "ESB",
            name: "Esenboga Arpt",
            date: "2019-03-30",
            time: "09:40",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-30",
            time: "11:50",
            timeZone: "+01:00",
            terminal: "1"
          },
          flightTime: 250,
          journeyTime: 1020,
          waitTime: null
        }
      ],

      "2": [
        {
          group: "2",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-30",
            time: "13:40",
            timeZone: "+01:00",
            terminal: "1"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-30",
            time: "19:05",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 205,
          journeyTime: 1190,
          waitTime: 740
        },
        {
          group: "2",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-31",
            time: "07:25",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-03-31",
            time: "09:30",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 1190,
          waitTime: null
        }
      ]
    };

    let testSegments = [
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-28",
          time: "09:50",
          timeZone: "+02:00",
          terminal: "2"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-28",
          time: "12:05",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 75,
        journeyTime: 510,
        waitTime: 255
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-28",
          time: "16:20",
          timeZone: "+02:00",
          terminal: "I"
        },
        destination: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-28",
          time: "17:20",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 180,
        journeyTime: 510,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-29",
          time: "18:50",
          timeZone: "+01:00",
          terminal: null
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-29",
          time: "23:50",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 180,
        journeyTime: 1020,
        waitTime: 370
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-30",
          time: "06:00",
          timeZone: "+02:00",
          terminal: "D"
        },
        destination: {
          code: "ESB",
          name: "Esenboga Arpt",
          date: "2019-03-30",
          time: "07:20",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 80,
        journeyTime: 1020,
        waitTime: 140
      },
      {
        group: "1",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "ESB",
          name: "Esenboga Arpt",
          date: "2019-03-30",
          time: "09:40",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-30",
          time: "11:50",
          timeZone: "+01:00",
          terminal: "1"
        },
        flightTime: 250,
        journeyTime: 1020,
        waitTime: null
      },

      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-30",
          time: "13:40",
          timeZone: "+01:00",
          terminal: "1"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-30",
          time: "19:05",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 205,
        journeyTime: 1190,
        waitTime: 740
      },
      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-31",
          time: "07:25",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-03-31",
          time: "09:30",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 1190,
        waitTime: null
      }
    ];
    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });

  it("works with 1", function() {
    let testSegments = [
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-28",
          time: "09:50",
          timeZone: "+02:00",
          terminal: "2"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-03-28",
          time: "12:05",
          timeZone: "+02:00",
          terminal: "I"
        },
        flightTime: 75,
        journeyTime: 510,
        waitTime: 255
      }
    ];

    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-28",
            time: "09:50",
            timeZone: "+02:00",
            terminal: "2"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-03-28",
            time: "12:05",
            timeZone: "+02:00",
            terminal: "I"
          },
          flightTime: 75,
          journeyTime: 510,
          waitTime: 255
        }
      ]
    };
    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });

  it("works with 0", function() {
    let expectedData = {};

    let testSegments = [];
    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });

  it("works with unrelated flights", () => {
    let testSegments = [
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-29",
          time: "06:50:00",
          timeZone: null,
          terminal: "2"
        },
        destination: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-29",
          time: "08:30:00",
          timeZone: null,
          terminal: "1"
        },
        flightTime: 160,
        journeyTime: 445,
        waitTime: 210
      },
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-29",
          time: "12:00:00",
          timeZone: null,
          terminal: "1"
        },
        destination: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-29",
          time: "13:15:00",
          timeZone: null,
          terminal: "1"
        },
        flightTime: 75,
        journeyTime: 445,
        waitTime: 0
      },

      {
        group: "1",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-31",
          time: "10:15:00",
          timeZone: null,
          terminal: "2"
        },
        destination: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-31",
          time: "12:45:00",
          timeZone: null,
          terminal: null
        },
        flightTime: 90,
        journeyTime: 930,
        waitTime: 0
      },

      {
        group: "1",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "VIE",
          name: "Vienna",

          date: "2019-03-30",
          time: "20:15:00",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "CDG",
          name: "Paris Charles De Gaulle",
          date: "2019-03-30",
          time: "22:15:00",
          timeZone: null,
          terminal: "2D"
        },
        flightTime: 120,
        journeyTime: 930,
        waitTime: 720
      }
    ];

    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-29",
            time: "06:50:00",
            timeZone: null,
            terminal: "2"
          },
          destination: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-29",
            time: "08:30:00",
            timeZone: null,
            terminal: "1"
          },
          flightTime: 160,
          journeyTime: 445,
          waitTime: 210
        },
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-29",
            time: "12:00:00",
            timeZone: null,
            terminal: "1"
          },
          destination: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-29",
            time: "13:15:00",
            timeZone: null,
            terminal: "1"
          },
          flightTime: 75,
          journeyTime: 445,
          waitTime: 0
        }
      ],

      "1": [
        {
          group: "1",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-31",
            time: "10:15:00",
            timeZone: null,
            terminal: "2"
          },
          destination: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-31",
            time: "12:45:00",
            timeZone: null,
            terminal: null
          },
          flightTime: 90,
          journeyTime: 930,
          waitTime: 0
        },

        {
          group: "1",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "VIE",
            name: "Vienna",

            date: "2019-03-30",
            time: "20:15:00",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "CDG",
            name: "Paris Charles De Gaulle",
            date: "2019-03-30",
            time: "22:15:00",
            timeZone: null,
            terminal: "2D"
          },
          flightTime: 120,
          journeyTime: 930,
          waitTime: 720
        }
      ]
    };

    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });

  it("[THREW WITH] works with this set of data", () => {
    let testSegments = [
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-27",
          time: "18:55",
          timeZone: "+02:00",
          terminal: "2"
        },
        destination: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-27",
          time: "20:20",
          timeZone: "+01:00",
          terminal: "1"
        },
        flightTime: 145,
        journeyTime: 320,
        waitTime: 70
      },
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-27",
          time: "21:30",
          timeZone: "+01:00",
          terminal: "1"
        },
        destination: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-03-27",
          time: "22:15",
          timeZone: "+00:00",
          terminal: "2"
        },
        flightTime: 105,
        journeyTime: 320,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Austrian Airline" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-03-28",
          time: "09:05",
          timeZone: "+00:00",
          terminal: "2"
        },
        destination: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-28",
          time: "12:20",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 135,
        journeyTime: 610,
        waitTime: 400
      },
      {
        group: "1",
        carrier: { name: "Austrian Airline" },
        origin: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-28",
          time: "19:00",
          timeZone: "+01:00",
          terminal: null
        },
        destination: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-28",
          time: "20:15",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 75,
        journeyTime: 610,
        waitTime: null
      },
      {
        group: "2",
        carrier: { name: "Austrian Airline" },
        origin: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-29",
          time: "09:00",
          timeZone: "+01:00",
          terminal: null
        },
        destination: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-29",
          time: "10:20",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 80,
        journeyTime: 470,
        waitTime: 295
      },
      {
        group: "2",
        carrier: { name: "Austrian Airline" },
        origin: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-29",
          time: "15:15",
          timeZone: "+01:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-29",
          time: "17:50",
          timeZone: "+02:00",
          terminal: "2"
        },
        flightTime: 95,
        journeyTime: 470,
        waitTime: null
      }
    ];

    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-27",
            time: "18:55",
            timeZone: "+02:00",
            terminal: "2"
          },
          destination: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-27",
            time: "20:20",
            timeZone: "+01:00",
            terminal: "1"
          },
          flightTime: 145,
          journeyTime: 320,
          waitTime: 70
        },
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-27",
            time: "21:30",
            timeZone: "+01:00",
            terminal: "1"
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-03-27",
            time: "22:15",
            timeZone: "+00:00",
            terminal: "2"
          },
          flightTime: 105,
          journeyTime: 320,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "Austrian Airline" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-03-28",
            time: "09:05",
            timeZone: "+00:00",
            terminal: "2"
          },
          destination: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-28",
            time: "12:20",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 135,
          journeyTime: 610,
          waitTime: 400
        },
        {
          group: "1",
          carrier: { name: "Austrian Airline" },
          origin: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-28",
            time: "19:00",
            timeZone: "+01:00",
            terminal: null
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-28",
            time: "20:15",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 75,
          journeyTime: 610,
          waitTime: null
        }
      ],
      "2": [
        {
          group: "2",
          carrier: { name: "Austrian Airline" },
          origin: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-29",
            time: "09:00",
            timeZone: "+01:00",
            terminal: null
          },
          destination: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-29",
            time: "10:20",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 80,
          journeyTime: 470,
          waitTime: 295
        },
        {
          group: "2",
          carrier: { name: "Austrian Airline" },
          origin: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-29",
            time: "15:15",
            timeZone: "+01:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-29",
            time: "17:50",
            timeZone: "+02:00",
            terminal: "2"
          },
          flightTime: 95,
          journeyTime: 470,
          waitTime: null
        }
      ]
    };
    let result = orderFlights(testSegments);
    expect(result).toEqual(expectedData);

    expect(Object.values(result).reduce(_.concat)).toEqual(testSegments);
  });

  it("[THREW WITH] works when all the flights are given as a single flight group", function() {
    let testSegments = [
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-28",
          time: "18:55",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-28",
          time: "20:20",
          timeZone: null,
          terminal: null
        },
        flightTime: 145,
        journeyTime: 2815,
        waitTime: 70
      },
      {
        group: "0",
        carrier: { name: "Lufthansa" },
        origin: {
          code: "FRA",
          name: "Frankfurt",
          date: "2019-03-28",
          time: "21:30",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-03-28",
          time: "22:15",
          timeZone: null,
          terminal: null
        },
        flightTime: 105,
        journeyTime: 2815,
        waitTime: 465
      },
      {
        group: "0",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-03-29",
          time: "06:00",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-29",
          time: "09:20",
          timeZone: null,
          terminal: null
        },
        flightTime: 140,
        journeyTime: 2815,
        waitTime: 710
      },
      {
        group: "0",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-29",
          time: "21:10",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-29",
          time: "22:25",
          timeZone: null,
          terminal: null
        },
        flightTime: 75,
        journeyTime: 2815,
        waitTime: 515
      },
      {
        group: "0",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "TXL",
          name: "Berlin-Tegel",
          date: "2019-03-30",
          time: "07:00",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-30",
          time: "08:15",
          timeZone: null,
          terminal: null
        },
        flightTime: 75,
        journeyTime: 2815,
        waitTime: 420
      },
      {
        group: "0",
        carrier: { name: "Austrian Airlines" },
        origin: {
          code: "VIE",
          name: "Vienna",
          date: "2019-03-30",
          time: "15:15",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-03-30",
          time: "17:50",
          timeZone: null,
          terminal: null
        },
        flightTime: 95,
        journeyTime: 2815,
        waitTime: null
      }
    ];

    let expectedData = {
      "0": [
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-28",
            time: "18:55",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-28",
            time: "20:20",
            timeZone: null,
            terminal: null
          },
          flightTime: 145,
          journeyTime: 2815,
          waitTime: 70
        },
        {
          group: "0",
          carrier: { name: "Lufthansa" },
          origin: {
            code: "FRA",
            name: "Frankfurt",
            date: "2019-03-28",
            time: "21:30",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-03-28",
            time: "22:15",
            timeZone: null,
            terminal: null
          },
          flightTime: 105,
          journeyTime: 2815,
          waitTime: 465
        },
        {
          group: "0",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-03-29",
            time: "06:00",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-29",
            time: "09:20",
            timeZone: null,
            terminal: null
          },
          flightTime: 140,
          journeyTime: 2815,
          waitTime: 710
        },
        {
          group: "0",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-29",
            time: "21:10",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-29",
            time: "22:25",
            timeZone: null,
            terminal: null
          },
          flightTime: 75,
          journeyTime: 2815,
          waitTime: 515
        },
        {
          group: "0",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "TXL",
            name: "Berlin-Tegel",
            date: "2019-03-30",
            time: "07:00",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-30",
            time: "08:15",
            timeZone: null,
            terminal: null
          },
          flightTime: 75,
          journeyTime: 2815,
          waitTime: 420
        },
        {
          group: "0",
          carrier: { name: "Austrian Airlines" },
          origin: {
            code: "VIE",
            name: "Vienna",
            date: "2019-03-30",
            time: "15:15",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-03-30",
            time: "17:50",
            timeZone: null,
            terminal: null
          },
          flightTime: 95,
          journeyTime: 2815,
          waitTime: null
        }
      ]
    };

    let result = orderFlights(testSegments);
    expect(result).toEqual(expectedData);
  });
});
