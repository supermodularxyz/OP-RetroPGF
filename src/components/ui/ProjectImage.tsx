export const ProjectImage = ({
  small,
  avatarUrl,
}: {
  small?: boolean;
  avatarUrl?: string;
}) => (
  <div
    className={`${
      !small ? "h-16 w-16 rounded-lg p-1" : "h-8 w-8 rounded-md p-0.5"
    }  border border-gray-200 bg-white `}
  >
    <div
      className={`${
        !small ? "rounded-md" : "rounded"
      } flex h-full w-full bg-gray-200`}
    />
  </div>
);
