"use client";
import classNames from "classnames";
import Link from "next/link";

import styles from "./styles.module.scss";
import { MouseEventHandler } from "react";

export interface InsetLinkProps {
  href?: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function Component({
  href,
  label,
  className,
  onClick,
}: InsetLinkProps) {
  const defaultOnClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };
  return (
    <>
      <Link
        href={href ?? "#"}
        onClick={defaultOnClick}
        aria-label={label}
        className={classNames(styles.container, className)}
      />
    </>
  );
}
