import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, rating, comment }) => {
      const { data } = await apiClient.post("/reviews", { 
        serviceId, 
        rating, 
        comment 
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["service"]);
    },
  });
};