import "babel-polyfill";

// import App from "./components/app/App.BAK";
// import App from "./components/app/App.REF";
import App from "./components/app/app-container";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./reduxStore";

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
