import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductGrid from "./Product";
import * as useProductsHook from "../../../hooks/useProducts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock MUI components (optional, for style warnings)
jest.mock("@mui/material/Card", () => (props: any) => (
  <div data-testid="Card">{props.children}</div>
));
jest.mock("@mui/material/Grid", () => (props: any) => (
  <div data-testid="Grid">{props.children}</div>
));
jest.mock("@mui/material/Box", () => (props: any) => (
  <div data-testid="Box">{props.children}</div>
));
jest.mock("@mui/material/Stack", () => (props: any) => (
  <div data-testid="Stack">{props.children}</div>
));
jest.mock("@mui/material/Button", () => (props: any) => (
  <button {...props}>{props.children}</button>
));
jest.mock("@mui/material/Typography", () => (props: any) => (
  <div>{props.children}</div>
));

jest.mock("../ProductDetail/ProductDetail", () => ({
  __esModule: true,
  default: (props: any) =>
    props.open ? <div data-testid="ProductDetail" /> : null,
}));
jest.mock("../../../components/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="Loading" />,
}));
jest.mock("../../../components/PageError", () => ({
  __esModule: true,
  default: ({ message, onRetry }: any) => (
    <div data-testid="PageError">
      {message}
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));
jest.mock("./components/ProductCard", () => ({
  __esModule: true,
  default: ({ product, onEdit, onDelete, isLoading }: any) => (
    <div data-testid="ProductCard">
      <span>{product.title}</span>
      <button onClick={() => onEdit(product)}>Edit</button>
      <button onClick={() => onDelete(product.id)}>Delete</button>
      {isLoading && <span>Loading...</span>}
    </div>
  ),
}));

const mockProducts = [
  {
    id: 1,
    title: "Product 1",
    description: "Description 1",
    price: 10,
    images: ["img1.jpg"],
    category: [{ id: 1, name: "Cat 1" }],
  },
  {
    id: 2,
    title: "Product 2",
    description: "Description 2",
    price: 20,
    images: ["img2.jpg"],
    category: [{ id: 2, name: "Cat 2" }],
  },
];

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("ProductGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: false },
    });
    renderWithClient(<ProductGrid />);
    expect(screen.getByTestId("Loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: undefined,
        isLoading: false,
        error: { message: "fail" },
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: false },
    });
    renderWithClient(<ProductGrid />);
    expect(screen.getByTestId("PageError")).toHaveTextContent("fail");
    fireEvent.click(screen.getByText("Retry"));
  });

  it("renders products and ProductCard", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: false },
    });
    renderWithClient(<ProductGrid />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getAllByTestId("ProductCard").length).toBe(2);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("opens ProductDetail dialog when Add is clicked", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: false },
    });
    renderWithClient(<ProductGrid />);
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("ProductDetail")).toBeInTheDocument();
  });

  it("opens ProductDetail dialog when Edit is clicked", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: false },
    });
    renderWithClient(<ProductGrid />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(screen.getByTestId("ProductDetail")).toBeInTheDocument();
  });

  it("calls removeProduct.mutate when Delete is confirmed", () => {
    const mutate = jest.fn();
    window.confirm = jest.fn(() => true);
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate, isPending: false },
    });
    renderWithClient(<ProductGrid />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(mutate).toHaveBeenCalledWith({ id: 1 });
  });

  it("does not call removeProduct.mutate when Delete is cancelled", () => {
    const mutate = jest.fn();
    window.confirm = jest.fn(() => false);
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate, isPending: false },
    });
    renderWithClient(<ProductGrid />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows loading indicator on ProductCard when deleting", () => {
    (useProductsHook.useProducts as jest.Mock) = jest.fn().mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
      removeProduct: { mutate: jest.fn(), isPending: true },
    });
    renderWithClient(<ProductGrid />);
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });
});
