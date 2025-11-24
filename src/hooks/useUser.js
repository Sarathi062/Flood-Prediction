import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_DEP_API_URL}/api/login/me`,
        { withCredentials: true }
      );
      return res.data.user;
    },
    retry: false, // important → don't retry unauthorized
  });
};
