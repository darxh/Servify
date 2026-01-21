import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/services/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries(["services"]);
      
      queryClient.invalidateQueries(["service", updatedService._id]);
    },
  });
};