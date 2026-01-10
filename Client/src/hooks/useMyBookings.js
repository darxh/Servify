import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await apiClient.get("/bookings/my-bookings");
      return data;
    },
  });
};
