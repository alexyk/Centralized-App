import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
afterEach(cleanup);
import AirTicketsSearchFilterPanel from "./filter/AirTicketsSearchFilterPanel.test";


/*
* What data sets to use?
- 2 direct flights
- 5 one stop flights
- 10 multistop flights
* */

let two_flights_direct = {
  "5ca33ed46ddc006486ea2589": {
    id: "5ca33ed46ddc006486ea2589",
    price: { currency: "EUR", total: 373.94 },
    segments: [
      {
        group: "0",
        carrier: { name: "Ryanair" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "21:55",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "STN",
          name: "London Stansted",
          date: "2019-04-02",
          time: "23:05",
          timeZone: null,
          terminal: null
        },
        flightTime: 190,
        journeyTime: 190,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Ryanair" },
        origin: {
          code: "STN",
          name: "London Stansted",
          date: "2019-04-04",
          time: "16:20",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-04",
          time: "21:30",
          timeZone: null,
          terminal: null
        },
        flightTime: 190,
        journeyTime: 190,
        waitTime: null
      }
    ],
    isLowCost: true,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "Ryanair" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "21:55",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "STN",
            name: "London Stansted",
            date: "2019-04-02",
            time: "23:05",
            timeZone: null,
            terminal: null
          },
          flightTime: 190,
          journeyTime: 190,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "Ryanair" },
          origin: {
            code: "STN",
            name: "London Stansted",
            date: "2019-04-04",
            time: "16:20",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-04",
            time: "21:30",
            timeZone: null,
            terminal: null
          },
          flightTime: 190,
          journeyTime: 190,
          waitTime: null
        }
      ]
    }
  },
  "5ca343996ddc006486ea2dce": {
    id: "5ca343996ddc006486ea2dce",
    price: { currency: "EUR", total: 373.94 },
    segments: [
      {
        group: "0",
        carrier: { name: "Ryanair" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "21:55",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "STN",
          name: "London Stansted",
          date: "2019-04-02",
          time: "23:05",
          timeZone: null,
          terminal: null
        },
        flightTime: 190,
        journeyTime: 190,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "Ryanair" },
        origin: {
          code: "STN",
          name: "London Stansted",
          date: "2019-04-04",
          time: "16:20",
          timeZone: null,
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-04",
          time: "21:30",
          timeZone: null,
          terminal: null
        },
        flightTime: 190,
        journeyTime: 190,
        waitTime: null
      }
    ],
    isLowCost: true,
    isRefundable: false,
    searchId: "5ca343996ddc006486ea2dcd",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "Ryanair" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "21:55",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "STN",
            name: "London Stansted",
            date: "2019-04-02",
            time: "23:05",
            timeZone: null,
            terminal: null
          },
          flightTime: 190,
          journeyTime: 190,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "Ryanair" },
          origin: {
            code: "STN",
            name: "London Stansted",
            date: "2019-04-04",
            time: "16:20",
            timeZone: null,
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-04",
            time: "21:30",
            timeZone: null,
            terminal: null
          },
          flightTime: 190,
          journeyTime: 190,
          waitTime: null
        }
      ]
    }
  }
};

let two_flights_oneStop = {
  "5ca33ed86ddc006486ea258a": {
    id: "5ca33ed86ddc006486ea258a",
    price: { currency: "EUR", total: 288.57 },
    segments: [
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "17:55",
          timeZone: "+03:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "18:55",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 120,
        journeyTime: 1030,
        waitTime: 745
      },
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-03",
          time: "07:20",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "LCY",
          name: "London City Arpt",
          date: "2019-04-03",
          time: "09:05",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 165,
        journeyTime: 1030,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-04-04",
          time: "06:30",
          timeZone: "+01:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "10:00",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 150,
        journeyTime: 325,
        waitTime: 55
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "10:55",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-04",
          time: "13:55",
          timeZone: "+03:00",
          terminal: "2"
        },
        flightTime: 120,
        journeyTime: 325,
        waitTime: null
      }
    ],
    isLowCost: false,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "17:55",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "18:55",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 120,
          journeyTime: 1030,
          waitTime: 745
        },
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-03",
            time: "07:20",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "LCY",
            name: "London City Arpt",
            date: "2019-04-03",
            time: "09:05",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 165,
          journeyTime: 1030,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-04-04",
            time: "06:30",
            timeZone: "+01:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "10:00",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 150,
          journeyTime: 325,
          waitTime: 55
        },
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "10:55",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-04",
            time: "13:55",
            timeZone: "+03:00",
            terminal: "2"
          },
          flightTime: 120,
          journeyTime: 325,
          waitTime: null
        }
      ]
    }
  },
  "5ca33ed86ddc006486ea258b": {
    id: "5ca33ed86ddc006486ea258b",
    price: { currency: "EUR", total: 288.57 },
    segments: [
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "14:35",
          timeZone: "+03:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "15:30",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 115,
        journeyTime: 320,
        waitTime: 40
      },
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "16:10",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "LCY",
          name: "London City Arpt",
          date: "2019-04-02",
          time: "17:55",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 165,
        journeyTime: 320,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-04-04",
          time: "06:30",
          timeZone: "+01:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "10:00",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 150,
        journeyTime: 525,
        waitTime: 260
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "14:20",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-04",
          time: "17:15",
          timeZone: "+03:00",
          terminal: "2"
        },
        flightTime: 115,
        journeyTime: 525,
        waitTime: null
      }
    ],
    isLowCost: false,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "14:35",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "15:30",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 115,
          journeyTime: 320,
          waitTime: 40
        },
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "16:10",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "LCY",
            name: "London City Arpt",
            date: "2019-04-02",
            time: "17:55",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 165,
          journeyTime: 320,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-04-04",
            time: "06:30",
            timeZone: "+01:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "10:00",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 150,
          journeyTime: 525,
          waitTime: 260
        },
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "14:20",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-04",
            time: "17:15",
            timeZone: "+03:00",
            terminal: "2"
          },
          flightTime: 115,
          journeyTime: 525,
          waitTime: null
        }
      ]
    }
  },
  "5ca33ed86ddc006486ea258c": {
    id: "5ca33ed86ddc006486ea258c",
    price: { currency: "EUR", total: 288.57 },
    segments: [
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "14:35",
          timeZone: "+03:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "15:30",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 115,
        journeyTime: 320,
        waitTime: 40
      },
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "16:10",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "LCY",
          name: "London City Arpt",
          date: "2019-04-02",
          time: "17:55",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 165,
        journeyTime: 320,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-04-04",
          time: "06:30",
          timeZone: "+01:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "10:00",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 150,
        journeyTime: 525,
        waitTime: 260
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "14:20",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-04",
          time: "17:15",
          timeZone: "+03:00",
          terminal: "2"
        },
        flightTime: 115,
        journeyTime: 525,
        waitTime: null
      }
    ],
    isLowCost: false,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "14:35",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "15:30",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 115,
          journeyTime: 320,
          waitTime: 40
        },
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "16:10",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "LCY",
            name: "London City Arpt",
            date: "2019-04-02",
            time: "17:55",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 165,
          journeyTime: 320,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-04-04",
            time: "06:30",
            timeZone: "+01:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "10:00",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 150,
          journeyTime: 525,
          waitTime: 260
        },
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "14:20",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-04",
            time: "17:15",
            timeZone: "+03:00",
            terminal: "2"
          },
          flightTime: 115,
          journeyTime: 525,
          waitTime: null
        }
      ]
    }
  },
  "5ca33ed86ddc006486ea258d": {
    id: "5ca33ed86ddc006486ea258d",
    price: { currency: "EUR", total: 288.57 },
    segments: [
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "17:55",
          timeZone: "+03:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "18:55",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 120,
        journeyTime: 1560,
        waitTime: 1275
      },
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-03",
          time: "16:10",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "LCY",
          name: "London City Arpt",
          date: "2019-04-03",
          time: "17:55",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 165,
        journeyTime: 1560,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-04-04",
          time: "18:10",
          timeZone: "+01:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "21:45",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 155,
        journeyTime: 325,
        waitTime: 55
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "22:40",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-05",
          time: "01:35",
          timeZone: "+03:00",
          terminal: "2"
        },
        flightTime: 115,
        journeyTime: 325,
        waitTime: null
      }
    ],
    isLowCost: false,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "17:55",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "18:55",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 120,
          journeyTime: 1560,
          waitTime: 1275
        },
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-03",
            time: "16:10",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "LCY",
            name: "London City Arpt",
            date: "2019-04-03",
            time: "17:55",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 165,
          journeyTime: 1560,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-04-04",
            time: "18:10",
            timeZone: "+01:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "21:45",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 155,
          journeyTime: 325,
          waitTime: 55
        },
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "22:40",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-05",
            time: "01:35",
            timeZone: "+03:00",
            terminal: "2"
          },
          flightTime: 115,
          journeyTime: 325,
          waitTime: null
        }
      ]
    }
  },
  "5ca33ed86ddc006486ea258e": {
    id: "5ca33ed86ddc006486ea258e",
    price: { currency: "EUR", total: 288.57 },
    segments: [
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-02",
          time: "14:35",
          timeZone: "+03:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-02",
          time: "15:30",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 115,
        journeyTime: 1230,
        waitTime: 950
      },
      {
        group: "0",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-03",
          time: "07:20",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "LCY",
          name: "London City Arpt",
          date: "2019-04-03",
          time: "09:05",
          timeZone: "+01:00",
          terminal: null
        },
        flightTime: 165,
        journeyTime: 1230,
        waitTime: null
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "LHR",
          name: "London Heathrow",
          date: "2019-04-04",
          time: "18:10",
          timeZone: "+01:00",
          terminal: "2"
        },
        destination: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "21:45",
          timeZone: "+02:00",
          terminal: null
        },
        flightTime: 155,
        journeyTime: 325,
        waitTime: 55
      },
      {
        group: "1",
        carrier: { name: "LOT Polish" },
        origin: {
          code: "WAW",
          name: "Warsaw",
          date: "2019-04-04",
          time: "22:40",
          timeZone: "+02:00",
          terminal: null
        },
        destination: {
          code: "SOF",
          name: "Sofia",
          date: "2019-04-05",
          time: "01:35",
          timeZone: "+03:00",
          terminal: "2"
        },
        flightTime: 115,
        journeyTime: 325,
        waitTime: null
      }
    ],
    isLowCost: false,
    isRefundable: false,
    searchId: "5ca33ed46ddc006486ea2588",
    orderedSegments: {
      "0": [
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-02",
            time: "14:35",
            timeZone: "+03:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-02",
            time: "15:30",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 115,
          journeyTime: 1230,
          waitTime: 950
        },
        {
          group: "0",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-03",
            time: "07:20",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "LCY",
            name: "London City Arpt",
            date: "2019-04-03",
            time: "09:05",
            timeZone: "+01:00",
            terminal: null
          },
          flightTime: 165,
          journeyTime: 1230,
          waitTime: null
        }
      ],
      "1": [
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "LHR",
            name: "London Heathrow",
            date: "2019-04-04",
            time: "18:10",
            timeZone: "+01:00",
            terminal: "2"
          },
          destination: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "21:45",
            timeZone: "+02:00",
            terminal: null
          },
          flightTime: 155,
          journeyTime: 325,
          waitTime: 55
        },
        {
          group: "1",
          carrier: { name: "LOT Polish" },
          origin: {
            code: "WAW",
            name: "Warsaw",
            date: "2019-04-04",
            time: "22:40",
            timeZone: "+02:00",
            terminal: null
          },
          destination: {
            code: "SOF",
            name: "Sofia",
            date: "2019-04-05",
            time: "01:35",
            timeZone: "+03:00",
            terminal: "2"
          },
          flightTime: 115,
          journeyTime: 325,
          waitTime: null
        }
      ]
    }
  }
};

let three_flights_multistop = [
  {
    id: "5ca346876ddc006486ea329f",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
      },
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
      },
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
    id: "5ca346876ddc006486ea32a0",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
      },
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
      },
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
    id: "5ca346876ddc006486ea32a1",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
      },
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
      },
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
  },
  {
    id: "5ca346876ddc006486ea32a2",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
      },
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
      },
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
  },
  {
    id: "5ca346876ddc006486ea32a3",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
        journeyTime: 815,
        waitTime: 485
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-04",
          time: "07:10",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-04-04",
          time: "09:15",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 815,
        waitTime: null
      },
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
      },
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
          journeyTime: 815,
          waitTime: 485
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-04",
            time: "07:10",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-04-04",
            time: "09:15",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 815,
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
    id: "5ca346886ddc006486ea32a4",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
        journeyTime: 1150,
        waitTime: 830
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-04",
          time: "07:10",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-04-04",
          time: "09:15",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 1150,
        waitTime: null
      },
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
      },
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
          journeyTime: 1150,
          waitTime: 830
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-04",
            time: "07:10",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-04-04",
            time: "09:15",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 1150,
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
    id: "5ca346886ddc006486ea32a5",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
        journeyTime: 815,
        waitTime: 485
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-04",
          time: "07:10",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-04-04",
          time: "09:15",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 815,
        waitTime: null
      },
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
      },
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
          journeyTime: 815,
          waitTime: 485
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-04",
            time: "07:10",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-04-04",
            time: "09:15",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 815,
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
  },
  {
    id: "5ca346886ddc006486ea32a6",
    price: { currency: "EUR", total: 1164 },
    segments: [
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
        journeyTime: 1150,
        waitTime: 830
      },
      {
        group: "0",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-04",
          time: "07:10",
          timeZone: "+03:00",
          terminal: "I"
        },
        destination: {
          code: "LGW",
          name: "London Gatwick",
          date: "2019-04-04",
          time: "09:15",
          timeZone: "+01:00",
          terminal: "S"
        },
        flightTime: 245,
        journeyTime: 1150,
        waitTime: null
      },
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
      },
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
          journeyTime: 1150,
          waitTime: 830
        },
        {
          group: "0",
          carrier: { name: "Turkish Airlines" },
          origin: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-04",
            time: "07:10",
            timeZone: "+03:00",
            terminal: "I"
          },
          destination: {
            code: "LGW",
            name: "London Gatwick",
            date: "2019-04-04",
            time: "09:15",
            timeZone: "+01:00",
            terminal: "S"
          },
          flightTime: 245,
          journeyTime: 1150,
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
  },
  {
    id: "5ca346886ddc006486ea32a7",
    price: { currency: "EUR", total: 1209 },
    segments: [
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
      },
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
      },
      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "MAD",
          name: "Madrid",
          date: "2019-04-05",
          time: "18:20",
          timeZone: "+02:00",
          terminal: "1"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-05",
          time: "23:30",
          timeZone: "+03:00",
          terminal: "I"
        },
        flightTime: 250,
        journeyTime: 1460,
        waitTime: 1035
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
        journeyTime: 1460,
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
            time: "18:20",
            timeZone: "+02:00",
            terminal: "1"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-05",
            time: "23:30",
            timeZone: "+03:00",
            terminal: "I"
          },
          flightTime: 250,
          journeyTime: 1460,
          waitTime: 1035
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
          journeyTime: 1460,
          waitTime: null
        }
      ]
    }
  },
  {
    id: "5ca346886ddc006486ea32a8",
    price: { currency: "EUR", total: 1209 },
    segments: [
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
      },
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
      },
      {
        group: "2",
        carrier: { name: "Turkish Airlines" },
        origin: {
          code: "MAD",
          name: "Madrid",
          date: "2019-04-05",
          time: "18:20",
          timeZone: "+02:00",
          terminal: "1"
        },
        destination: {
          code: "IST",
          name: "Istanbul",
          date: "2019-04-05",
          time: "23:30",
          timeZone: "+03:00",
          terminal: "I"
        },
        flightTime: 250,
        journeyTime: 1460,
        waitTime: 1035
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
        journeyTime: 1460,
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
            time: "18:20",
            timeZone: "+02:00",
            terminal: "1"
          },
          destination: {
            code: "IST",
            name: "Istanbul",
            date: "2019-04-05",
            time: "23:30",
            timeZone: "+03:00",
            terminal: "I"
          },
          flightTime: 250,
          journeyTime: 1460,
          waitTime: 1035
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
          journeyTime: 1460,
          waitTime: null
        }
      ]
    }
  }
];


describe("AirTicketsSearchFilterPanel", () => {
  let filtersFromServer = {
    price: { minPrice: 282.0, maxPrice: 2988.0, currency: "EUR" },
    airlines: [
      { airlineId: "0B", airlineName: "Blue Air" },
      { airlineId: "2L", airlineName: "Helvetic Airways" },
      { airlineId: "A3", airlineName: "Aegean Air" },
      { airlineId: "AF", airlineName: "Air France" },
      { airlineId: "AJ0", airlineName: "AnadoluJet" },
      { airlineId: "AZ", airlineName: "Alitalia" },
      { airlineId: "BA", airlineName: "British Airways" },
      { airlineId: "CL", airlineName: "Lufthansa CityLine" },
      { airlineId: "FB", airlineName: "Bulgaria Air" },
      { airlineId: "FR", airlineName: "Ryanair" },
      { airlineId: "HV", airlineName: "Transavia Airlines" },
      { airlineId: "JU", airlineName: "Air Serbia" },
      { airlineId: "KL", airlineName: "KLM" },
      { airlineId: "LH", airlineName: "Lufthansa" },
      { airlineId: "LO", airlineName: "LOT Polish" },
      { airlineId: "LX", airlineName: "SWISS" },
      { airlineId: "OS", airlineName: "Austrian Airlines" },
      { airlineId: "RO", airlineName: "Tarom-Romanian" },
      { airlineId: "SU", airlineName: "Aeroflot" },
      { airlineId: "TK", airlineName: "Turkish Airlines" }
    ],
    departure: {
      date: { min: "2019-04-02", max: "2019-04-02" },
      landing: { min: "07:15", max: "23:05:00" },
      takeOff: { min: "11:50", max: "21:55" }
    },
    arrival: {
      date: { min: "2019-04-04", max: "2019-04-04" },
      landing: { min: "01:35", max: "23:00" },
      takeOff: { min: "06:00", max: "22:45" }
    },
    waiting: { min: 40, max: 1360 },
    airports: {
      arrivals: [
        { airportId: "LCY", airportName: "London City Arpt" },
        { airportId: "LHR", airportName: "London Heathrow" },
        { airportId: "LGW", airportName: "London Gatwick" },
        { airportId: "STN", airportName: "London Stansted" },
        { airportId: "LTN", airportName: "Luton" }
      ],
      departures: [{ airportId: "SOF", airportName: "Sofia" }],
      transfers: [
        { airportId: "WAW", airportName: "Warsaw" },
        { airportId: "MUC", airportName: "Munich" },
        { airportId: "VIE", airportName: "Vienna" },
        { airportId: "FRA", airportName: "Frankfurt" },
        { airportId: "IST", airportName: "Istanbul" },
        { airportId: "ATH", airportName: "Athens" },
        { airportId: "OTP", airportName: "Bucharest-Otopeni" },
        { airportId: "BEG", airportName: "Belgrade" },
        { airportId: "FCO", airportName: "Rome-Fiumicino" },
        { airportId: "BJV", airportName: "Milas Arpt" },
        { airportId: "SVO", airportName: "Moscow-Sheremetyevo" },
        { airportId: "ZRH", airportName: "Zurich" },
        { airportId: "CDG", airportName: "Paris Charles De Gaulle" },
        { airportId: "AMS", airportName: "Amsterdam" }
      ]
    },
    changes: [
      { changesId: "0", changesName: "nonstop" },
      { changesId: "1", changesName: "onestop" },
      { changesId: "2", changesName: "twoormorestops" }
    ]
  };

  describe("renders the controls for stops correctly", () => {
    test("renders all the checkboxes", async () => {
      let TEST_ID = "stop-checkbox";

      const { getByTestId, getAllByTestId } = render(
        <AirTicketsSearchFilterPanel
          requestFilters={() => Promise.resolve(filtersFromServer)}
          allowFiltering={true}
        />
      );

      let nodes = await waitForElement(() => getAllByTestId(TEST_ID));
      expect(nodes.length).toBe(3);
    });
  });
});
