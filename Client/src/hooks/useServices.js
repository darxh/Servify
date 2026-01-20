import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const fetchServices = async (params) => {
  const { data } = await apiClient.get("/services", { params });
  return data.services;
};

export const useServices = (params) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
    placeholderData: keepPreviousData,
  });
};