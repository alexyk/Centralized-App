import queryStringUtil from 'query-string'
import StringUtils from './stringUtilities';


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
  isBooking: false
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
  if (pathname.indexOf('mobile/hotels/listings/book') > -1) {
    const bookingParams = queryStringUtil.parse(search);
    updateMobileCache({bookingParams,isBooking: true});
  }
}

/**
 * Adds nat parameter
 * @param {String|Object} location
 */
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
  const natParam = parseInt(queryParams.nat);
  const indexOfNat = search.indexOf('&nat=');
  const isNatNan = isNaN(natParam);

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


export function fixSearchQueryWithSchParam(search, queryParams) {
  let result = '';

  const { authEmail, authToken, region:regionOrig } = queryParams;

  const index1 = search.indexOf(`&`); // region param end (at first '&')
  let queryBase = search.substring(index1);

  if (authEmail) {
    queryBase = queryBase.replace(`&authEmail=${encodeURI(authEmail)}`,'');
  }
  if (authToken) {
    queryBase = queryBase.replace(`&authToken=${encodeURI(authToken)}`,'');
  }

  let region = regionOrig;
  let sch = null;
  if (regionOrig.includes('_')) {
    const asArray = regionOrig.split('_');
    region = asArray[0];
    sch = asArray[1];
  }

  result = `?region=${region}${queryBase}`;
  if (sch != null) {
    result += `&sch=${sch}`;
  }

  return result;
}
