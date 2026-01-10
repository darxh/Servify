import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await apiClient.post("/bookings", bookingData);
      return response.data;
    },
    onSuccess: () => {
      alert("Booking confirmed successfully!");
      queryClient.invalidateQueries(["bookings"]);
      navigate("/dashboard/bookings");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to book service";
      alert(message);
    },
  });
};
