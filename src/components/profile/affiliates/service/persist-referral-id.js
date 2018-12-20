import queryString from "query-string";
const REFERRAL_ID = "referralId";

export default {
  getIdToRegister() {
    return getCookie(REFERRAL_ID);
  },
  tryToSetFromSearch(search) {
    let params = queryString.parse(search);
    let { refId } = params;
    if (refId) {
      let monthInMinutes = 60 * 24 * 30;
      setCookie(REFERRAL_ID, refId, monthInMinutes);
    }
  }
};

function setCookie(cname, cvalue, mins) {
  let expiresIn = new Date(Date.now() + mins * 60 * 1000).toUTCString();
  document.cookie = `${cname}=${cvalue}; expires=${expiresIn}`;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
