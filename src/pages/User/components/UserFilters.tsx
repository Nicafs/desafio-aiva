import { TextField, Button, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import type { UserFiltersType } from "../../../hooks/useUserFilters";

type UserFiltersProps = {
  filterValues: UserFiltersType;
  onFilterChange: (filters: Partial<UserFiltersType>) => void;
  onReset: () => void;
};

export default function UserFilters({
  filterValues,
  onFilterChange,
  onReset,
}: UserFiltersProps) {
  return (
    <Box display="flex" gap={3} mb={2}>
      <TextField
        label="Name"
        value={filterValues.name}
        onChange={(e) => onFilterChange({ name: e.target.value })}
        placeholder="Search by name"
        size="small"
      />
      <TextField
        label="E-mail"
        value={filterValues.email}
        onChange={(e) => onFilterChange({ email: e.target.value })}
        placeholder="Search by e-mail"
        size="small"
      />
      <TextField
        label="Role"
        value={filterValues.role}
        onChange={(e) => onFilterChange({ role: e.target.value })}
        placeholder="Search by role"
        size="small"
      />

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<ClearIcon />}
        onClick={onReset}
      >
        Clear
      </Button>
    </Box>
  );
}
