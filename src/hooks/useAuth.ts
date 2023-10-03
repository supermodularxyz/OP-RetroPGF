import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const setToken = useSetAccessToken();
  return useMutation(
    (body: { message: string; signature: string; nonce: string }) =>
      axios
        .post<{ accessToken: string }>(`${backendUrl}/api/auth/verify`, body)
        .then((r) => {
          setToken.mutate(r.data.accessToken);
          return r.data;
        })
  );
}

export function useSession() {
  const queryClient = useQueryClient();
  const { data: token } = useAccessToken();
  const setToken = useSetAccessToken();
  // const token = localStorage.getItem("accessToken");
  console.log("token", token);
  return useQuery(
    ["session"],
    () =>
      axios
        .get<{ session: { address: string } }>(
          `${backendUrl}/api/auth/session`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((r) => r.data.session)
        .catch(async (err) => {
          setToken.mutate("");
          await queryClient.invalidateQueries(["session"]);
          throw err;
        }),
    { enabled: Boolean(token) }
  );
}

export function useAccessToken() {
  return useQuery(["accessToken"], () => localStorage.getItem("accessToken"));
}
function useSetAccessToken() {
  const queryClient = useQueryClient();
  return useMutation(async (token: string) => {
    localStorage.setItem("accessToken", token);
    return queryClient.setQueryData(["accessToken"], token);
  });
}
