import orderFlights from "./order-flights";

let destinationsFromSearch = `[{"origin":"SOF","destination":"BER","date":"28/03/2019"},{"origin":"BER","destination":"PAR","date":"29/03/2019"},{"origin":"PAR","destination":"LON","date":"30/03/2019"}]`;

describe("orderFlights", () => {
  it("works with 3 destinations", () => {
    let testSegments = {
      originCode: "SOF",
      arrayOfStopsToSort: [
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
      ]
    };
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

    let testSegments = {
      originCode: "SOF",
      arrayOfStopsToSort: [
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
      ]
    };
    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });

  it("works with 1", function() {
    let testSegments = {
      originCode: "SOF",
      arrayOfStopsToSort: [
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

    let testSegments = {
      originCode: "SOF",
      arrayOfStopsToSort: []
    };
    let result = orderFlights(testSegments);

    expect(result).toEqual(expectedData);
  });
});
