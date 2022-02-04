import { useState, useCallback } from 'react';

import { useOnChangeState } from './useOnChangeState';

const steps = [10, 25, 50, 100];

type PaginationViewProps = {
  totalItems: number;
  perPage: number;
  currentPage: number;
  paginationSteps: number[];
  showItemsPerPage: boolean;
  onChangePerPage(itemsPerPage: number): void;
  onChangePage(currentPage: number): void;
};

export function usePagination<T>(items: T[], showItemsPerPage: boolean = true) {
  const [currentPage, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const from = currentPage * perPage;
  const to = from + perPage;
  const paginatedItems = items.slice(from, to);

  const changePerPage = useCallback(
    itemPerPage => {
      setPage(Math.floor(from / itemPerPage));
      setPerPage(itemPerPage);
    },
    [from],
  );

  useOnChangeState(
    items.length,
    (a, b) => a !== b,
    () => {
      const maxPageNumber = Math.floor(items.length / perPage);
      if (maxPageNumber < currentPage) {
        setPage(maxPageNumber);
      }
    },
  );

  const paginationViewProps: PaginationViewProps = {
    perPage,
    currentPage,
    showItemsPerPage,
    totalItems: items.length,
    paginationSteps: steps,
    onChangePerPage: changePerPage,
    onChangePage: setPage,
  };

  return { items: paginatedItems, paginationViewProps };
}
