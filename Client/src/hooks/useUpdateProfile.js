import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    }
  });
};