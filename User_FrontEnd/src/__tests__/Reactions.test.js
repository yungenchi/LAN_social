import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("reactions test", async () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText(/Login/));
  /* eslint-disable */
  const form = container.querySelector("form");
  userEvent.type(form.querySelector("#username"), "user");
  userEvent.type(form.querySelector("#password"), "Aa123456.");
  fireEvent.submit(form);

  userEvent.click(await screen.findByText(/Forum/));

  userEvent.click((await screen.findAllByText(/Reply/))[0]);
});
