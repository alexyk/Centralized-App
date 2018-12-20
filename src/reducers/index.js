import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import hotelsSearchInfo from './hotelsSearchInfo';
import homesSearchInfo from './homesSearchInfo';
import exchangerSocketInfo from './exchangerSocketInfo';
import locAmountsInfo from './locAmountsInfo';
import exchangeRatesInfo from './exchangeRatesInfo';
import locPriceUpdateTimerInfo from './locPriceUpdateTimerInfo';
import airTicketsSearchInfo from './airTicketsSearchInfo';
import burgerMenuInfo from './burgerMenuInfo';
import searchDatesInfo from './searchDatesInfo';
import countriesInfo from './countriesInfo';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  hotelsSearchInfo,
  homesSearchInfo,
  exchangerSocketInfo,
  locAmountsInfo,
  exchangeRatesInfo,
  locPriceUpdateTimerInfo,
  airTicketsSearchInfo,
  burgerMenuInfo,
  searchDatesInfo,
  countriesInfo
});

export default rootReducer;
