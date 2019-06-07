import queryString from 'query-string'
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

  const queryParams = queryString.parse(search);
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
