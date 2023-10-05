/*

TODO: Remove this because profiles are included in Projects query.

*/
import { useQuery } from "@tanstack/react-query";
import { fetchProfiles } from "~/utils/attestations";

type Profile = {
  id: string;
  name: string;
  owner: string;
  bannerImageUrl?: string;
  profileImageUrl?: string;
};
export function useProfile(address?: string) {
  const { data: profiles, isLoading } = useAllProfiles();

  return useQuery<Profile | null>(
    ["profiles", address],
    async () => profiles?.find((p) => p.owner === address) ?? null,
    { enabled: Boolean(address && !isLoading) }
  );
}
export function useAllProfiles() {
  return useQuery<Profile[]>(["profiles"], async () =>
    fetch("/api/profiles").then((r) => r.json())
  );
}
