import moment from "moment";
import * as _ from "ramda";

// function getCancellationFees(reservation) {
//   const hotelBooking = reservation.booking.hotelBooking;
//   const arrivalDateString = hotelBooking[0].arrivalDate;
//   const creationDateString = hotelBooking[0].creationDate;
//   const diffDaysBetweenCreationAndArrivalDates = moment(
//     arrivalDateString,
//     "YYYY-MM-DD"
//   ).diff(moment(creationDateString, "YYYY-MM-DD"), "days");
//   let feeTable = Array(diffDaysBetweenCreationAndArrivalDates).fill({
//     from: "",
//     amt: 0,
//     locPrice: 0
//   }); // jagged array for storing all rooms fees
//   const cancellationFees = [];
//
//   for (let i = 0; i < hotelBooking.length; i++) {
//     const creationDate = moment(hotelBooking[i].creationDate, "YYYY-MM-DD");
//     if (hotelBooking[i].room.canxFees.length === 0) {
//       continue;
//     }
//     const earliestToLatestRoomCancellationFees = hotelBooking[
//       i
//     ].room.canxFees.sort((x, y) => {
//       return x.from >= y.from ? 1 : -1; // sort ascending by 'from date'
//     });
//
//     const roomFeesByDaysBefore = Array(
//       diffDaysBetweenCreationAndArrivalDates
//     ).fill({ amt: 0, locPrice: 0 });
//
//     for (let j = 0; j < earliestToLatestRoomCancellationFees.length; j++) {
//       const cancellation = earliestToLatestRoomCancellationFees[j];
//       let fromDate = moment(cancellation.from).utc();
//
//       const daysBefore = moment(fromDate).diff(creationDate, "days");
//
//       const amt = cancellation.amount.amt;
//       const locPrice = cancellation.locPrice;
//
//       roomFeesByDaysBefore.fill(
//         { from: fromDate.format("DD MMM YYYY"), amt, locPrice },
//         daysBefore,
//         roomFeesByDaysBefore.length
//       );
//     }
//
//     feeTable = feeTable.map(function(fee, idx) {
//       return {
//         from: roomFeesByDaysBefore[idx].from,
//         amt: fee.amt + roomFeesByDaysBefore[idx].amt,
//         locPrice: fee.locPrice + roomFeesByDaysBefore[idx].locPrice
//       };
//     });
//   }
//
//   const uniqueFees = [...new Set(feeTable.map(item => item.amt))];
//
//   if (uniqueFees.length === 1 && uniqueFees[0] === 0) {
//     return cancellationFees;
//   }
//
//   for (let i = 0; i < feeTable.length; i++) {
//     if (
//       (i === 0 && feeTable[i].amt !== 0) ||
//       (feeTable[i].amt !== 0 &&
//         feeTable[i - 1].from !== feeTable[i].from &&
//         feeTable[i - 1].amt !== feeTable[i].amt)
//     ) {
//       if (i !== 0 && feeTable[i - 1].amt === 0) {
//         const creationDate = moment(creationDateString, "YYYY-MM-DD");
//         cancellationFees.push({
//           from: creationDate.add(i, "days").format("YYYY-MM-DD"),
//           amt: 0,
//           loc: 0
//         });
//       }
//       const creationDate = moment(creationDateString, "YYYY-MM-DD");
//       cancellationFees.push({
//         from: creationDate.add(i, "days").format("YYYY-MM-DD"),
//         amt: feeTable[i].amt,
//         loc: feeTable[i].locPrice
//       });
//     }
//   }
//
//   return cancellationFees;
// }

const _getAllCanxFeesGroupedByDate = _.pipe(
  _.path(["booking", "hotelBooking"]),
  _.map(_.prop("room")),
  _.reduce((acc, room) => acc.concat(room.canxFees), []),
  _.groupBy(_.prop("from"))
);

const _convertToADatePriceMap = _.pipe(
  _.mapObjIndexed(_.sort((a, b) => b.amount.amt - a.amount.amt)),
  _.mapObjIndexed(
    _.pipe(
      _.head,
      _.path(["amount", "amt"])
    )
  )
);

function getCancellationFees(reservation) {
  let groupedByDate = _getAllCanxFeesGroupedByDate(reservation);
  return _convertToADatePriceMap(groupedByDate);
}

describe("getCancellationFees", () => {
  test("it works", () => {
    let reservation = {
      currency: "EUR",
      booking: {
        id: null,
        creationDate: "2019-04-10",
        hotelBooking: [
          {
            id: 331676610,
            hotelId: 70931466,
            creationDate: "2019-04-10",
            arrivalDate: "2019-05-02",
            nights: 1,
            room: {
              nightCost: [
                {
                  night: 0,
                  sellingPrice: {
                    amt: 427.13
                  }
                }
              ],
              messages: [
                {
                  type: "Supplier Notes",
                  text:
                    "1x Double or Twin Estimated total amount of taxes & fees for this booking: .90 Euro   payable on arrival.Car park YES (without additional debit notes). Early departure. Identification card at arrival. Marriage certificate required for a couple to share room. No hen/stag or any other parties allowed  - .\n<br/><br/> No amendments or name changes can be made to this booking once it is confirmed."
                }
              ],
              totalSellingPrice: {
                amt: 427.13,
                locPrice: 586.732727261535658429
              },
              canxFees: [
                {
                  amount: {
                    amt: 528.278
                  },
                  locPrice: 725.676004242899233497,
                  from: 1555459200000
                },
                {
                  amount: {
                    amt: 683.408
                  },
                  locPrice: 938.77236361845708472,
                  from: 1556668800000
                },
                {
                  amount: {
                    amt: 256.27799999999996
                  },
                  locPrice: 352.039636356921348207,
                  from: 1554889990419
                }
              ],
              roomType: {
                text: "Double Or Twin Standard"
              }
            },
            totalSellingPrice: {
              amt: 427.13,
              locPrice: 586.732727261535658429
            }
          },
          {
            id: 331676611,
            hotelId: 70931466,
            creationDate: "2019-04-10",
            arrivalDate: "2019-05-02",
            nights: 1,
            room: {
              nightCost: [
                {
                  night: 0,
                  sellingPrice: {
                    amt: 427.13
                  }
                }
              ],
              messages: [
                {
                  type: "Supplier Notes",
                  text:
                    "1x Double or Twin Estimated total amount of taxes & fees for this booking: .90 Euro   payable on arrival.Car park YES (without additional debit notes). Early departure. Identification card at arrival. Marriage certificate required for a couple to share room. No hen/stag or any other parties allowed  - .\n<br/><br/> No amendments or name changes can be made to this booking once it is confirmed."
                }
              ],
              totalSellingPrice: {
                amt: 427.13,
                locPrice: 586.732727261535658429
              },
              canxFees: [
                {
                  amount: {
                    amt: 528.278
                  },
                  locPrice: 725.676004242899233497,
                  from: 1555459200000
                },
                {
                  amount: {
                    amt: 683.408
                  },
                  locPrice: 938.77236361845708472,
                  from: 1556668800000
                }
              ],
              roomType: {
                text: "Double Or Twin Standard"
              }
            },
            totalSellingPrice: {
              amt: 427.13,
              locPrice: 586.732727261535658429
            }
          },
          {
            id: 331676612,
            hotelId: 70931466,
            creationDate: "2019-04-10",
            arrivalDate: "2019-05-02",
            nights: 1,
            room: {
              nightCost: [
                {
                  night: 0,
                  sellingPrice: {
                    amt: 427.13
                  }
                }
              ],
              messages: [
                {
                  type: "Supplier Notes",
                  text:
                    "1x Double or Twin Estimated total amount of taxes & fees for this booking: .90 Euro   payable on arrival.Car park YES (without additional debit notes). Early departure. Identification card at arrival. Marriage certificate required for a couple to share room. No hen/stag or any other parties allowed  - .\n<br/><br/> No amendments or name changes can be made to this booking once it is confirmed."
                }
              ],
              totalSellingPrice: {
                amt: 427.13,
                locPrice: 586.732727261535658429
              },
              canxFees: [
                {
                  amount: {
                    amt: 528.278
                  },
                  locPrice: 725.676004242899233497,
                  from: 1555459200000
                },
                {
                  amount: {
                    amt: 683.408
                  },
                  locPrice: 938.77236361845708472,
                  from: 1556668800000
                }
              ],
              roomType: {
                text: "Double Or Twin Standard"
              }
            },
            totalSellingPrice: {
              amt: 427.13,
              locPrice: 586.732727261535658429
            }
          }
        ]
      },
      fiatPrice: 1281.38999999999987267074175179004669189453125,
      locPrice: 1760.19818178460681912,
      preparedBookingId: 7293
    };

    let expectecResult = {};

    let cancellationFees = getCancellationFees(reservation);
    expect(cancellationFees).toEqual(expectecResult);
  });
});
