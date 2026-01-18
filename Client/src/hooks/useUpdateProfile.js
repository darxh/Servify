import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export const useUpdateProfile = () => {
  const { updateUser } = useAuth(); // We use the function we just created

  return useMutation({
    mutationFn: async (data) => {
      // Calling PUT /api/v1/auth/profile
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data);
    },
  });
};