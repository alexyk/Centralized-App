import queryString from "query-string";
const SET_REFERRAL_ID = "setReferralId";

export function setReferralIdFromSearch(search) {
  let params = queryString.parse(search);
  let { refId } = params;
  return {
    type: SET_REFERRAL_ID,
    payload: {
      referralId: refId
    }
  };
}

export default function affiliatesReducer(
  state = { referralId: null },
  action
) {
  switch (action.type) {
    case SET_REFERRAL_ID:
      return {
        ...state,
        referralId: action.payload.referralId
      };

    default:
      return state;
  }
}

export const selectors = {
  hasId(state) {
    let id = state.referralId;
    return id !== null && typeof id !== "undefined";
  },
  getId(state) {
    let id = state.referralId;
    return id;
  }
};
