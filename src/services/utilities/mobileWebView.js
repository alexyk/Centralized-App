import React from 'react';
import queryStringUtil from 'query-string';
import StringUtils from './stringUtilities';
import store from '../../reduxStore';
import { setCurrency } from '../../actions/paymentInfo';
import Version from '../../components/common/version'


export const MOBILE_STEPS = ['Guest Info', 'Confirm and Pay'];
export const showMobileBookingSteps = true;

const showMobileFooterBackButton = false;
const showMobileFooterVersion = true;
const showMobileFooterCurrencySelection = true;


export var isMobileWebView = false;
export function setIsMobileWebView(origin, value) {
  const summary = `${isMobileWebView} -> ${value}`;
  if (isMobileWebView != value) {
    console.info(`[Mobile-Web-View] [${origin}] Setting isMobileWebView: ${summary}`);
    isMobileWebView = value;
  } else {
    console.warn(`[Mobile-Web-View] [${origin}] Trying to set isMobileWebView: ${summary} - resulting in no change of value`);
  }
}

const mobileCacheDefault = {
  isBooking: false,
  isLoading: false
};
export function updateMobileCache(obj, caller) {
  if (obj == null) {
    mobileCache = {...mobileCacheDefault};
  } else {
    mobileCache = {...mobileCache, ...obj};
  }
}
export var mobileCache = {...mobileCacheDefault};


/**
 * Used to process query string in App.REF for webview.
 * Caches parsed params in the following cases:
 *  - booking step (Confirm and Pay)
 *  -
 * @param {Object} location
 */
export function mobileProcessQueryString({pathname, search}) {
  const params = queryStringUtil.parse(search);
  const { currency } = params;

  if (pathname.indexOf('mobile/hotels/listings/book') > -1) {
    updateMobileCache({bookingParams: params,isBooking: true});
  }
  if (currency) {
    localStorage.setItem('currency', currency);
    store.dispatch(setCurrency(currency));
  }
}


export function fixNatForMobileWebView(location) {
  const isString = (typeof(location) == 'string');
  if ( location == null || (!isString && location.search == null && location.pathname == null) ) {
    return {search:'',pathname:''};
  }

  let result = null;

  let search,pathname;
  if (isString) {
    pathname = '';
    search = location;
  } else {
    const {search: searchInput, pathname: pathnameInput} = location;
    search = searchInput;
    pathname = pathnameInput;
  }

  const queryParams = queryStringUtil.parse(search);
  const nationalityParam = parseInt(queryParams.nat);
  const indexOfNat = search.indexOf('&nat=');
  const isNatNan = isNaN(nationalityParam);

  if (isNatNan || indexOfNat == -1) {

    // fix search string
    let searchFixed = '';
    const searchNat = /&nat=[a-z]{1,10}(&|)/;
    const replaceNat = '&nat=-1$1';

    if (indexOfNat > -1) {
      searchFixed = search.replace(searchNat, replaceNat);
    } else {
      let tmpIndex = search.indexOf('&filters'); // make sure search is not cut later when truncating &filters in StaticHotelsSearchPage::subscribe()
      if (tmpIndex == -1) {
        searchFixed = search + "&nat=-1";
      } else {
        searchFixed = StringUtils.insertString(search, "&nat=-1", tmpIndex)
      }
    }
    result = {
      pathname: '/mobile/hotels/listings-nat-fix',
      search: searchFixed
    };

  } else {
    result = { pathname, search };
  }

  return result;
}


export function renderMobileFooter(props) {
  if (!isMobileWebView) return null;

  const { history, currency } = props;

  const isBackButtonVisible = (showMobileFooterBackButton && !mobileCache.isBooking);
  const isCurrencySelectionVisible = (showMobileFooterCurrencySelection && !mobileCache.isLoading);
  const isVersionVisible = (showMobileFooterVersion);

  return (
      <div className="container" style={{'marginBottom': '50px'}}>
        { isBackButtonVisible
            && <button className="btn" style={{ 'width': '100%', 'marginBottom': '20px' }} onClick={() => history.goBack()}>Back</button>
        }
        { isCurrencySelectionVisible
            && <div className="select">
                <select
                  className="currency"
                  value={currency}
                  style={{ 'height': '40px', 'margin': '10px 0', 'textAlignLast': 'right', 'paddingRight': '45%', 'direction': 'rtl', display: "block"}}
                  onChange={(e) => props.dispatch(setCurrency(e.target.value))}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
        }
        { isVersionVisible && <Version /> }
      </div>
  )
}
