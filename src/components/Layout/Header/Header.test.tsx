import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import { useAuthStore } from "../../../store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock Zustand
jest.mock("../../../store/auth", () => ({
  useAuthStore: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // to avoid automatic retries in tests
      },
    },
  });

describe("Header", () => {
  const mockToggleSidebar = jest.fn();
  const mockSignOut = jest.fn();

  const setup = (user: { name: string } | null = null) => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        user,
        signOut: mockSignOut,
      }),
    );

    const queryClient = createTestQueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <Header onToggleSidebar={mockToggleSidebar} />
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders app title", () => {
    setup();
    expect(screen.getByText("AIVA Challenge")).toBeInTheDocument();
  });

  it("calls onToggleSidebar when menu button is clicked", () => {
    setup();
    const menuButton = screen.getByLabelText("menu");
    fireEvent.click(menuButton);
    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  it("shows sign-in menu when user is not logged in", () => {
    setup();

    const userMenuButton = screen.getByLabelText("user menu");
    fireEvent.click(userMenuButton);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("opens SignInDialog when 'Sign In' is clicked", () => {
    setup();

    const userMenuButton = screen.getByLabelText("user menu");
    fireEvent.click(userMenuButton);

    const signInItem = screen.getByText("Sign In");
    fireEvent.click(signInItem);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows user info when user is logged in", () => {
    setup({ name: "Nicollas" });

    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText("Nicollas")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument(); // Avatar initial
  });

  it("shows sign-out menu when user is logged in", () => {
    setup({ name: "Nicollas" });

    const userMenuButton = screen.getByLabelText("user menu");
    fireEvent.click(userMenuButton);

    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("calls signOut when 'Sign Out' is clicked", () => {
    setup({ name: "Nicollas" });

    const userMenuButton = screen.getByLabelText("user menu");
    fireEvent.click(userMenuButton);

    const signOutItem = screen.getByText("Sign Out");
    fireEvent.click(signOutItem);

    expect(mockSignOut).toHaveBeenCalled();
  });
});
