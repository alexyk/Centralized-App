export type Filight = {
  id: string,
  price: { currency: "EUR", total: number },
  segments: [FlightSegment],
  isLowCost: boolean,
  isRefundable: boolean,
  searchId: string,
  orderedSegments: {
    [groupIndex: string]: [FlightSegment]
  }
};

type FlightSegment = {
  group: string,
  carrier: { name: string },
  origin: {
    code: string,
    name: string,
    date: string, //"2019-04-03",
    time: string, //"16:05",
    timeZone: null | string, //"+03:00",
    terminal: null | string
  },
  destination: {
    code: string,
    name: string,
    date: string, //"2019-04-03",
    time: string, //"16:05",
    timeZone: null | string, //"+03:00",
    terminal: null | string
  },
  flightTime: number, // 75
  journeyTime: number, //400
  waitTime: number //75
};
