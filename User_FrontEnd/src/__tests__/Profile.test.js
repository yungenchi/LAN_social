import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
 
test("View personal information after testing login", async () => {
  const { container } = render(<App />);
  fireEvent.click((await screen.findAllByText(/Login/))[0]);
  /* eslint-disable */
  const form = container.querySelector("form");
  userEvent.type(form.querySelector("#username"), "user");
  userEvent.type(form.querySelector("#password"), "Aa123456.");
  fireEvent.submit(form);

  const profile = await screen.findByText(/My Profile/);

  userEvent.click(profile);

  const article = await screen.findByRole("article");

  expect(article.innerHTML).toContain("first");
  expect(article.innerHTML).toContain("last");
  expect(article.innerHTML).toContain("user");
  fireEvent.click((await screen.findAllByText(/Logout/))[0]);
});

test("Test modifying personal information after login", async () => {
  const { container } = render(<App />); 
  fireEvent.click((await screen.findAllByText(/Login/))[0]); 
  /* eslint-disable */
  const form = container.querySelector("form");
  userEvent.type(form.querySelector("#username"), "user");
  userEvent.type(form.querySelector("#password"), "Aa123456.");
  fireEvent.submit(form);

  const profile = await screen.findByText(/My Profile/);

  userEvent.click(profile);

  userEvent.click((await screen.findAllByText(/edit/))[0]);

  expect(container.innerHTML).toContain("Username");
  expect(container.innerHTML).toContain("First name");
  expect(container.innerHTML).toContain("Last name");
  expect(container.innerHTML).toContain("Password");
  expect(container.innerHTML).toContain("Confirm password");
});
