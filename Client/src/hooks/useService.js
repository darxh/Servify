import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const fetchServiceById = async ({ queryKey }) => {
  const [_, serviceId] = queryKey;
  
  const response = await apiClient.get(`/services/${serviceId}`);
 
  return response.data;
};

export const useService = (serviceId) => {
  return useQuery({
    queryKey: ["service", serviceId],
    queryFn: fetchServiceById,
    enabled: !!serviceId,
    retry: false,
  });
};