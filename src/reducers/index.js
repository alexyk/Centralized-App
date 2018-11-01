import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import airdropInfo from './airdropInfo';
import hotelsSearchInfo from './hotelsSearchInfo';
import exchangerSocketInfo from './exchangerSocketInfo';
import locAmountsInfo from './locAmountsInfo';
import exchangeRatesInfo from './exchangeRatesInfo';
import locPriceUpdateTimerInfo from './locPriceUpdateTimerInfo';
import burgerMenuInfo from './burgerMenuInfo';
import searchDatesInfo from './searchDatesInfo';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  airdropInfo,
  hotelsSearchInfo,
  exchangerSocketInfo,
  locAmountsInfo,
  exchangeRatesInfo,
  locPriceUpdateTimerInfo,
  burgerMenuInfo,
  searchDatesInfo
});

export default rootReducer;