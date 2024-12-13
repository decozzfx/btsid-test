/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  DataChecklist,
  IItems,
  useCreateChecklist,
  useCreateChecklistItem,
  useDeleteChecklist,
  useDeleteChecklistItemStatus,
  useGetChecklist,
  useUpdateChecklistItemStatus,
  useUpdateItemNameChecklistItem,
} from "./hooks/useChecklist";
import { toast } from "react-toastify";
import {
  CheckIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

const App: React.FC = () => {
  const [notes, setNotes] = useState<DataChecklist[] | []>([]);
  console.log("🚀 ~ notes:", notes);
  const [input, setInput] = useState<string>("");

  const {
    data: dataChecklist,
    isLoading,
    refetch: refetchGetChecklist,
  } = useGetChecklist();
  const { mutate: mutateCreateChecklist } = useCreateChecklist();
  const { mutate: mutateDeleteChecklist } = useDeleteChecklist();

  useEffect(() => {
    if (!isLoading && dataChecklist) {
      setNotes(dataChecklist.data);
    }
  }, [dataChecklist, isLoading]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const createNote = () => {
    mutateCreateChecklist(
      { title: input },
      {
        onSuccess: () => {
          refetchGetChecklist();
          setInput("");
        },
        onError: (error: any) => {
          toast.error(error.response.data.errorMessage);
        },
      }
    );
  };

  const deleteChecklist = (id: number) => {
    mutateDeleteChecklist(id, {
      onSuccess: () => {
        refetchGetChecklist();
      },
      onError: (error: any) => {
        toast.error(error.response.data.errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Checklist Notes</h1>
        <div className="bg-white p-4 rounded shadow-md">
          <Input
            className="w-full p-2 border rounded mb-2"
            placeholder="Note Title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 w-full rounded"
            onClick={createNote}
          >
            Add
          </button>
        </div>
        <div className="mt-4">
          {notes?.map((note, index) => (
            <ChecklistItem
              key={index}
              note={note}
              index={index}
              deleteChecklist={deleteChecklist}
              refetchGetChecklist={refetchGetChecklist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  note,
  deleteChecklist,
  refetchGetChecklist,
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { mutate: mutateCreateChecklistItem } = useCreateChecklistItem();

  const createChecklistItem = (id: number, input: string) => {
    mutateCreateChecklistItem(
      { id, itemName: input },
      {
        onSuccess: () => {
          refetchGetChecklist();
          setInput("");
          setShowInput(false);
        },
        onError: (error: any) => {
          toast.error(error.response.data.errorMessage);
        },
      }
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow-md mb-2">
        <div className="flex">
          {note.name}

          <PlusIcon
            onClick={() => setShowInput(!showInput)}
            color="blue"
            className="ml-auto cursor-pointer "
          />
          <TrashIcon
            onClick={() => deleteChecklist(note.id)}
            color="red"
            className="ml-2 cursor-pointer"
          />
        </div>
        {showInput && (
          <div className="mt-2 flex gap-2 items-center">
            <Input
              className="w-full border rounded "
              placeholder="Checklist Item"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2  rounded"
              onClick={() => createChecklistItem(note.id, input)}
            >
              Add
            </button>
          </div>
        )}
        {note.items?.map((item, index) => (
          <ChecklistItemDetail
            key={index}
            note={note}
            item={item}
            refetchGetChecklist={refetchGetChecklist}
          />
        ))}
      </div>
    </>
  );
};

const ChecklistItemDetail: React.FC<{
  note: DataChecklist;
  item: IItems;
  refetchGetChecklist: () => void;
}> = ({ note, item, refetchGetChecklist }) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [input, setInput] = useState<string>(item.name);

  const { mutate: mutateUpdateChecklistStatus } =
    useUpdateChecklistItemStatus();
  const { mutate: mutateDeleteChecklistItem } = useDeleteChecklistItemStatus();
  const { mutate: mutateUpdateItemNameChecklistItem } =
    useUpdateItemNameChecklistItem();

  const handleCheckChecklistItem = (id: number, idItem: number) => {
    mutateUpdateChecklistStatus(
      { id, idItem },
      {
        onSuccess: () => {
          refetchGetChecklist();
        },
        onError: (error: any) => {
          toast.error(error.response.data.errorMessage);
        },
      }
    );
  };

  const handleDeleteChecklistItem = (id: number, idItem: number) => {
    mutateDeleteChecklistItem(
      { id, idItem },
      {
        onSuccess: () => {
          refetchGetChecklist();
        },
        onError: (error: any) => {
          toast.error(error.response.data.errorMessage);
        },
      }
    );
  };

  const handlerUpdateItemName = (id: number, idItem: number, name: string) => {
    mutateUpdateItemNameChecklistItem(
      { id, idItem, itemName: name },
      {
        onSuccess: () => {
          refetchGetChecklist();
          setShowInput(false);
        },
        onError: (error: any) => {
          toast.error(error.response.data.errorMessage);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 mt-2">
      <div className="flex items-center gap-2">
        <TrashIcon
          color="red"
          onClick={() => handleDeleteChecklistItem(note.id, item.id)}
          className="cursor-pointer"
        />
        <p className={`${item.itemCompletionStatus && "line-through"}`}>
          {showInput ? (
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
          ) : (
            item.name
          )}
        </p>
        {showInput ? (
          <CheckIcon
            color="green"
            className="cursor-pointer"
            onClick={() => handlerUpdateItemName(note.id, item.id, input)}
          />
        ) : (
          <Pencil1Icon
            color="blue"
            onClick={() => setShowInput(!showInput)}
            className="cursor-pointer"
          />
        )}
      </div>
      <input
        type="checkbox"
        checked={item.itemCompletionStatus}
        className="mr-2"
        onChange={() => {
          handleCheckChecklistItem(note.id, item.id);
        }}
      />
    </div>
  );
};

export default App;

interface ChecklistItemProps {
  index: number;
  note: DataChecklist;
  deleteChecklist: (id: number) => void;
  refetchGetChecklist: () => void;
}
