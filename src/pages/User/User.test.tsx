import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import User from "./User";
import { MemoryRouter } from "react-router-dom";
import * as useUsersHook from "../../hooks/useUsers";
import * as useUserFiltersHook from "../../hooks/useUserFilters";

// Mock MUI components
jest.mock("@mui/material/Box", () => (props: any) => (
  <div data-testid="Box">{props.children}</div>
));
jest.mock("@mui/material/Stack", () => (props: any) => (
  <div data-testid="Stack">{props.children}</div>
));
jest.mock("@mui/material/Typography", () => (props: any) => (
  <div>{props.children}</div>
));
jest.mock("@mui/material/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@mui/icons-material/Add", () => () => (
  <span data-testid="AddIcon" />
));

// Mock custom components
jest.mock("../../components/Loading", () => () => (
  <div data-testid="Loading" />
));
jest.mock("../../components/PageError", () => ({ message, onRetry }: any) => (
  <div data-testid="PageError">
    {message}
    <button onClick={onRetry}>Retry</button>
  </div>
));
jest.mock("./components/UserTable", () => ({ users }: any) => (
  <div data-testid="UserTable">{users.map((u: any) => u.name).join(",")}</div>
));
jest.mock("./components/UserFilters", () => (props: any) => (
  <div data-testid="UserFilters">
    <button
      onClick={() => props.onFilterChange({ name: "a", email: "", role: "" })}
    >
      Filter
    </button>
    <button onClick={props.onReset}>Reset</button>
  </div>
));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@email.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@email.com", role: "user" },
];

describe("User page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange: jest.fn(),
      resetFilters: jest.fn(),
    });
    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("Loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: undefined,
        isLoading: false,
        error: { message: "fail" },
        refetch: jest.fn(),
      },
    } as any);
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange: jest.fn(),
      resetFilters: jest.fn(),
    });
    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("PageError")).toHaveTextContent("fail");
    fireEvent.click(screen.getByText("Retry"));
  });

  it("renders users and UserTable", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: mockUsers,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange: jest.fn(),
      resetFilters: jest.fn(),
    });
    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByTestId("UserTable")).toHaveTextContent("Alice,Bob");
  });

  it("shows empty message when no users", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange: jest.fn(),
      resetFilters: jest.fn(),
    });
    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  it("calls navigate when Add button is clicked", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: mockUsers,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange: jest.fn(),
      resetFilters: jest.fn(),
    });

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Add"));
    expect(mockNavigate).toHaveBeenCalledWith("/user/new");
  });

  it("filters users with UserFilters", () => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      usersQuery: {
        data: mockUsers,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    const handleFilterChange = jest.fn();
    jest.spyOn(useUserFiltersHook, "useUserFilters").mockReturnValue({
      filters: { name: "", email: "", role: "" },
      handleFilterChange,
      resetFilters: jest.fn(),
    });
    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Filter"));
    expect(handleFilterChange).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Reset"));
  });
});
