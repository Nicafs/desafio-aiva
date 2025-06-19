import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "./ProductCard";
import NoImage from "../../../../assets/no-image.png";

jest.mock("../../../../assets/no-image.png", () => "no-image.png");

// Mock product
const product = {
  id: 123,
  title: "Test Product",
  description: "Detailed product description",
  price: 99.99,
  category: { id: 1, name: "Test Category", slug: "test-category", image: "" },
  images: ["http://image.url/product.png"],
  slug: "test-product",
};

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(
      <ProductCard product={product} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    // Title
    expect(screen.getByText(product.title)).toBeInTheDocument();

    // Description (visible and in tooltip)
    const description = screen.getByText(product.description);
    expect(description).toBeInTheDocument();
    expect(description.closest('div[role="tooltip"]')).toBeNull(); // Tooltip does not appear until hover, just check text

    // Price with $ symbol
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();

    // Category
    expect(screen.getByText(product.category.name)).toBeInTheDocument();

    // Correct image
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", product.images[0]);
    expect(img).toHaveAttribute("alt", product.title);
  });

  it("calls onEdit when Edit button is clicked", () => {
    const onEdit = jest.fn();

    render(
      <ProductCard product={product} onEdit={onEdit} onDelete={jest.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(product);
  });

  it("calls onDelete when Delete button is clicked", () => {
    const onDelete = jest.fn();

    render(
      <ProductCard product={product} onEdit={jest.fn()} onDelete={onDelete} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(product.id);
  });

  it("shows fallback image when image load fails", () => {
    render(
      <ProductCard
        product={{ ...product, images: ["invalid-url"] }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "invalid-url");

    // Simulate image error
    fireEvent.error(img);

    // After error, src should be fallback
    expect(img).toHaveAttribute("src", NoImage);
  });

  it("disables delete button and shows loading when isLoading is true", () => {
    render(
      <ProductCard
        product={product}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={true}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete/i });

    // Button should be disabled
    expect(deleteBtn).toBeDisabled();

    // Loading can be checked by presence of CircularProgress (mock if needed)
    // Here we just check if the button is disabled
  });
});
