import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { ApiUser } from "../types/ApiUser";

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: UsersService.getAll,
  });

  const getByIdUser = useMutation({
    mutationFn: UsersService.getById,
  });

  const createUser = useMutation({
    mutationFn: ({ user }: { user: Partial<ApiUser> }) =>
      UsersService.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<ApiUser> }) =>
      UsersService.update(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeUser = useMutation({
    mutationFn: UsersService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    usersQuery,
    getByIdUser,
    createUser,
    updateUser,
    removeUser,
  };
}
