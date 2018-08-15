import { combineReducers } from 'redux';
import userInfo from './userInfo';
import paymentInfo from './paymentInfo';
import modalsInfo from './modalsInfo';
import airdropInfo from './airdropInfo';
import searchInfo from './searchInfo';
import bookingBestPrice from './bookingBestPrice';

const rootReducer = combineReducers({
  userInfo,
  paymentInfo,
  modalsInfo,
  airdropInfo,
  searchInfo,
  bookingBestPrice,
});

export default rootReducer;