import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

const sleep = (ms) => {
  return new Promise((resovle, reject) => {
    setTimeout(() => {
      resovle();
    }, ms);
  });
};

const awaitUpdate = async (form, notexist) => {
  while (true) {
    await sleep(100);
    if (!form.innerHTML.match(notexist)) {
      return;
    }
  }
};

test("SignUp test valid", async () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText(/Register/));
  /* eslint-disable */
  const form = container.querySelector("form");
  const registerButton = container.querySelector("form>.form-group>input.btn");

  fireEvent.click(registerButton);
  expect(form.innerHTML).toContain("Username is required.");
  expect(form.innerHTML).toContain("First name is required.");
  expect(form.innerHTML).toContain("Last name is required.");
  expect(form.innerHTML).toContain("Password is required.");

  userEvent.type(form.querySelector("#username"), "user2");
  fireEvent.click(registerButton);
  await awaitUpdate(form, "Username is required.");
  expect(form.querySelectorAll(".text-danger").length).toBe(3);

  userEvent.type(form.querySelector("#firstname"), "first");
  fireEvent.click(registerButton);
  await awaitUpdate(form, "First name is required.");
  expect(form.querySelectorAll(".text-danger").length).toBe(2);

  userEvent.type(form.querySelector("#lastname"), "last");
  fireEvent.click(registerButton);
  await awaitUpdate(form, "Last name is required.");
  expect(form.querySelectorAll(".text-danger").length).toBe(1);

  userEvent.type(form.querySelector("#password"), "123456");
  fireEvent.click(registerButton);
  await awaitUpdate(form, "Password is required.");
  expect(form.querySelectorAll(".text-danger").length).toBe(2);

  userEvent.type(form.querySelector("#password"), "Aa123456.");
  fireEvent.click(registerButton);
  await awaitUpdate(
    form,
    "Password must contain at least a upper-case letter, a lower-case letter, a number and a special charactor."
  );
  expect(form.querySelectorAll(".text-danger").length).toBe(1);
});
