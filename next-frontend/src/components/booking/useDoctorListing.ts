"use client";

import { useEffect, useState } from "react";
import { getMyListing } from "@/api/doctorSelf";

/**
 * Whether the signed-in account has a doctor listing.
 *
 * Used to decide who is shown the doctor panel. Almost nobody is a doctor, so
 * the answer is remembered for the tab rather than asked again on every page:
 * the alternative was showing every patient a "Doctor panel" link that had
 * nothing behind it.
 *
 * Keyed by user id so a second account signing in on the same tab does not
 * inherit the first one's answer.
 */
export function useDoctorListing(userId?: string | null) {
  const [hasListing, setHasListing] = useState(false);

  useEffect(() => {
    if (!userId) {
      setHasListing(false);
      return;
    }
    const key = `azdoc.doctorListing.${userId}`;

    let remembered: string | null = null;
    try {
      remembered = sessionStorage.getItem(key);
    } catch {
      // Private browsing can refuse storage; asking again is the fallback.
    }
    if (remembered !== null) {
      setHasListing(remembered === "1");
      return;
    }

    const controller = new AbortController();
    getMyListing(controller.signal)
      .then((listing) => {
        const owns = Boolean(listing);
        setHasListing(owns);
        try {
          sessionStorage.setItem(key, owns ? "1" : "0");
        } catch {
          // Not being able to remember it is not worth failing over.
        }
      })
      .catch(() => setHasListing(false));
    return () => controller.abort();
  }, [userId]);

  return hasListing;
}
