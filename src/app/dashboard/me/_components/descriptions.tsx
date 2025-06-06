"use client";

import { ChangeEvent, useState, useRef } from "react";
import { debounce } from "lodash";
import { changeName } from "../_actions/change-name";
import { toast } from "sonner";
import { changeBio } from "../_actions/change-bio";

export function Description({
  initialDescription,
}: {
  initialDescription: string;
}) {
  const [description, setDescription] = useState(initialDescription);
  const [originalDescription, setOriginalDescription] =
    useState(initialDescription);

  const debouncedSaveName = useRef(
    debounce(async (currentDescription) => {
      if (currentDescription.trim() === "") {
        setDescription(originalDescription);
        return;
      }

      if (currentDescription !== description) {
        try {
          const response = await changeBio({ description: currentDescription });

          if (response.error) {
            toast.error(response.error);
            setDescription(originalDescription);
            return;
          }

          toast.success("Descrição atualizada com sucesso!");
        } catch (error) {
          setDescription(originalDescription);
        }
      }
    }, 500)
  ).current;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setDescription(value);

    debouncedSaveName(value);
  }

  return (
    <textarea
      className="text-base md:text-2xl bg-gray-50 border border-gray-100 rounded-md outline-none p-2 w-full max-w-2xl my-3 h-40 resize-none text-center"
      value={description}
      onChange={handleChange}
    />
  );
}
