import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/users";

// Hook do pobierania użytkowników
export function useGetUsers() {
  return useQuery({ queryKey: ["users"], queryFn: async () => {
    const { data } = await axios.get(API_URL);
    return data;
  }});
}

// Hook do dodawania użytkownika
export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: { name: string; email: string }) => {
      const { data } = await axios.post(API_URL, user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Odśwież listę użytkowników
    }
  });
}
