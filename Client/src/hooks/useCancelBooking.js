import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await apiClient.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-bookings"]);
    },
  });
};