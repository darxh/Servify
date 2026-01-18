import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await apiClient.get("/categories");
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });
};