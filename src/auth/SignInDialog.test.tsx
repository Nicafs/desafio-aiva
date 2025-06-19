// SignInDialog.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignInDialog from "./SignInDialog";

// Mock do Zustand
jest.mock("../store/auth", () => ({
  useAuthStore: jest.fn((selector) => {
    if (selector.toString().includes("setTokens")) return jest.fn();
    if (selector.toString().includes("setUser")) return jest.fn();
    return jest.fn();
  }),
}));

// Mock do AuthService
jest.mock("../services/auth.services", () => ({
  AuthService: {
    login: jest.fn(),
    profile: jest.fn(),
  },
}));

// Import mocks explicitamente para usar no teste
import { AuthService } from "../services/auth.services";
import { useAuthStore } from "../store/auth";

describe("SignInDialog", () => {
  const onCloseMock = jest.fn();
  const setTokensMock = jest.fn();
  const setUserMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do Zustand para retornar as funções corretas
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.toString().includes("setTokens")) return setTokensMock;
      if (selector.toString().includes("setUser")) return setUserMock;
      return jest.fn();
    });
  });

  const renderWithClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  };

  it("renders dialog with email and password fields and buttons", () => {
    renderWithClient(<SignInDialog open={true} onClose={onCloseMock} />);

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    renderWithClient(<SignInDialog open={true} onClose={onCloseMock} />);

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("submits the form successfully and calls setTokens and setUser", async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({
      accessToken: "token123",
    });
    (AuthService.profile as jest.Mock).mockResolvedValue({
      id: 1,
      name: "John Doe",
    });

    renderWithClient(<SignInDialog open={true} onClose={onCloseMock} />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(setTokensMock).toHaveBeenCalledWith({ accessToken: "token123" });
      expect(setUserMock).toHaveBeenCalledWith({ id: 1, name: "John Doe" });
    });
  });

  it("disables buttons while submitting", async () => {
    // Para simular o estado "pending", retornamos uma Promise pendente que nunca resolve
    let resolvePromise: (value?: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (AuthService.login as jest.Mock).mockReturnValue(pendingPromise);

    renderWithClient(<SignInDialog open={true} onClose={onCloseMock} />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(signInButton).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();

    userEvent.click(signInButton);

    await waitFor(() => {
      expect(signInButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    // Resolva a promise para evitar warning no teste
    resolvePromise!();
  });
});
