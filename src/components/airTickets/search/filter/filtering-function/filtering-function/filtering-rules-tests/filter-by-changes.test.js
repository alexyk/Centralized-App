import * as _ from "ramda";
import { filterByChanges } from "../filtering-function";

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
    directOnlyFlights: ["5ca346876ddc006486ea329f", "5ca346876ddc006486ea32a2"],
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
