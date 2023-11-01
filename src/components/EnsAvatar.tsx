import { Address } from "viem";
import { useAvatar } from "~/hooks/useAvatar";
import { Avatar } from "./ui/Avatar";

export const EnsAvatar = ({ address }: { address?: Address }) => {
  const { data } = useAvatar(address);
  return <Avatar src={data?.avatar} size="xs" rounded="full" />;
};
