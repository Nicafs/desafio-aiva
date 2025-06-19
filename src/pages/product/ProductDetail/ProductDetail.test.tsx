import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductDetail from "./ProductDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ApiProduct } from "../../../types/ApiProduct";

// 🧠 Mock hooks
jest.mock("../../../hooks/useProducts", () => ({
  useProducts: jest.fn(),
}));

jest.mock("../../../hooks/useCategories", () => ({
  useCategories: () => ({
    data: [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ],
  }),
}));

const mockProduct: ApiProduct = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  description: "Product description",
  slug: "test-product",
  images: ["https://example.com/image.png"],
  category: {
    id: 1,
    name: "Category 1",
    slug: "category-1",
    image: "",
  },
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("ProductDetail", () => {
  const createProduct = {
    mutateAsync: jest.fn(),
  };
  const updateProduct = {
    mutateAsync: jest.fn(),
  };
  const { useProducts }: any = require("../../../hooks/useProducts");

  beforeEach(() => {
    jest.clearAllMocks();
    useProducts.mockReturnValue({
      createProduct,
      updateProduct,
    });
  });

  it("does not render when open is false", () => {
    renderWithClient(<ProductDetail open={false} onClose={jest.fn()} />);
    expect(screen.queryByText(/New Product/i)).not.toBeInTheDocument();
  });

  it("renders correctly in create mode", () => {
    renderWithClient(<ProductDetail open={true} onClose={jest.fn()} />);
    expect(screen.getByText(/New Product/i)).toBeInTheDocument();
    expect(screen.getByTestId("input-title")).toBeInTheDocument();
    expect(screen.getByTestId("input-category")).toBeInTheDocument();
  });

  it("renders correctly in edit mode with product data", () => {
    renderWithClient(
      <ProductDetail open={true} onClose={jest.fn()} product={mockProduct} />,
    );
    expect(screen.getByDisplayValue(mockProduct.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(String(mockProduct.price)),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockProduct.description),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.images[0])).toBeInTheDocument();
    expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = jest.fn();
    renderWithClient(<ProductDetail open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("submits form correctly in create mode", async () => {
    createProduct.mutateAsync.mockResolvedValueOnce({});

    const onClose = jest.fn();
    const onSuccess = jest.fn();

    renderWithClient(
      <ProductDetail open={true} onClose={onClose} onSuccess={onSuccess} />,
    );

    // Fill fields
    fireEvent.change(screen.getByTestId("input-title"), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByTestId("input-price"), {
      target: { value: "150" },
    });
    fireEvent.change(screen.getByTestId("input-description"), {
      target: { value: "New product description" },
    });
    fireEvent.change(screen.getByTestId("input-images"), {
      target: { value: "https://image.com/product.png" },
    });

    // Category (Select)
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText("Category 1"));

    // Submit
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(createProduct.mutateAsync).toHaveBeenCalledWith({
        product: {
          title: "New Product",
          price: 150,
          description: "New product description",
          images: ["https://image.com/product.png"],
          categoryId: 1,
        },
      });
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("submits form correctly in edit mode", async () => {
    updateProduct.mutateAsync.mockResolvedValueOnce({});

    const onClose = jest.fn();
    const onSuccess = jest.fn();

    renderWithClient(
      <ProductDetail
        open={true}
        onClose={onClose}
        onSuccess={onSuccess}
        product={mockProduct}
      />,
    );

    // Change description
    fireEvent.change(screen.getByTestId("input-description"), {
      target: { value: "Updated description" },
    });

    // Submit
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(updateProduct.mutateAsync).toHaveBeenCalledWith({
        id: mockProduct.id,
        product: expect.objectContaining({
          description: "Updated description",
        }),
      });
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("shows error message when API returns error", async () => {
    const errorMsg = "Error saving";
    createProduct.mutateAsync.mockRejectedValueOnce(new Error(errorMsg));

    renderWithClient(<ProductDetail open={true} onClose={jest.fn()} />);

    // Fill fields
    fireEvent.change(screen.getByTestId("input-title"), {
      target: { value: "Error Product" },
    });
    fireEvent.change(screen.getByTestId("input-price"), {
      target: { value: "150" },
    });
    fireEvent.change(screen.getByTestId("input-description"), {
      target: { value: "Description with error" },
    });
    fireEvent.change(screen.getByTestId("input-images"), {
      target: { value: "https://image.com/error.png" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText("Category 1"));

    fireEvent.click(screen.getByText(/Save/i));

    const alert = await screen.findByTestId("alert-error");
    expect(alert).toHaveTextContent(errorMsg);
  });

  it("validates required fields", async () => {
    renderWithClient(<ProductDetail open={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(2);
    });
  });
});
