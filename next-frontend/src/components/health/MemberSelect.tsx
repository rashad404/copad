"use client";
import type { Family } from "@/api/healthRecord";
import { enumLabel } from "./model";
import { usePublicCopy } from "@/components/public/ProductLayout";
/** Shared family/member options for health records and grounded chat. */
export default function MemberSelect({
  id,
  families,
  value,
  onChange,
  disabled = false,
  allowAnonymous = false,
}: {
  id: string;
  families: Family[];
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  allowAnonymous?: boolean;
}) {
  const c = usePublicCopy();
  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      disabled={disabled}
    >
      {(allowAnonymous || !value) && (
        <option value="">
          {allowAnonymous
            ? c("No member · general chat", "Üzv seçilməyib · ümumi söhbət")
            : c("Select a member", "Üzv seçin")}
        </option>
      )}
      {families.map((f) => (
        <optgroup key={f.id} label={`${f.name} · ${enumLabel(f.role, c)}`}>
          {f.members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName} · {enumLabel(m.relationship, c)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
