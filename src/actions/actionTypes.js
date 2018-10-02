// userInfo actions
export const userInfo = {
  SET_IS_LOGGED: 'SET_IS_LOGGED',
  SET_USER_INFO: 'SET_USER_INFO'
};

// paymentInfo actions
export const paymentInfo = {
  SET_CURRENCY: 'SET_CURRENCY',
};

// paymentInfo actions
export const modalsInfo = {
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL'
};

// airdrop action
export const airdropInfo = {
  SET_AIRDROP_INFO: 'SET_AIRDROP_INFO'
};

// searchInfo actions
export const searchInfo = {
  SET_DATES: 'SET_DATES',
  SET_REGION: 'SET_REGION',
  SET_ROOMS_BY_COUNT_OF_ROOMS: 'SET_ROOMS_BY_COUNT_OF_ROOMS',
  SET_ROOMS: 'SET_ROOMS',
  SET_ADULTS: 'SET_ADULTS',
  SET_CHILDREN: 'SET_CHILDREN',
  SET_SEARCH_INFO: 'SET_SEARCH_INFO'
};

// socket actions
export const exchangerSocketInfo = {
  SET_LOC_PRICE_WEBSOCKET_CONNECTION: 'SET_LOC_PRICE_WEBSOCKET_CONNECTION',
  SET_LOC_RATE_WEBSOCKET_CONNECTION: 'SET_LOC_RATE_WEBSOCKET_CONNECTION',
};

// locAmounts actions
export const locAmountsInfo = {
  UPDATE_LOC_AMOUNTS: 'UPDATE_LOC_AMOUNTS',
  REMOVE_LOC_AMOUNT: 'REMOVE_LOC_AMOUNT',
  CLEAR_LOC_AMOUNTS: 'CLEAR_LOC_AMOUNTS'
};

// currencies rates actions
export const ratesInfo = {
  SET_CURRENCY_RATES: 'SET_CURRENCY_RATES',
  SET_LOC_EUR_RATE: 'SET_LOC_EUR_RATE',
  SET_LOC_RATE_FIAT_AMOUNT: 'SET_LOC_RATE_FIAT_AMOUNT'
};

export const locPriceUpdateTimerInfo = {
  SET_INITIAL_SECONDS: 'SET_INITIAL_SECONDS',
  SET_SECONDS: 'SET_SECONDS',
  RESET: 'RESET'
};