import moment from "moment";

type DateInfo = {
  date: number, // DD
  month: string, //MMM
  year: string, // YYYY
  day: string // DDD
};

export function parseAccommodationDates(
  arrivalTime: number,
  nights: number,
  leavingTime: number
) {
  // ARRIVAL TIME
  // if is not valid
  // - if no arrivalTime
  if (!arrivalTime) {
    throw new TypeError(
      `Expected 'arrivalTime' to be a timestamp, but received ${typeof arrivalTime} : ${arrivalTime}`
    );
  }

  // - if time is not a timestamp with 00:00 h
  let at = validateAndConvertTime(arrivalTime, "arrivalTime");

  // LEAVING TIME
  let lt;
  if (leavingTime) {
    lt = validateAndConvertTime(leavingTime, "leavingTime");
  } else {
    // - if nights is not a number greater than zero
    if (!isPositiveNumber(nights)) {
      throw new TypeError(
        `Expected 'nights' to be a positive number, greater than zero, but received a ${typeof nights}: ${nights}`
      );
    }
    lt = moment(at).add(nights, "days");
  }

  let startDate: DateInfo = {
    date: moment(at).format("DD"),
    month: moment(at).format("MMM"),
    year: moment(at).format("YYYY"),
    day: moment(at).format("ddd")
  };
  let endDate: DateInfo = {
    date: moment(lt).format("DD"),
    month: moment(lt).format("MMM"),
    year: moment(lt).format("YYYY"),
    day: moment(lt).format("ddd")
  };

  return {
    startDate,
    endDate
  };
}

function isPositiveNumber(value) {
  const nan = isNaN(Number(value));
  const small = Number(value) <= 0;
  return !nan && !small;
}

function validateAndConvertTime(time, label) {
  let convertedToUtc = moment(time).utc();

  // - if is not a valid moment date
  if (!convertedToUtc.isValid()) {
    throw new TypeError(
      `Invalid '${label}'. Expected a timestamp, and received a ${typeof time}: ${time}`
    );
  }
  // - if has hours other than 00:00
  if (moment(convertedToUtc).format("HH:mm") !== "00:00") {
    throw new TypeError(
      `Expected '${label}' to be set to 00:00 time, but received: ${moment(
        convertedToUtc
      ).format("HH:mm")} - ${time}`
    );
  }

  return convertedToUtc;
}
