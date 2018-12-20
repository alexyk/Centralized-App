import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

import AppComponent from "./AppComponent";

test("test", async () => {
  const { getByTestId } = render(<AppComponent />);
  let node = await waitForElement(() => getByTestId("app"));
  console.log("node", node);
  // expect(1).toBe(2);
});
