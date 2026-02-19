import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newServiceData) => {
      const response = await apiClient.post("/services", newServiceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      navigate("/dashboard/services");
    },
    onError: (error) => {
      // console.error("Failed to create service:", error);
      // alert("Failed to create service. Check console for details.");
      console.error("Failed to create service:", error);
    }
  });
};