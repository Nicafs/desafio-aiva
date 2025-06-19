import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useUsers } from "../../hooks/useUsers";
import Loading from "../../components/Loading";
import PageError from "../../components/PageError";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";
import { useUserFilters } from "../../hooks/useUserFilters";

function User() {
  const navigate = useNavigate();
  const { filters, handleFilterChange, resetFilters } = useUserFilters();

  const {
    usersQuery: { data, isLoading, error, refetch },
  } = useUsers();

  const handleAdd = () => {
    navigate("/user/new");
  };

  const filteredUsers = useMemo(() => {
    return (data || []).filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";

      return (
        name.includes(filters.name.toLowerCase()) &&
        email.includes(filters.email.toLowerCase()) &&
        role.includes(filters.role.toLowerCase())
      );
    });
  }, [data, filters]);

  if (isLoading) return <Loading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add
        </Button>
      </Stack>

      <UserFilters
        filterValues={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {filteredUsers.length > 0 ? (
        <UserTable users={filteredUsers} />
      ) : (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No users found.
        </Typography>
      )}
    </Box>
  );
}

export default User;
