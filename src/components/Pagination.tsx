import Link from "next/link";
import { Button } from "~/components/ui/Button";

type Props = {
  currentPage: number;
  pages: number;
  onNavigate: (page: number) => void;
};

// TODO: Mobile view uses infinite query (load 10 more)
export const Pagination = ({ currentPage, pages, onNavigate }: Props) => (
  <div className="flex justify-end gap-2">
    <Button
      disabled={currentPage === 1}
      variant="outline"
      as={Link}
      href={onNavigate(currentPage - 1)}
    >
      Prev
    </Button>

    {Array.from({ length: pages }).map((_, i) => {
      const page = i + 1;
      return (
        <Button
          className="hidden md:block"
          key={page}
          variant={currentPage === page ? "dark" : "outline"}
          as={Link}
          href={onNavigate(page)}
        >
          {page}
        </Button>
      );
    })}
    <Button
      disabled={currentPage === pages}
      variant="outline"
      as={Link}
      href={onNavigate(currentPage + 1)}
    >
      Next
    </Button>
  </div>
);
