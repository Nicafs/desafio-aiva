import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserFilters from "./UserFilters";

describe("UserFilters", () => {
  const filterValues = {
    name: "Alice",
    email: "alice@email.com",
    role: "admin",
  };
  const onFilterChange = jest.fn();
  const onReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all filter fields with correct values", () => {
    render(
      <UserFilters
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />,
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Alice");
    expect(screen.getByLabelText("E-mail")).toHaveValue("alice@email.com");
    expect(screen.getByLabelText("Role")).toHaveValue("admin");
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("calls onFilterChange when typing in name", () => {
    render(
      <UserFilters
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />,
    );
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Bob" },
    });
    expect(onFilterChange).toHaveBeenCalledWith({ name: "Bob" });
  });

  it("calls onFilterChange when typing in email", () => {
    render(
      <UserFilters
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />,
    );
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "bob@email.com" },
    });
    expect(onFilterChange).toHaveBeenCalledWith({ email: "bob@email.com" });
  });

  it("calls onFilterChange when typing in role", () => {
    render(
      <UserFilters
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />,
    );
    fireEvent.change(screen.getByLabelText("Role"), {
      target: { value: "user" },
    });
    expect(onFilterChange).toHaveBeenCalledWith({ role: "user" });
  });

  it("calls onReset when Clear button is clicked", () => {
    render(
      <UserFilters
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />,
    );
    fireEvent.click(screen.getByText("Clear"));
    expect(onReset).toHaveBeenCalled();
  });
});
