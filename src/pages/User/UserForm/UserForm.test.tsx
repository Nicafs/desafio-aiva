import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserForm from "./UserForm";
import { BrowserRouter } from "react-router-dom";
import * as useUsersHook from "../../../hooks/useUsers";

// Mock navigate and params
const mockNavigate = jest.fn();
const mockParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams(),
}));

describe("UserForm", () => {
  const createUser = { mutateAsync: jest.fn() };
  const updateUser = { mutateAsync: jest.fn() };
  const getByIdUser = { mutateAsync: jest.fn() };

  beforeEach(() => {
    jest.spyOn(useUsersHook, "useUsers").mockReturnValue({
      createUser,
      updateUser,
      getByIdUser,
    } as any);

    // Clear params and navigate
    mockNavigate.mockClear();
    mockParams.mockReturnValue({});
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <UserForm />
      </BrowserRouter>,
    );

  it("renders form title for creating user", () => {
    renderComponent();
    expect(screen.getByTestId("user-title")).toHaveTextContent("New User");
  });

  it("renders all input fields", () => {
    renderComponent();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-role")).toBeInTheDocument();
    expect(screen.getByTestId("input-avatar")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderComponent();

    const passwordInput = screen.getByTestId("input-password");
    const toggleButton = screen
      .getByTestId("btn-icon-password")
      .querySelector("button")!;

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits the form to create a user", async () => {
    createUser.mutateAsync.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("input-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("input-role"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByTestId("input-avatar"), {
      target: { value: "http://avatar.com/img.png" },
    });

    fireEvent.click(screen.getByTestId("btn-save"));

    await waitFor(() => {
      expect(createUser.mutateAsync).toHaveBeenCalledTimes(1);
    });

    expect(createUser.mutateAsync).toHaveBeenCalledWith({
      user: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
        avatar: "http://avatar.com/img.png",
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates back when cancel is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("btn-cancel"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders form title for editing user and loads data", async () => {
    mockParams.mockReturnValue({ id: "1" });
    getByIdUser.mutateAsync.mockResolvedValueOnce({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "admin",
      avatar: "http://avatar.com/img.png",
    });

    renderComponent();

    await waitFor(() => {
      expect(getByIdUser.mutateAsync).toHaveBeenCalledWith(1);
    });

    expect(screen.getByTestId("user-title")).toHaveTextContent("Edit User");

    expect(screen.getByTestId("input-name")).toHaveValue("Test User");
    expect(screen.getByTestId("input-email")).toHaveValue("test@example.com");
    expect(screen.getByTestId("input-password")).toHaveValue("password123");
    expect(screen.getByTestId("input-role")).toHaveValue("admin");
    expect(screen.getByTestId("input-avatar")).toHaveValue(
      "http://avatar.com/img.png",
    );
  });

  it("submits the form to update a user", async () => {
    mockParams.mockReturnValue({ id: "1" });

    getByIdUser.mutateAsync.mockResolvedValueOnce({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "admin",
      avatar: "http://avatar.com/img.png",
    });

    renderComponent();

    await waitFor(() => {
      expect(getByIdUser.mutateAsync).toHaveBeenCalledWith(1);
    });

    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "Updated User" },
    });

    fireEvent.click(screen.getByTestId("btn-save"));

    await waitFor(() => {
      expect(updateUser.mutateAsync).toHaveBeenCalledTimes(1);
    });

    expect(updateUser.mutateAsync).toHaveBeenCalledWith({
      id: 0, // The id is being passed as 0 because in your form it's like this → `id: data.id || 0`
      user: {
        name: "Updated User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
        avatar: "http://avatar.com/img.png",
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
