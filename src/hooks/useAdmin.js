import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAdmin = () => {
  return useQuery({
    queryKey: ["currentAdmin"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEP_API_URL}/api/login/admin`,
          { withCredentials: true }
        );

        return res.data.admin;
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
  });
};