const QUOTE_LOC_PP_ID = "quote-PP";

export const getLocAMounts = state => state.locAmounts;
export const getLocAmountById = (state, id) =>
  state.locAmounts[id] && state.locAmounts[id].locAmount;
export const getQuotePPAdditionalFees = state =>
  state.locAmounts[QUOTE_LOC_PP_ID] &&
  state.locAmounts[QUOTE_LOC_PP_ID].additionalFees;
export const getQuotePPFiatAmount = state =>
  state.locAmounts[QUOTE_LOC_PP_ID] &&
  state.locAmounts[QUOTE_LOC_PP_ID].fiatAmount;
export const getQuotePPFundsSufficient = state =>
  state.locAmounts[QUOTE_LOC_PP_ID] &&
  state.locAmounts[QUOTE_LOC_PP_ID].fundsSufficient;
export const getQuoteLocError = state =>
  state.locAmounts.quote && state.locAmounts.quote.error;
