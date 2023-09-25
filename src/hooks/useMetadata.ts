import { useMutation } from "@tanstack/react-query";
import { uploadIpfs } from "~/utils/ipfs";

export function useUploadMetadata() {
  return useMutation((data: object) => uploadIpfs(data));
}
