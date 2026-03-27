import React from 'react';
import Button from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 5;
const disabledButtonClassName =
  'min-w-[3rem] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0';

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pagesToShow = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const halfWindow = Math.floor(pagesToShow / 2);

  let startPage = Math.max(1, safeCurrentPage - halfWindow);
  let endPage = startPage + pagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);
  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === totalPages;

  const goToPage = (page: number) => {
    if (page === safeCurrentPage || page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        className={disabledButtonClassName}
        onClick={() => goToPage(1)}
        disabled={isFirstPage}
        aria-label="Go to first page"
      >
        First
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={disabledButtonClassName}
        onClick={() => goToPage(safeCurrentPage - 1)}
        disabled={isFirstPage}
        aria-label="Go to previous page"
      >
        Prev
      </Button>

      {visiblePages.map((page) => {
        const isActive = page === safeCurrentPage;

        return (
          <Button
            key={page}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            className="min-w-[3rem]"
            onClick={() => goToPage(page)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={isActive ? `Current page, page ${page}` : `Go to page ${page}`}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        className={disabledButtonClassName}
        onClick={() => goToPage(safeCurrentPage + 1)}
        disabled={isLastPage}
        aria-label="Go to next page"
      >
        Next
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={disabledButtonClassName}
        onClick={() => goToPage(totalPages)}
        disabled={isLastPage}
        aria-label="Go to last page"
      >
        Last
      </Button>
    </nav>
  );
};

export default Pagination;
