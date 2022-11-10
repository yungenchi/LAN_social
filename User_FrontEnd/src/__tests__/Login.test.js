import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("The test user name and password are incorrect", async () => {
  const { container } = render(<App />);

  fireEvent.click(screen.getByText(/Login/));

  /* eslint-disable */
  const form = container.querySelector("form");
  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#password");

  fireEvent.change(usernameInput, { value: "zico000" });
  fireEvent.change(passwordInput, { value: "zico000" });
  fireEvent.submit(form);

  const alert = await screen.findByRole("alert");

  expect(alert.innerHTML).toBe(
    "Username and / or password invalid, please try again."
  );
});

test("The test user name and password are correct", async () => {
  const { container } = render(<App />);
  fireEvent.click((await screen.findAllByText(/Login/))[0]);
  /* eslint-disable */
  const form = container.querySelector("form");
  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#password");

  userEvent.type(usernameInput, "zico000");
  userEvent.type(passwordInput, "0000");
  fireEvent.submit(form);

  const alert = await screen.findByRole("alert");

  expect(alert.innerHTML).toBe(
    "Your account has been blocked. Please contact the Adminstrator for further information."
  );
});
