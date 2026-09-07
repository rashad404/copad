"use client";

import Link from "next/link";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { useSiteContext } from "@/context/SiteContext";
import styles from "./BrandLogo.module.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], display: "swap" });

/** One logo lockup for the site header and every public footer. */
export default function BrandLogo({
  onClick,
  priority = false,
}: {
  onClick?: () => void;
  priority?: boolean;
}) {
  const { WEBSITE_NAME } = useSiteContext();
  const brand =
    WEBSITE_NAME === "Localhost" ? "azdoc" : WEBSITE_NAME.toLowerCase();
  return (
    <Link
      href="/"
      className={`${styles.brand} ${manrope.className}`}
      aria-label={brand}
      onClick={onClick}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={36}
        height={36}
        className={styles.brandMark}
        priority={priority}
      />
      {brand}
    </Link>
  );
}
