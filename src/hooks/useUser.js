import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axios.get(
        "https://flood-prediction-backend-ycp3.onrender.com/api/login/me",
        { withCredentials: true }
      );
      return res.data.user;
    },
    retry: false, // important → don't retry unauthorized
  });
};
