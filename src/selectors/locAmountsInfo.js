import { createSelector, defaultMemoize, createSelectorCreator } from 'reselect';
import isEqual from 'lodash';
import { CurrencyConverter } from '../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../services/utilities/roomsXMLCurrency';
import { getLocEurRate, getCurrencyExchangeRates } from './exchangeRatesInfo';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

const getLocAmountId = (state, props) => props.fiat;

const getLocAmounts = (state, props) => {
  return state.locAmountsInfo.locAmounts;
};

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

const makeGetLocAmountIdInEur = () => {
  return createDeepEqualSelector(
    [getCurrencyExchangeRates, getLocAmountId],
    (currencyExchangeRates, locAmountId) => {
      // console.log('getLocAmountIdInEur');
      const locAmountPairId = currencyExchangeRates && CurrencyConverter.convert(currencyExchangeRates, RoomsXMLCurrency.get(), DEFAULT_CRYPTO_CURRENCY, locAmountId);
      return locAmountPairId;
    }
  );
};

const makeGetLocAmountById = () => {
  return createSelector(
    [getLocAmounts, makeGetLocAmountIdInEur],
    (locAmounts, locAmountIdInEur) => {
      // console.log('getLocAmountById');
      const locAmount = locAmounts[locAmountIdInEur] && (locAmounts[locAmountIdInEur].locAmount).toFixed(2);
      return locAmount;
    }
  );
};

export const makeGetLocAmount = () => {
  const getLocAmountIdInEur = makeGetLocAmountIdInEur();
  const getLocAmountById = makeGetLocAmountById();
  return createSelector(
    [getLocAmountById, getLocAmountIdInEur, getLocEurRate],
    (locAmountValue, locAmountIdInEur, locEurRate) => {
      let locAmount = locAmountValue;

      if (!locAmount) {
        locAmount = (locAmountIdInEur / locEurRate).toFixed(2);
      }
      // console.log(locAmount);

      return locAmount;
    }
  );
};