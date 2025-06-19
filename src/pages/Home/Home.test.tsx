import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import * as useProductsHook from "../../hooks/useProducts";
import * as useFilteredProductsHook from "../../hooks/useFilteredProducts";

// Mock MUI Skeleton to avoid style warnings
jest.mock("@mui/material/Skeleton", () => (props: any) => (
  <div data-testid="Skeleton" {...props} />
));

// Mock CategoryMenu and ProductCardHome for isolation
jest.mock("./components/CategoryMenu", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="CategoryMenu" />),
}));
jest.mock("./components/ProductCardHome", () => ({
  __esModule: true,
  default: jest.fn(({ product }) => (
    <div data-testid="ProductCardHome">{product.title}</div>
  )),
}));
jest.mock("../../components/PageError", () => ({
  __esModule: true,
  default: jest.fn(({ message, onRetry }) => (
    <div>
      <span data-testid="PageError">{message}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  )),
}));

const mockProducts = [
  {
    id: 1,
    title: "Product A",
    description: "Desc A",
    slug: "product-a",
    price: 10,
    images: ["/a.jpg"],
    category: { id: 2, name: "Cat 1", slug: "cat-1", image: "/category-1.jpg" },
  },
  {
    id: 2,
    title: "Product B",
    description: "Desc B",
    slug: "product-b",
    price: 20,
    images: ["/b.jpg"],
    category: { id: 2, name: "Cat 2", slug: "cat-2", image: "/category-2.jpg" },
  },
];

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons when loading", () => {
    jest.spyOn(useProductsHook, "useProducts").mockReturnValue({
      productsQuery: {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    render(<Home />);
    expect(screen.getAllByTestId("Skeleton").length).toBeGreaterThan(0);
    expect(screen.getByTestId("CategoryMenu")).toBeInTheDocument();
  });

  it("renders error message when error", () => {
    jest.spyOn(useProductsHook, "useProducts").mockReturnValue({
      productsQuery: {
        data: undefined,
        isLoading: false,
        error: { message: "fail" },
        refetch: jest.fn(),
      },
    } as any);
    render(<Home />);
    expect(screen.getByTestId("PageError")).toHaveTextContent("fail");
    expect(screen.getByTestId("CategoryMenu")).toBeInTheDocument();
  });

  it("renders filtered products and ProductCardHome", () => {
    jest.spyOn(useProductsHook, "useProducts").mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest
      .spyOn(useFilteredProductsHook, "useFilteredProducts")
      .mockReturnValue(mockProducts);

    render(<Home />);
    expect(screen.getByTestId("CategoryMenu")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("shows empty message when no products", () => {
    jest.spyOn(useProductsHook, "useProducts").mockReturnValue({
      productsQuery: {
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest
      .spyOn(useFilteredProductsHook, "useFilteredProducts")
      .mockReturnValue([]);

    render(<Home />);
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("changes sort option", () => {
    jest.spyOn(useProductsHook, "useProducts").mockReturnValue({
      productsQuery: {
        data: mockProducts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      },
    } as any);
    jest
      .spyOn(useFilteredProductsHook, "useFilteredProducts")
      .mockReturnValue(mockProducts);

    render(<Home />);
    const select = screen.getByLabelText("Sort by");
    fireEvent.mouseDown(select);
    const option = screen.getByText("Title (Z-A)");
    fireEvent.click(option);
    // The component should update sort state, but since it's internal, we just ensure no crash
    expect(screen.getByText("Products")).toBeInTheDocument();
  });
});
