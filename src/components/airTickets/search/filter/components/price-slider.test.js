import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
afterEach(cleanup);

describe("PriceSlider component", () => {
  test("renders all the checkboxes", async () => {
    let TEST_ID = "stop-checkbox";
    const { getByTestId, getAllByTestId } = render(<div />);
    let nodes = await waitForElement(() => getAllByTestId(TEST_ID));
    expect(nodes.length).toBe(3);
  });
});
