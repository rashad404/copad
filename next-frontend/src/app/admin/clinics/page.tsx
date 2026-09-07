"use client";
import DirectoryResource from "@/components/admin/directory/DirectoryResource";
import {
  clinicConfig,
  clinicDefaults,
  clinicPayload,
} from "@/components/admin/directory/config";
import { clinicsApi } from "@/api/adminDirectory";
const save = (
  id: number | undefined,
  values: Parameters<typeof clinicPayload>[0],
) => clinicsApi.save(id, clinicPayload(values));
export default function ClinicsPage() {
  return (
    <DirectoryResource
      config={clinicConfig}
      defaults={clinicDefaults}
      list={clinicsApi.list}
      save={save}
      remove={clinicsApi.remove}
      name={(row) => row.name}
    />
  );
}
