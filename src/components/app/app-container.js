import {
  fetchCurrencyRates,
  fetchLocEurRate
} from "../../actions/exchangeRatesInfo";
import { fetchCountries } from "../../actions/countriesInfo";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import App from "./App.REF";
function mapDispatchToProps(dispatch) {
  return {
    requestExchangeRates() {
      dispatch(fetchCurrencyRates());
    },
    requestLocEurRate() {
      dispatch(fetchLocEurRate());
    },
    requestCountries() {
      dispatch(fetchCountries());
    }
  };
}
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(App)
);
