import { CurrencyConverter } from "../../../../services/utilities/currencyConverter";
import { RoomsXMLCurrency } from "../../../../services/utilities/roomsXMLCurrency";

export default function evaluateLocAndEuroAmounts({
  inputFiatAmount,
  inputFiatCurrency,
  currencyExchangeRates,
  getCachedLocEurRateForAmount
}) {
  let outputFiatCurrency = "EUR";
  let fiatAmountInEur = CurrencyConverter.convert(
    currencyExchangeRates,
    inputFiatCurrency || RoomsXMLCurrency.get(),
    outputFiatCurrency,
    inputFiatAmount
  );
  let locAmount = getCachedLocEurRateForAmount(fiatAmountInEur);

  return {
    locAmount,
    fiatAmountInEur
  };
}
