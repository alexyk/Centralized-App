import { CurrencyConverter } from "../../../../services/utilities/currencyConverter";
import { RoomsXMLCurrency } from "../../../../services/utilities/roomsXMLCurrency";

export default function evaluateLocAndEuroAmounts({
  inputFiatAmount,
  inputFiatCurrency,
  currencyExchangeRates,
  locEurRate,
  getCachedLocEurRateForAmount
}) {
  let outputFiatCurrency = "EUR";
  let currentPriceInEur = CurrencyConverter.convert(
    currencyExchangeRates,
    inputFiatCurrency || RoomsXMLCurrency.get(),
    outputFiatCurrency,
    inputFiatAmount
  );

  const calculateLocAmount = () => currentPriceInEur / locEurRate;
  let locAmount =
    getCachedLocEurRateForAmount(currentPriceInEur) || calculateLocAmount();

  return {
    locAmount,
    fiatAmountInEur: currentPriceInEur
  };
}
