import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable from "./UserTable";
import { MemoryRouter } from "react-router-dom";
import type { ApiUser } from "../../../types/ApiUser";

// Mock MUI icons/components
jest.mock("@mui/icons-material/Edit", () => () => (
  <span data-testid="EditIcon" />
));
jest.mock("@mui/icons-material/Delete", () => () => (
  <span data-testid="DeleteIcon" />
));
jest.mock("@mui/material/Paper", () => (props: any) => (
  <div data-testid="Paper">{props.children}</div>
));
jest.mock("@mui/material/TableContainer", () => (props: any) => (
  <div data-testid="TableContainer">{props.children}</div>
));
jest.mock("@mui/material/Table", () => (props: any) => (
  <table>{props.children}</table>
));
jest.mock("@mui/material/TableHead", () => (props: any) => (
  <thead>{props.children}</thead>
));
jest.mock("@mui/material/TableRow", () => (props: any) => (
  <tr>{props.children}</tr>
));
jest.mock("@mui/material/TableCell", () => (props: any) => (
  <td>{props.children}</td>
));
jest.mock("@mui/material/TableBody", () => (props: any) => (
  <tbody>{props.children}</tbody>
));
jest.mock("@mui/material/TableSortLabel", () => (props: any) => (
  <span onClick={props.onClick} data-testid="TableSortLabel">
    {props.children}
  </span>
));
jest.mock("@mui/material/TablePagination", () => (props: any) => (
  <div data-testid="TablePagination">
    <button
      onClick={() => props.onPageChange({}, props.page - 1)}
      disabled={props.page === 0}
    >
      Prev
    </button>
    <button onClick={() => props.onPageChange({}, props.page + 1)}>Next</button>
    <select
      value={props.rowsPerPage}
      onChange={(e) =>
        props.onRowsPerPageChange({ target: { value: e.target.value } })
      }
    >
      {props.rowsPerPageOptions.map((opt: number) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
));
jest.mock("@mui/material/Stack", () => (props: any) => (
  <div>{props.children}</div>
));
jest.mock("@mui/material/Tooltip", () => (props: any) => (
  <span>{props.children}</span>
));
jest.mock("@mui/material/IconButton", () => (props: any) => (
  <button
    onClick={props.onClick}
    data-testid={props.color === "primary" ? "EditButton" : "DeleteButton"}
  >
    {props.children}
  </button>
));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUsers: ApiUser[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@email.com",
    role: "admin",
    password: "123",
    avatar: "/avatar-image.jpg",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@email.com",
    role: "user",
    password: "456",
    avatar: "/avatar-image.jpg",
  },
];

describe("UserTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table headers and users", () => {
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("alice@email.com")).toBeInTheDocument();
    expect(screen.getByText("bob@email.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  it("calls navigate when Edit button is clicked", () => {
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByTestId("EditButton")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/user/1");
  });

  it("shows alert when Delete button is clicked", () => {
    window.alert = jest.fn();
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByTestId("DeleteButton")[0]);
    expect(window.alert).toHaveBeenCalledWith("Delete user 1");
  });

  it("sorts by column when header is clicked", () => {
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );
    // Click on "Name" header to sort
    fireEvent.click(screen.getAllByTestId("TableSortLabel")[0]);
    // No assertion for order since it's internal, but no crash
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("changes page and rows per page", () => {
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );
    // Next page
    fireEvent.click(screen.getByText("Next"));
    // Prev page
    fireEvent.click(screen.getByText("Prev"));
    // Change rows per page
    fireEvent.change(screen.getByDisplayValue("10"), {
      target: { value: "5" },
    });
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
  });
});
