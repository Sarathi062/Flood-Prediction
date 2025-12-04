import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_DEP_API_URL;

export const useSubscribeRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ regions }) => {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/subscribe-region`,
        { regions }, // <-- array
        { withCredentials: true }
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });
};
