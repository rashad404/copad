"use client";
import { useCallback, useEffect, useState } from "react";
import ResourceTable from "../ResourceTable";
import ResourceForm from "../ResourceForm";
import { useResource } from "../useResource";
import type { ResourceConfig, RowAction } from "../types";
import type { DirectoryPage } from "@/api/adminDirectory";
export default function DirectoryResource<T extends { id: number }>({
  config,
  defaults,
  list,
  save,
  remove,
  name,
  actions = [],
  canEdit = true,
}: {
  config: ResourceConfig<T>;
  defaults: Partial<T>;
  list: (page: number) => Promise<DirectoryPage<T>>;
  save: (
    id: number | undefined,
    values: Partial<T>,
    original: Partial<T>,
  ) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
  name: (row: T) => string;
  actions?: RowAction<T>[];
  canEdit?: boolean;
}) {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const fetcher = useCallback(() => list(page), [list, page]);
  const resource = useResource(fetcher);
  useEffect(() => {
    if (
      !resource.loading &&
      resource.data &&
      page > 0 &&
      page >= resource.data.totalPages
    )
      setPage(Math.max(0, resource.data.totalPages - 1));
  }, [resource.loading, resource.data, page]);
  return (
    <>
      <ResourceTable
        config={config}
        records={resource.data?.content ?? []}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.reload}
        onCreate={canEdit ? () => setEditing(defaults) : undefined}
        showCount={false}
        pagination={{
          page,
          totalPages: resource.data?.totalPages ?? 0,
          totalElements: resource.data?.totalElements ?? 0,
          onChange: setPage,
        }}
        actions={[
          {
            label: "Edit",
            isAvailable: () => canEdit,
            onClick: (row) => setEditing(row),
          },
          ...actions,
          {
            label: "Delete",
            destructive: true,
            confirmation: (row) =>
              `Delete the listing for "${name(row)}"? This removes the ${config.singular} listing.`,
            onClick: async (row) => {
              await remove(row.id);
              await resource.reload();
            },
          },
        ]}
      />
      {editing && (
        <ResourceForm
          config={config}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={async (values) => {
            await save(editing.id, values, editing);
            setEditing(null);
            await resource.reload();
          }}
        />
      )}
    </>
  );
}
