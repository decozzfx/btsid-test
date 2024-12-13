import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomAxios } from "../config/axios";

export const useGetChecklist = () => {
  const data = useQuery({
    queryKey: ["checklist"],
    queryFn: async () => {
      const response = await CustomAxios.get<GetChecklistResponse>(
        "/checklist"
      );

      return response.data;
    },
  });
  return data;
};

export const useDeleteChecklist = () => {
  const data = useMutation({
    mutationKey: ["checklist"],
    mutationFn: async (id: number) => {
      const response = await CustomAxios.delete(`/checklist/${id}`);

      return response;
    },
  });
  return data;
};

export const useCreateChecklist = () => {
  const data = useMutation({
    mutationKey: ["checklist"],
    mutationFn: async ({ title }: { title: string }) => {
      const response = await CustomAxios.post("/checklist", { name: title });

      return response;
    },
  });
  return data;
};

export const useCreateChecklistItem = () => {
  const data = useMutation({
    mutationKey: ["create checklist item"],
    mutationFn: async ({ id, itemName }: { id: number; itemName: string }) => {
      const response = await CustomAxios.post(`/checklist/${id}/item`, {
        itemName,
      });

      return response;
    },
  });
  return data;
};

export const useUpdateChecklistItemStatus = () => {
  const data = useMutation({
    mutationKey: ["create checklist item status"],
    mutationFn: async ({ id, idItem }: { id: number; idItem: number }) => {
      const response = await CustomAxios.put(`/checklist/${id}/item/${idItem}`);

      return response;
    },
  });
  return data;
};

export const useUpdateItemNameChecklistItem = () => {
  const data = useMutation({
    mutationKey: ["create checklist item status"],
    mutationFn: async ({
      id,
      idItem,
      itemName,
    }: {
      id: number;
      idItem: number;
      itemName: string;
    }) => {
      const response = await CustomAxios.put(
        `/checklist/${id}/item/rename/${idItem}`,
        {
          itemName,
        }
      );

      return response;
    },
  });
  return data;
};

export const useDeleteChecklistItemStatus = () => {
  const data = useMutation({
    mutationKey: ["create checklist item status"],
    mutationFn: async ({ id, idItem }: { id: number; idItem: number }) => {
      const response = await CustomAxios.delete(
        `/checklist/${id}/item/${idItem}`
      );

      return response;
    },
  });
  return data;
};

interface GetChecklistResponse {
  statusCode: number;
  message: string;
  errorMessage: null;
  data: DataChecklist[];
}

export interface DataChecklist {
  id: number;
  name: string;
  items: IItems[] | null;
  checklistCompletionStatus: boolean;
}

export interface IItems {
  id: number;
  name: string;
  itemCompletionStatus: boolean;
}
