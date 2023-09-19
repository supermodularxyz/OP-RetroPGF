import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type CreateList } from "~/schemas/list";

export function useCreateList() {
  return useMutation(async (list: CreateList) =>
    axios.post("/api/lists/create", list)
  );
}
