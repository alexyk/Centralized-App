class CurrencyConverter {

  static convert(rates, from, to, quantity) {
    return quantity * rates[from][to];
  }
}

export {
  CurrencyConverter
};