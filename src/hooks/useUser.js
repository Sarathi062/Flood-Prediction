import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEP_API_URL}/api/login/me`,
          { withCredentials: true }
        );

        return res.data.user;
      } catch (err) {
        if (err.response?.status === 401) {
          return null; // not logged in
        }
        throw err;
      }
    },
    retry: false,
  });
};