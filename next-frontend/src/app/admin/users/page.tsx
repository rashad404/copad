"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
  type UserListItem,
} from "@/api/admin";
import ResourceTable from "@/components/admin/ResourceTable";
import ResourceForm from "@/components/admin/ResourceForm";
import type { ResourceConfig } from "@/components/admin/types";
import { useResource } from "@/components/admin/useResource";

type UserRecord = UserListItem & { role?: string };
const config: ResourceConfig<UserRecord> = {
  title: "Users",
  singular: "user",
  idKey: "id",
  searchKeys: ["name", "email"],
  fields: [
    { key: "name", label: "Name", type: "text", inForm: false },
    { key: "email", label: "Email", type: "text", inForm: false },
    {
      key: "roles",
      label: "Roles",
      type: "badge",
      inForm: false,
      render: (_, user) => user.roles.join(", "),
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      inTable: false,
      required: true,
      options: [
        { label: "User", value: "USER" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
  ],
};
export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [role, setRole] = useState("ALL");
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const fetchUsers = useCallback(
    async () => (await getAllUsers(page, 20)).data,
    [page],
  );
  const resource = useResource(fetchUsers);
  useEffect(() => {
    if (
      !resource.loading &&
      !resource.error &&
      resource.data &&
      page > 0 &&
      page >= resource.data.totalPages
    )
      setPage(Math.max(0, resource.data.totalPages - 1));
  }, [resource.data, resource.loading, resource.error, page]);
  return (
    <>
      <label className="mb-4 block text-sm text-gray-700 dark:text-gray-300">
        Role on this page
        <select
          className="ml-3 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="ALL">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </label>
      <ResourceTable
        config={config}
        records={(resource.data?.content ?? []).filter(
          (user) => role === "ALL" || user.roles.includes(role),
        )}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.reload}
        pagination={{
          page,
          totalPages: resource.data?.totalPages ?? 0,
          totalElements: resource.data?.totalElements ?? 0,
          onChange: setPage,
        }}
        actions={[
          {
            label: "Edit role",
            onClick: (user) =>
              setEditing({
                ...user,
                role: user.roles.includes("ADMIN") ? "ADMIN" : "USER",
              }),
          },
          {
            label: "Delete",
            destructive: true,
            confirmation: (user) =>
              `Delete ${user.email}? This cannot be undone.`,
            onClick: async (user) => {
              await deleteUser(user.id);
              await resource.reload();
            },
          },
        ]}
      />
      {editing && (
        <ResourceForm
          config={{ ...config, singular: `role for ${editing.email}` }}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={async (values) => {
            await updateUserRole(editing.id, String(values.role));
            setEditing(null);
            await resource.reload();
          }}
        />
      )}
    </>
  );
}
