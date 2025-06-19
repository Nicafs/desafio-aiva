import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "./Sidebar";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";

// Helper to render with simulated routing and custom pathname
function renderWithRouter(ui: ReactElement, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);

  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe("Sidebar", () => {
  it("renders the title when not collapsed", () => {
    renderWithRouter(<Sidebar collapsed={false} />);
    expect(screen.getByText("AIVA Challenge")).toBeInTheDocument();
  });

  it("does not render the title when collapsed", () => {
    renderWithRouter(<Sidebar collapsed={true} />);
    expect(screen.queryByText("AIVA Challenge")).not.toBeInTheDocument();
  });

  it("renders all menu items", () => {
    renderWithRouter(<Sidebar collapsed={false} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("highlights the menu item matching the current pathname", () => {
    renderWithRouter(<Sidebar collapsed={false} />, { route: "/products" });

    const productsItem = screen.getByText("Products").closest("a");
    expect(productsItem).toHaveClass("Mui-selected");

    // Other items should not be selected
    const homeItem = screen.getByText("Home").closest("a");
    expect(homeItem).not.toHaveClass("Mui-selected");
  });

  it("renders menu items without labels when collapsed", () => {
    renderWithRouter(<Sidebar collapsed={true} />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    expect(screen.queryByText("Users")).not.toBeInTheDocument();

    // Icons should still render (testing by role = link)
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("renders footer text when not collapsed", () => {
    renderWithRouter(<Sidebar collapsed={false} />);
    expect(screen.getByText(/© 2025 AIVA/i)).toBeInTheDocument();
  });

  it("does not render footer text when collapsed", () => {
    renderWithRouter(<Sidebar collapsed={true} />);
    expect(screen.queryByText(/© 2025 AIVA/i)).not.toBeInTheDocument();
  });
});
