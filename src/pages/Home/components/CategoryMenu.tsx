import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useCategories } from "../../../hooks/useCategories";
import PageError from "../../../components/PageError";
import type { ApiCategory } from "../../../types/ApiCategory";
import Skeleton from "@mui/material/Skeleton";

type CategoryMenuProps = {
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
};

export default function CategoryMenu({
  selectedCategory,
  setSelectedCategory,
}: CategoryMenuProps) {
  // Categories
  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  return (
    <Paper
      elevation={2}
      sx={{
        minWidth: 220,
        maxWidth: 260,
        bgcolor: "#f7f7fa",
        p: 2,
        height: "fit-content",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>

      {loadingCategories && (
        <List>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItemButton key={i}>
              <ListItemText
                primary={
                  <Skeleton
                    data-testid="skeleton-category"
                    variant="text"
                    width={120}
                  />
                }
              />
            </ListItemButton>
          ))}
        </List>
      )}

      {errorCategories && <PageError message="Error loading categories" />}

      {!loadingCategories && !errorCategories && (
        <List dense>
          <ListItemButton
            selected={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          >
            <ListItemText primary="All" />
          </ListItemButton>

          {categories?.map((cat: ApiCategory) => (
            <ListItemButton
              key={cat.id}
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              aria-current={selectedCategory === cat.id ? "true" : undefined}
            >
              <ListItemText
                primary={cat.name}
                primaryTypographyProps={{
                  fontWeight: selectedCategory === cat.id ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  );
}
