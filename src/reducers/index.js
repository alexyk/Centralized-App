import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import airdropInfo from './airdropInfo';
import searchInfo from './searchInfo';
import exchangerSocketInfo from './exchangerSocketInfo';
import locAmountsInfo from './locAmountsInfo';
import exchangeRatesInfo from './exchangeRatesInfo';
import locPriceUpdateTimerInfo from './locPriceUpdateTimerInfo';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  airdropInfo,
  searchInfo,
  exchangerSocketInfo,
  locAmountsInfo,
  exchangeRatesInfo,
  locPriceUpdateTimerInfo,
});

export default rootReducer;