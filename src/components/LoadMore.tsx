import { useIntersection } from "react-use";
import { useRef } from "react";
import { useEffect } from "react";
import { Spinner } from "./ui/Spinner";

export function LoadMore({
  isFetching,
  onInView,
}: {
  isFetching: boolean;
  onInView: () => void;
}) {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      console.log("load more");
      onInView();
    }
  }, [intersection?.isIntersecting]);

  return (
    <div className="flex h-32 items-center justify-center" ref={ref}>
      {isFetching && <Spinner />}
    </div>
  );
}
