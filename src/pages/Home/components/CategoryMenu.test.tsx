import { render, screen, fireEvent } from "@testing-library/react";
import CategoryMenu from "./CategoryMenu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoriesService } from "../../../services/categories.service";

// Mock the service
jest.spyOn(CategoriesService, "getAll");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function renderWithClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockCategories = [
  { id: 1, name: "Category 1", slug: "category-1", image: "" },
  { id: 2, name: "Category 2", slug: "category-2", image: "" },
];

describe("CategoryMenu", () => {
  const setSelectedCategory = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons", async () => {
    (CategoriesService.getAll as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithClient(
      <CategoryMenu
        selectedCategory={null}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    const skeletons = screen.getAllByTestId("skeleton-category");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error message on failure", async () => {
    (CategoriesService.getAll as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch"),
    );

    renderWithClient(
      <CategoryMenu
        selectedCategory={null}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    expect(
      await screen.findByText(/error loading categories/i),
    ).toBeInTheDocument();
  });

  it("renders categories correctly", async () => {
    (CategoriesService.getAll as jest.Mock).mockResolvedValue(mockCategories);

    renderWithClient(
      <CategoryMenu
        selectedCategory={null}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    expect(await screen.findByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it('calls setSelectedCategory with null when "All" is clicked', async () => {
    (CategoriesService.getAll as jest.Mock).mockResolvedValue(mockCategories);

    renderWithClient(
      <CategoryMenu
        selectedCategory={1}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    const allButton = await screen.findByRole("button", { name: /all/i });
    fireEvent.click(allButton);

    expect(setSelectedCategory).toHaveBeenCalledWith(null);
  });

  it("calls setSelectedCategory with category id when a category is clicked", async () => {
    (CategoriesService.getAll as jest.Mock).mockResolvedValue(mockCategories);

    renderWithClient(
      <CategoryMenu
        selectedCategory={null}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    const categoryButton = await screen.findByRole("button", {
      name: /category 2/i,
    });
    fireEvent.click(categoryButton);

    expect(setSelectedCategory).toHaveBeenCalledWith(2);
  });

  it("highlights the selected category", async () => {
    (CategoriesService.getAll as jest.Mock).mockResolvedValue(mockCategories);

    renderWithClient(
      <CategoryMenu
        selectedCategory={2}
        setSelectedCategory={setSelectedCategory}
      />,
    );

    const categoryButton = await screen.findByRole("button", {
      name: /category 2/i,
    });

    expect(categoryButton).toHaveAttribute("aria-current", "true");
  });
});
