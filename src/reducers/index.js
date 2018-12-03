import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import airdropInfo from './airdropInfo';
import hotelsSearchInfo from './hotelsSearchInfo';
import homesSearchInfo from './homesSearchInfo';
import exchangerSocketInfo from './exchangerSocketInfo';
import locAmountsInfo from './locAmountsInfo';
import exchangeRatesInfo from './exchangeRatesInfo';
import locPriceUpdateTimerInfo from './locPriceUpdateTimerInfo';
import burgerMenuInfo from './burgerMenuInfo';
import searchDatesInfo from './searchDatesInfo';
import countriesInfo from './countriesInfo';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  airdropInfo,
  hotelsSearchInfo,
  homesSearchInfo,
  exchangerSocketInfo,
  locAmountsInfo,
  exchangeRatesInfo,
  locPriceUpdateTimerInfo,
  burgerMenuInfo,
  searchDatesInfo,
  countriesInfo
});

export default rootReducer;