import { CurrencyConverter } from "../../../../services/utilities/currencyConverter";
import { RoomsXMLCurrency } from "../../../../services/utilities/roomsXMLCurrency";

export default function evaluateLocAndEuroAmounts({
  inputFiatAmount,
  inputFiatCurrency,
  currencyExchangeRates,
  locEurRate,
  getCachedLocEurRateForAmount
}) {
  let currentPriceInEur = CurrencyConverter.convert({
    inputFiatAmount,
    inputFiatCurrency: inputFiatCurrency || RoomsXMLCurrency.get(),
    outputFiatCurrency: "EUR",
    fiatExchangeRates: currencyExchangeRates
  });

  const calculateLocAmount = () => currentPriceInEur / locEurRate;
  let locAmount =
    getCachedLocEurRateForAmount(currentPriceInEur) || calculateLocAmount();

  return {
    locAmount,
    fiatAmountInEur: currentPriceInEur
  };
}
