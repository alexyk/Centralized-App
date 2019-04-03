import moment from "moment";
import * as _ from "ramda";

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

function filterFlights(filters, flights) {
  if (filters.price) {
    flights = filterByPrice(filters, flights);
  }
  if (filters.changes) {
    flights = filterByChanges(filters, flights);
  }
  if (filters.airlines) {
    flights = filterByAirlines(filters, flights);
  }

  if (filters.airports) {
    flights = filterByAirports(filters, flights);
  }

  if (filters.airports.transfers) {
    flights = filterByTransfers(filters, flights);
  }

  return flights;
}

/**
 * By Airports
 */
function filterByAirports(filters, flights) {
  let allAirports = filters.airports.all;
  let groupedByCity = _.groupBy(_.prop("city"), allAirports);

  return flights.filter(flight => {
    return _passesForAllCities(flight, groupedByCity);
  });
}

function _passesForAllCities(flight, groupedByCity) {
  let cities = Object.keys(groupedByCity);
  let passesForCities = 0;
  cities.forEach(cityName => {
    if (_passesForCity(groupedByCity, cityName, flight)) {
      passesForCities += 1;
    }
  });
  return passesForCities === cities.length;
}

function _passesForCity(groupedByCity, cityName, flight) {
  let currentCityAirports = groupedByCity[cityName];
  let selectedAirports = currentCityAirports
    .filter(ap => ap.selected)
    .map(_.prop("airportId"));
  let nonSelectedAirports = currentCityAirports
    .filter(ap => !ap.selected)
    .map(_.prop("airportId"));

  let hasSelectedAirports = _hasSelectedAirports(flight, selectedAirports);
  let doesNotHaveNonSelectedAirports = _doesNotHaveNonSelectedAirports(
    flight,
    nonSelectedAirports
  );
  return hasSelectedAirports && doesNotHaveNonSelectedAirports;
}

function _doesNotHaveNonSelectedAirports(flight, nonSelectedAirports) {
  if (nonSelectedAirports.length === 0) {
    return true;
  }
  return (
    flight.segments.filter(segment => {
      let containedInOrigin =
        nonSelectedAirports.indexOf(segment.origin.code) !== -1;
      let containedInDestination =
        nonSelectedAirports.indexOf(segment.destination.code) !== -1;
      return containedInOrigin || containedInDestination;
    }).length === 0
  );
}

function _hasSelectedAirports(flight, selectedAirports) {
  return (
    flight.segments.filter(segment => {
      let containedInOrigin =
        selectedAirports.indexOf(segment.origin.code) !== -1;
      let containedInDestination =
        selectedAirports.indexOf(segment.destination.code) !== -1;
      return containedInOrigin || containedInDestination;
    }).length > 0
  );
}

/**
 * By Number Of Changes
 */
function filterByChanges(filters, flights) {
  let selectedChanges = filters.changes.map(_.prop("changesId"));
  let lookingForDirect = selectedChanges.indexOf("0") !== -1;
  let lookingForUpToOneStop = selectedChanges.indexOf("1") !== -1;
  let lookingForMultiStop = selectedChanges.indexOf("2") !== -1;
  return flights.filter(flight => {
    if (lookingForMultiStop) {
      return flight;
    }
    if (lookingForUpToOneStop) {
      return _isWithUpToOneStop(flight);
    }
    if (lookingForDirect) {
      return _isDirect(flight);
    }
  });
}

function _isDirect(flight) {
  let segmentsByGroup = flight.orderedSegments;
  let allGroups = Object.values(segmentsByGroup);
  let groupsWithDirectFlights = allGroups.filter(
    segmentGroup => segmentGroup.length === 1
  );
  return groupsWithDirectFlights.length === allGroups.length;
}
function _isWithUpToOneStop(flight) {
  let segmentsByGroup = flight.orderedSegments;
  let allGroups = Object.values(segmentsByGroup);
  let groupsWithUpToOneStop = allGroups.filter(
    segmentGroup => segmentGroup.length <= 2
  );
  return groupsWithUpToOneStop.length === allGroups.length;
}

/**
 * By Airlines
 */
function filterByAirlines(filters, flights) {
  let selectedCarriers = filters.airlines.map(_.prop("airlineName"));
  return flights.filter(flight => {
    let flightCarriers = flight.segments
      .map(_.path(["carrier", "name"]))
      .reduce((acc, current) => {
        return {
          ...acc,
          [current]: ""
        };
      }, {});
    flightCarriers = Object.keys(flightCarriers);
    let matches = selectedCarriers.filter(sa => {
      return flightCarriers.indexOf(sa) !== -1;
    });
    return (
      matches.length === selectedCarriers.length &&
      matches.length === flightCarriers.length
    );
  });
}

/**
 * By Transfers
 */
function filterByTransfers(filters, flights) {
  let selectedTransfers = filters.airports.transfers.map(_.prop("airportId"));
  return flights.filter(flight => {
    let flightTransfers = _findTransfersInSegments(flight);
    let matches = selectedTransfers.filter(st => {
      return flightTransfers.indexOf(st) !== -1;
    });
    return matches.length > 0;
  });
}

function _findTransfersInSegments(flight) {
  let { orderedSegments } = flight;
  let inGroups = _.groupBy(_.prop("group"), orderedSegments);
  let transformedToTransfers = _.mapObjectIndexed((value, index) => {
    if (value.length > 2) {
      let transfers = value.slice(1, value.length - 2);
      return transfers.map(_.path(["origin", "code"]));
    }
  }, inGroups);
  return Object.values(transformedToTransfers)
    .filter(_.identity)
    .reduce(_.concat);
}

/**
 * By Price
 */
function filterByPrice(filters, flights) {
  let { minPrice, maxPrice } = filters.price;
  return flights.filter(flight => {
    return flight.price.total >= minPrice && flight.price.total <= maxPrice;
  });
}
//
// function filterByWaitingTime(filters, flights) {
//   let { min, max } = filters.waiting;
//   return flights.filter(flight => {
//     let totalWaitingTime = flight.segments.reduce((acc, segment) => {
//       return acc + segment.waitTime;
//     }, 0);
//     return totalWaitingTime >= min && totalWaitingTime <= max;
//   });
// }

describe("flight filtering", () => {
  describe("filterByPrice", () => {
    let flights = [
      {
        id: "5ca346876ddc006486ea329f",
        price: { currency: "EUR", total: 200.0 },
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
        price: { currency: "EUR", total: 2988.5 },
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
        price: { currency: "EUR", total: 10000.0 },
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
        price: { currency: "EUR", total: 100 },
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
        price: { currency: "EUR", total: 3000.22 },
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
        price: { currency: "EUR", total: 100 },
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

    test("filterByPrice 1", () => {
      let filters = {
        price: { minPrice: 282.0, maxPrice: 2988.0, currency: "EUR" }
      };

      let expectedResult = [
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
        }
      ];

      let result = filterByPrice(filters, flights);
      expect(result).toEqual(expectedResult);
    });

    test("filterByPrice 2", () => {
      let filters = {
        price: { minPrice: 9000, maxPrice: 10000, currency: "EUR" }
      };
      let expectedResult = [
        {
          id: "5ca346876ddc006486ea32a3",
          price: { currency: "EUR", total: 10000.0 },
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
        }
      ];
      let result = filterByPrice(filters, flights);
      expect(result).toEqual(expectedResult);
    });

    test("filterByPrice 3", () => {
      let filters = {
        price: { minPrice: 11000, maxPrice: 12000, currency: "EUR" }
      };
      let expectedResult = [];
      let result = filterByPrice(filters, flights);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("filterByChanges", () => {
    //waiting: { min: 40, max: 1360 }
    let flights = [
      {
        id: "5ca346876ddc006486ea329f", // direct
        price: { currency: "EUR", total: 200.0 },
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
            }
          ],
          "1": [
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
        id: "5ca346876ddc006486ea32a0", //one-stop + direct
        price: { currency: "EUR", total: 2988.5 },
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
        id: "5ca346876ddc006486ea32a1", // multistop + one-stop + direct
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
            }
          ]
        }
      },
      {
        id: "5ca346876ddc006486ea32a2", // direct
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
            }
          ],
          "1": [
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
        id: "5ca346876ddc006486ea32a3", // one-stop
        price: { currency: "EUR", total: 10000.0 },
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
        id: "5ca346886ddc006486ea32a4", //multistop + one-stop
        price: { currency: "EUR", total: 100 },
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
      }
    ];

    let flightIds = {
      directOnlyFlights: [
        "5ca346876ddc006486ea329f",
        "5ca346876ddc006486ea32a2"
      ],
      withUpToOneStop: [
        "5ca346876ddc006486ea329f",
        "5ca346876ddc006486ea32a0",
        "5ca346876ddc006486ea32a2",
        "5ca346876ddc006486ea32a3"
      ],
      withMultiStop: ["5ca346876ddc006486ea32a1", "5ca346886ddc006486ea32a4"],
      allIds: Object.values(flights).map(_.prop("id"))
    };

    test("up to one stop", () => {
      let filters = {
        changes: [
          // { changesId: "0", changesName: "nonstop" },
          { changesId: "1", changesName: "onestop" }
          // { changesId: "2", changesName: "twoormorestops" }
        ]
      };
      let result = filterByChanges(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.withUpToOneStop);
    });

    test("direct only", () => {
      let filters = {
        changes: [{ changesId: "0", changesName: "nonstop" }]
      };
      let result = filterByChanges(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.directOnlyFlights);
    });

    test("multistop", () => {
      let filters = {
        changes: [{ changesId: "2", changesName: "twoormorestops" }]
      };
      let result = filterByChanges(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.allIds);
    });

    describe("multiple - prioritizing", () => {
      test("when multistop is selected - return all", () => {
        let filters = {
          changes: [
            { changesId: "0", changesName: "nonstop" },
            { changesId: "1", changesName: "onestop" },
            { changesId: "2", changesName: "twoormorestops" }
          ]
        };
        let result = filterByChanges(filters, flights);
        let resultIds = result.map(_.prop("id"));
        expect(resultIds).toEqual(flightIds.allIds);
      });

      test("when direct and with one stop are selected - return all with up to one stop", () => {
        let filters = {
          changes: [
            { changesId: "0", changesName: "nonstop" },
            { changesId: "1", changesName: "onestop" }
          ]
        };
        let result = filterByChanges(filters, flights);
        let resultIds = result.map(_.prop("id"));
        expect(resultIds).toEqual(flightIds.withUpToOneStop);
      });
    });
  });

  describe("filterByAirlines", () => {
    let flights = [
      {
        id: "5ca346876ddc006486ea329f", // one carrier
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
        id: "5ca346876ddc006486ea32a0", // two carriers
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
            group: "1",
            carrier: { name: "Helvetic Airways" },
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
        id: "5ca346876ddc006486ea32a1", // Four carriers
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
            group: "1",
            carrier: { name: "Helvetic Airways" },
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
            carrier: { name: "Aegean Air" },
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
            group: "2",
            carrier: { name: "Air France" },
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

    let flightIds = {
      oneCarrier: ["5ca346876ddc006486ea329f"],
      twoCarriers: ["5ca346876ddc006486ea32a0"],
      fourCarriers: ["5ca346876ddc006486ea32a1"]
    };

    test("filterByAirlines with one option", () => {
      let filters = {
        airlines: [{ airlineId: "0B", airlineName: "Blue Air" }]
      };

      let result = filterByAirlines(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.oneCarrier);
    });

    test("filterByAirlines with two options", () => {
      let filters = {
        airlines: [
          { airlineId: "0B", airlineName: "Blue Air" },
          { airlineId: "2L", airlineName: "Helvetic Airways" }
        ]
      };

      let result = filterByAirlines(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.twoCarriers);
    });

    test("filterByAirlines with multiple options", () => {
      let filters = {
        airlines: [
          { airlineId: "0B", airlineName: "Blue Air" },
          { airlineId: "2L", airlineName: "Helvetic Airways" },
          { airlineId: "A3", airlineName: "Aegean Air" },
          { airlineId: "AF", airlineName: "Air France" }
        ]
      };

      let result = filterByAirlines(filters, flights);
      let resultIds = result.map(_.prop("id"));
      expect(resultIds).toEqual(flightIds.fourCarriers);
    });

    test("filterByAirlines with no matches 1", () => {
      let filters = {
        airlines: [
          { airlineId: "0B", airlineName: "Blue Air" },
          { airlineId: "2L", airlineName: "non-existent" }
        ]
      };
      let result = filterByAirlines(filters, flights);
      expect(result).toEqual([]);
    });

    test("filterByAirlines with no matches 2", () => {
      let filters = {
        airlines: [{ airlineId: "2L", airlineName: "non-existent" }]
      };
      let result = filterByAirlines(filters, flights);
      expect(result).toEqual([]);
    });
  });

  describe("filterByAirports", () => {
    describe("testing with filters for one city", () => {
      //  { airportId: "LCY", airportName: "London City Arpt" },
      //  { airportId: "LHR", airportName: "London Heathrow" }

      let flights = [
        {
          id: "5ca346876ddc006486ea329f", // Airports - SOFIA: SOF | LONDON: LHR, LGW | MAD, TXL
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

      test("with LHR, SOF", () => {
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
              },
              { airportId: "LTN", airportName: "Luton", city: "London" }
            ]
          }
        };
        let result = filterByAirports(filters, flights);
        let resultIds = result.map(_.prop("id"));
        let expectedResultIds = [flights[1].id];
        expect(resultIds).toEqual(expectedResultIds);
      });
      test("with LHR, LGW", () => {
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
                city: "London",
                selected: true
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
        let expectedResultIds = [flights[0].id, flights[1].id];
        expect(resultIds).toEqual(expectedResultIds);
      });
      test("with LTN, LHR, SOF", () => {
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
              },
              {
                airportId: "LTN",
                airportName: "Luton",
                city: "London",
                selected: true
              }
            ]
          }
        };
        let result = filterByAirports(filters, flights);
        let resultIds = result.map(_.prop("id"));
        let expectedResultIds = [flights[1].id, flights[2].id];
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
                city: "London",
                selected: true
              },
              {
                airportId: "STN",
                airportName: "London Stansted",
                city: "London"
              },
              {
                airportId: "LTN",
                airportName: "Luton",
                city: "London",
                selected: true
              }
            ]
          }
        };
        let result = filterByAirports(filters, flights);
        let resultIds = result.map(_.prop("id"));
        let expectedResultIds = [flights[0].id, flights[1].id, flights[2].id];
        expect(resultIds).toEqual(expectedResultIds);
      });
    });
  });
});
