import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import airdropInfo from './airdropInfo';
import searchInfo from './searchInfo';
import bookingBestPrice from './bookingBestPrice';
import socketInfo from './socketInfo';
import locAmountsInfo from './locAmountsInfo';
import currenciesRatesInfo from './currenciesRatesInfo';
import dynamicLocRatesInfo from './dynamicLocRatesInfo';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  airdropInfo,
  searchInfo,
  bookingBestPrice,
  socketInfo,
  locAmountsInfo,
  currenciesRatesInfo,
  dynamicLocRatesInfo,
});

export default rootReducer;