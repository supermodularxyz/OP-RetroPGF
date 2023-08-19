import { Button } from "./ui/Button";

export const ConnectButton = () => (
  <>
    <Button className="rounded-full lg:hidden" color="primary">
      Connect
    </Button>
    <Button className="hidden rounded-full lg:block" color="primary">
      Connect wallet
    </Button>
  </>
);
