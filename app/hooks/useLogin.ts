"use client";
import { useMutation } from "@tanstack/react-query";
import { CustomAxios } from "../config/axios";

export const useLogin = () => {
  const data = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await CustomAxios.post<ILoginResponse>("/login", {
        username,
        password,
      });

      return response;
    },
  });

  return data;
};
interface ILoginResponse {
  statusCode: number;
  message: string;
  errorMessage: null;
  data: Data;
}

interface Data {
  token: string;
}
