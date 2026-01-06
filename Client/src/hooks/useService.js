import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const fetchServiceById = async ({ queryKey }) => {
  const [_, serviceId] = queryKey; // We ignore the first item ("service") and grab the ID
  const { data } = await apiClient.get(`/services/${serviceId}`);
  return data.service;
};

export const useService = (serviceId) => {
  return useQuery({
    queryKey: ["service", serviceId], 
    
    queryFn: fetchServiceById,
    
    enabled: !!serviceId, 
  });
};