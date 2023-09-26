import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useNonce() {
  return useQuery(["nonce"], () =>
    axios
      .get<{ nonce: string }>(`${backendUrl}/api/auth/nonce`)
      .then((r) => r.data?.nonce)
  );
}

export function useVerify() {
  return useMutation(
    ({ message, signature }: { message: string; signature: string }) =>
      axios
        .post<{ success: boolean }>(
          `${backendUrl}/api/auth/verify`,
          {
            message,
            signature,
          },
          { withCredentials: true }
        )
        .then((r) => r.data)
  );
}

export function useSession() {
  return useQuery(["session"], () =>
    axios
      .get<{ address: string }>(`${backendUrl}/api/auth/session`)
      .then((r) => r.data)
  );
}

export function createMessage({ address = "", nonce = "", chainId = 10 }) {
  return `${backendUrl} wants you to sign in with your Ethereum account:
${address}

Sign in to Agora Optimism

URI: https://${backendUrl}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`;
}
