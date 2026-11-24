import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./accordion";
import { Button } from "./button";
import { CodeInput } from "./code-input";
import { TextField } from "./field";

function ControlledCode(props: { kind?: "otp" | "pin"; onComplete?: (value: string) => void }) {
  const [value, setValue] = useState("");
  return <CodeInput label="OTP" length={4} value={value} onChange={setValue} {...props} />;
}

describe("CodeInput", () => {
  it("exposes one labelled numeric input with OTP autofill", () => {
    render(<ControlledCode />);
    const input = screen.getByLabelText("OTP");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("fills every box from a pasted code and strips non-digits", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<ControlledCode onComplete={onComplete} />);
    const input = screen.getByLabelText("OTP");
    await user.click(input);
    await user.paste("12-34");
    expect(input).toHaveValue("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("limits input to the code length", async () => {
    const user = userEvent.setup();
    render(<ControlledCode />);
    const input = screen.getByLabelText("OTP");
    await user.type(input, "123456");
    expect(input).toHaveValue("1234");
  });

  it("masks PIN digits", async () => {
    const user = userEvent.setup();
    const { container } = render(<ControlledCode kind="pin" />);
    const input = screen.getByLabelText("OTP");
    expect(input).toHaveAttribute("type", "password");
    await user.type(input, "98");
    expect(container).not.toHaveTextContent("98");
    expect(container).toHaveTextContent("••");
  });
});

describe("TextField", () => {
  it("associates the label, hint and error with the input", () => {
    render(<TextField label="Mobile number" hint="10 digits" error="Enter a valid number" />);
    const input = screen.getByLabelText("Mobile number");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("10 digits Enter a valid number");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid number");
  });
});

describe("Button", () => {
  it("defaults to type=button and blocks clicks while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Accordion", () => {
  const items = [
    { id: "a", title: "First question", content: "First answer" },
    { id: "b", title: "Second question", content: "Second answer" },
  ];

  it("keeps answers in the DOM and toggles one panel at a time", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const first = screen.getByRole("button", { name: "First question" });
    const second = screen.getByRole("button", { name: "Second question" });

    expect(screen.getByText("First answer")).not.toBeVisible();
    expect(first).toHaveAttribute("aria-expanded", "false");

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "First question" })).toBeVisible();

    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("is operable from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "First question" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "First question" })).toHaveAttribute("aria-expanded", "true");
  });
});
