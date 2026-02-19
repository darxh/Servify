import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, formData }) => {
      const response = await apiClient.put(`/services/${serviceId}`, formData);
      return response.data;
    },
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["service", updatedService._id]);
      // alert("Service updated successfully!");
    },
    onError: (error) => {
      // console.error("Update failed:", error);
      // alert(error.response?.data?.message || "Failed to update service");
      console.error("Update failed:", error);
    }
  });
};