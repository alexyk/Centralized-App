import queryString from "query-string";
const REFERRAL_ID = "referralId";

export default {
  hasId() {
    let id = localStorage.getItem(REFERRAL_ID);
    return typeof id === "string";
  },
  getIdToRegister() {
    let id = localStorage.getItem(REFERRAL_ID);
    localStorage.removeItem(REFERRAL_ID);
    return id;
  },
  tryToSetFromSearch(search) {
    let params = queryString.parse(search);
    let { refId } = params;
    if (refId) {
      localStorage.setItem(REFERRAL_ID, refId);
    }
  }
};
