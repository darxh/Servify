import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId) => {
      const response = await apiClient.delete(`/services/${serviceId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      // alert("Service deleted successfully");
    },
    onError: (error) => {
      // console.error("Delete failed:", error);
      // alert(error.response?.data?.message || "Failed to delete service");
      console.error("Delete failed:", error);
    },
  });
};