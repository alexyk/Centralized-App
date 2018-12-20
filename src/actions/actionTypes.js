// userInfo actions
export const userInfo = {
  SET_USER_INFO: "SET_USER_INFO",
  LOG_OUT: "LOG_OUT"
};

// paymentInfo actions
export const paymentInfo = {
  SET_CURRENCY: "SET_CURRENCY"
};

// paymentInfo actions
export const modalsInfo = {
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL"
};

// hotels searchInfo actions
export const hotelsSearchInfo = {
  SET_REGION: "SET_REGION",
  SET_ROOMS_BY_COUNT_OF_ROOMS: "SET_ROOMS_BY_COUNT_OF_ROOMS",
  SET_ROOMS: "SET_ROOMS",
  SET_ADULTS: "SET_ADULTS",
  SET_CHILDREN: "SET_CHILDREN",
  SET_HOTELS_SEARCH_INFO: "SET_HOTELS_SEARCH_INFO"
};

// homes searchInfo actions
export const homesSearchInfo = {
  SET_COUNTRY: "SET_COUNTRY",
  SET_GUESTS: "SET_GUESTS",
  SET_HOMES_SEARCH_INFO: "SET_HOMES_SEARCH_INFO"
};

// socket actions
export const exchangerSocketInfo = {
  SET_EXCHANGER_WEBSOCKET_CONNECTION: "SET_EXCHANGER_WEBSOCKET_CONNECTION"
};

// locAmounts actions
export const locAmountsInfo = {
  UPDATE_LOC_AMOUNTS: "UPDATE_LOC_AMOUNTS",
  REMOVE_LOC_AMOUNT: "REMOVE_LOC_AMOUNT",
  CLEAR_LOC_AMOUNTS: "CLEAR_LOC_AMOUNTS"
};

// currencies exchangeRates actions
export const exchangeRatesInfo = {
  SET_CURRENCY_EXCHANGE_RATES: "SET_CURRENCY_EXCHANGE_RATES",
  SET_LOC_EUR_RATE: "SET_LOC_EUR_RATE",
  SET_LOC_RATE_FIAT_AMOUNT: "SET_LOC_RATE_FIAT_AMOUNT"
};

// loc price update timer actions
export const locPriceUpdateTimerInfo = {
  SET_INITIAL_SECONDS: "SET_INITIAL_SECONDS",
  SET_SECONDS: "SET_SECONDS",
  RESET: "RESET"
};

// air tickets search info actions
export const airTicketsSearchInfo = {
  SET_FLIGHT_ROUTING: 'SET_FLIGHT_ROUTING',
  SET_FLIGHT_CLASS: 'SET_FLIGHT_CLASS',
  SET_STOPS: 'SET_STOPS',
  SET_DEPARTURE_TIME: 'SET_DEPARTURE_TIME',
  SET_ORIGIN: 'SET_ORIGIN',
  SET_DESTINATION: 'SET_DESTINATION',
  SET_MULTI_STOPS_DESTINATIONS: 'SET_MULTI_STOPS_DESTINATIONS',
  SET_ADULTS: 'SET_ADULTS',
  SET_CHILDREN: 'SET_CHILDREN',
  SET_AIR_TICKETS_SEARCH_INFO: 'SET_AIR_TICKETS_SEARCH_INFO',
  SET_FLEX_SEARCH: 'SET_FLEX_SEARCH',
};

// burger menu actions
export const burgerMenuInfo = {
  SET_SHOW_MENU: "SET_SHOW_MENU"
};

// search dates actions
export const searchDatesInfo = {
  SET_START_DATE: "SET_START_DATE",
  SET_END_DATE: "SET_END_DATE"
};

// counties actions
export const countriesInfo = {
  REQUEST_COUNTRIES: "REQUEST_COUNTRIES",
  RECEIVE_COUNTRIES: "RECEIVE_COUNTRIES"
};
