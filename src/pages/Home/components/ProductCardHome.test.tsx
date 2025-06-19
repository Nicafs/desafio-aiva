import { render, screen, fireEvent } from "@testing-library/react";
import ProductCardHome from "./ProductCardHome";
import type { ApiProduct } from "../../../types/ApiProduct";

// Mock for the image
jest.mock("../../../assets/no-image.png", () => "no-image.png");

// Mock for formattedPrice
jest.mock("../../../utils/format", () => ({
  formattedPrice: (price: number) => `$${price.toFixed(2)}`,
}));

const mockProduct: ApiProduct = {
  id: 1,
  title: "Test Product",
  description: "This is a test product with a detailed description.",
  price: 99.99,
  slug: "test-product",
  images: ["https://example.com/product.png"],
  category: {
    id: 2,
    name: "Test Category",
    slug: "test-category",
    image: "",
  },
};

describe("ProductCardHome", () => {
  it("renders product data correctly", () => {
    render(<ProductCardHome product={mockProduct} />);

    // Check title
    expect(
      screen.getByRole("heading", { name: /test product/i }),
    ).toBeInTheDocument();

    // Check description
    expect(screen.getByText(/this is a test product/i)).toBeInTheDocument();

    // Check category
    expect(screen.getByText(/test category/i)).toBeInTheDocument();

    // Check price
    expect(screen.getByText("$99.99")).toBeInTheDocument();

    // Check image
    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("https://example.com/product.png");
    expect(image.alt).toBe("Test Product");
  });

  it("falls back to default image when image fails to load", () => {
    render(<ProductCardHome product={{ ...mockProduct, images: [] }} />);

    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("no-image.png");

    // Simulate image load error
    fireEvent.error(image);
    expect(image.src).toContain("no-image.png");
  });

  it("shows tooltip with description on hover", async () => {
    render(<ProductCardHome product={mockProduct} />);

    const descriptionElement = screen.getByText(
      /this is a test product with a detailed description./i,
    );

    // Hover over the description text
    fireEvent.mouseOver(descriptionElement);

    // Tooltip appears (Material UI shows the tooltip content in the DOM)
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(
      /this is a test product with a detailed description./i,
    );
  });
});
