import Link from "next/link";
import { Button } from "~/components/ui/Button";

type Props = {
  currentPage: number;
  pages?: number;
  onNavigate: (page: number) => void;
};

// TODO: Mobile view uses infinite query (load 10 more)
export const Pagination = ({ currentPage, pages = 1, onNavigate }: Props) => (
  <div className="flex justify-end gap-2">
    <Button
      disabled={currentPage === 1}
      variant="outline"
      size="sm"
      as={Link}
      href={onNavigate(currentPage - 1)}
    >
      Prev
    </Button>

    {Array.from({ length: Math.min(pages, 7) }).map((_, i) => {
      const page = i + 1 + (pages > 7 ? Math.floor(currentPage - 4) : 0);
      return page > 0 && page < pages ? (
        <Button
          className="hidden md:block"
          key={page}
          variant={currentPage === page ? "dark" : "outline"}
          size="sm"
          as={Link}
          href={onNavigate(page)}
        >
          {page}
        </Button>
      ) : null;
    })}

    <Button
      disabled={currentPage === pages}
      variant="outline"
      size="sm"
      as={Link}
      href={onNavigate(currentPage + 1)}
    >
      Next
    </Button>
  </div>
);
