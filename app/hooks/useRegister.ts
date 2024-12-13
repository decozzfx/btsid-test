"use client";
import { useMutation } from "@tanstack/react-query";
import { CustomAxios } from "../config/axios";

export const useRegister = () => {
  const data = useMutation({
    mutationKey: ["register"],
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const response = await CustomAxios.post("/register", {
        email,
        password,
        username,
      });

      return response;
    },
  });

  return data;
};
