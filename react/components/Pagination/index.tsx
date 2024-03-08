import { DOTS, usePagination } from "@/hooks/usePagination";
import Link from "next/link";
import styles from "./index.module.scss";
export type PaginationProps = {
  //onPageChange: (page: number) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  siblingCount?: number;
  pageCount: number;
  target: string;
};

export default function Pagination(props: PaginationProps) {
  const paginationRange = usePagination({
    currentPage: props.currentPage,
    totalCount: props.totalCount,
    siblingCount: props.siblingCount,
    pageSize: props.pageSize,
    pageCount: props.pageCount,
  });
  if (
    props.currentPage === 0 ||
    !paginationRange ||
    paginationRange.length < 2
  ) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={styles.container}>
      <li
        key="previous"
        className={`px-4 py-2 ${props.currentPage === 1 ? "disabled" : ""}`}
      >
        <Link
          href={`${props.target}?page=${
            props.currentPage === 1 ? props.currentPage : props.currentPage - 1
          }`}
          className={`${styles.arrow} ${styles.left}`}
        />
      </li>

      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li className="px-4 py-2 dots" key="dots">
              &#8230;
            </li>
          );
        }
        return (
          <Link
            href={`${props.target}?page=${pageNumber}`} //TODO: Fix this
            key={`page-${pageNumber}`}
            className={`${styles.pill} ${
              pageNumber === props.currentPage ? styles.selected : ""
            }`}
          >
            <li>{pageNumber}</li>
          </Link>
        );
      })}

      <li
        className={`px-4 py-2 ${
          props.currentPage === lastPage ? "disabled" : ""
        }`}
        key="next"
      >
        <Link
          className={`${styles.arrow} ${styles.right}`}
          href={`${props.target}?page=${
            props.currentPage === lastPage ? lastPage : props.currentPage + 1 //TODO: Fix this
          }`}
        />
      </li>
    </ul>
  );
}
