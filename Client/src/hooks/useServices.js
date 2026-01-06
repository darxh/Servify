import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const fetchServices = async () => {
  const { data } = await apiClient.get("/services");
  
  return data.services;
};

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
};