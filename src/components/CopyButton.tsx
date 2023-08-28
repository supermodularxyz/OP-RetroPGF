import { IconButton } from "~/components/ui/Button";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useCopyToClipboard, useTimeout } from "react-use";

export const CopyButton = ({ value = "" }) => {
  const [copyState, copy] = useCopyToClipboard();
  const [isReady, cancel, reset] = useTimeout(2000);
  function handleCopy() {
    copy(value);
    reset();
  }

  return (
    <IconButton
      variant="ghost"
      className="text-gray-500"
      icon={copyState.value && !isReady() ? FaCheck : FaCopy}
      onClick={handleCopy}
    />
  );
};
