import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await apiClient.put(`/bookings/${id}`, {
        status,
      });
      return data;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries(["my-bookings"]); 
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
        alert(error.response?.data?.message || "Failed to update booking status");
    }
  });
};
