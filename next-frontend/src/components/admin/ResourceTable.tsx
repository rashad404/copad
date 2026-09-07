"use client";

import { useMemo, useState } from "react";
import { getErrorMessage } from "@/utils/errors";
import { Search, Plus, AlertCircle, Inbox } from "lucide-react";
import type { ResourceConfig, ResourceField, RowAction } from "./types";

interface ResourceTableProps<T> {
  config: ResourceConfig<T>;
  records: T[];
  loading?: boolean;
  error?: string | null;
  actions?: RowAction<T>[];
  onCreate?: () => void;
  onRetry?: () => void;
  showCount?: boolean;
  headingLevel?: 1 | 2;
  pagination?: {
    page: number;
    totalPages: number;
    totalElements: number;
    onChange: (page: number) => void;
  };
}

/** Renders a value when a field declares no custom renderer. */
function defaultCell<T>(field: ResourceField<T>, value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400 dark:text-gray-600">-</span>;
  }

  if (field.type === "boolean") {
    const on = Boolean(value);
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          on
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        {on ? "Yes" : "No"}
      </span>
    );
  }

  if (field.type === "badge") {
    return (
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
        {String(value)}
      </span>
    );
  }

  if (field.type === "date") {
    const date = new Date(String(value));
    return isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-US");
  }

  const text = String(value);
  // Long prose would otherwise stretch a column past the viewport.
  return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

export default function ResourceTable<T extends object>({
  config,
  records,
  loading = false,
  error = null,
  actions = [],
  onCreate,
  onRetry,
  pagination,
  showCount = true,
  headingLevel = 1,
}: ResourceTableProps<T>) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const columns = useMemo(
    () => config.fields.filter((f) => f.inTable !== false),
    [config.fields],
  );

  const visible = useMemo(() => {
    if (!query.trim() || !config.searchKeys?.length) return records;
    const needle = query.trim().toLowerCase();
    return records.filter((record) =>
      config.searchKeys!.some((key) =>
        String((record as Record<string, unknown>)[key] ?? "")
          .toLowerCase()
          .includes(needle),
      ),
    );
  }, [records, query, config.searchKeys]);

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading className="text-2xl font-semibold text-gray-900 dark:text-white">
            {config.title}
          </Heading>
          {showCount && !loading && !error && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {records.length}{" "}
              {records.length === 1
                ? config.singular
                : config.title.toLowerCase()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {config.searchKeys?.length ? (
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  pagination
                    ? "Search this page"
                    : `Search ${config.title.toLowerCase()}`
                }
                aria-label={`Search ${config.title.toLowerCase()}`}
                className="w-56 rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          ) : null}

          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New {config.singular}
            </button>
          )}
        </div>
      </header>

      {actionError && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {actionError}
        </p>
      )}
      {pagination && (
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {pagination.totalElements} total. Table search applies to this page.
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {error ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Try again
              </button>
            )}
          </div>
        ) : loading ? (
          // Skeleton rows rather than a spinner, so the layout does not jump
          // once data arrives.
          <div
            role="status"
            aria-label={`Loading ${config.title.toLowerCase()}`}
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex gap-4 p-4">
                {(columns.length ? columns : [{ key: "loading" }]).map(
                  (col) => (
                    <div
                      key={String(col.key)}
                      className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <Inbox className="h-8 w-8 text-gray-400" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {query
                ? `No ${config.title.toLowerCase()} match "${query}".`
                : (config.emptyMessage ??
                  `No ${config.title.toLowerCase()} yet.`)}
            </p>
            {!query && onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Create the first one
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      scope="col"
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 ${col.className ?? ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {visible.map((record, index) => (
                  <tr
                    key={String(
                      (record as Record<string, unknown>)[config.idKey] ??
                        index,
                    )}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {(() => {
                          const cell = (record as Record<string, unknown>)[
                            col.key
                          ];
                          return col.render
                            ? col.render(cell, record)
                            : defaultCell(col, cell);
                        })()}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-3">
                          {actions
                            .filter(
                              (a) => !a.isAvailable || a.isAvailable(record),
                            )
                            .map((action) => (
                              <button
                                key={action.label}
                                type="button"
                                disabled={busy || loading}
                                onClick={async () => {
                                  if (
                                    action.destructive &&
                                    !window.confirm(
                                      action.confirmation?.(record) ??
                                        `${action.label} this ${config.singular}? This cannot be undone.`,
                                    )
                                  ) {
                                    return;
                                  }
                                  setBusy(true);
                                  setActionError(null);
                                  try {
                                    await action.onClick(record);
                                  } catch (err) {
                                    setActionError(
                                      getErrorMessage(
                                        err,
                                        "The action failed. Please try again.",
                                      ),
                                    );
                                  } finally {
                                    setBusy(false);
                                  }
                                }}
                                className={`font-medium hover:underline disabled:opacity-50 ${
                                  action.destructive
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-indigo-600 dark:text-indigo-400"
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pagination && !error && (
        <nav
          aria-label={`${config.title} pages`}
          className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-300"
        >
          <button
            type="button"
            disabled={loading || busy || pagination.page === 0}
            onClick={() => pagination.onChange(pagination.page - 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {pagination.page + 1} of {Math.max(1, pagination.totalPages)}
          </span>
          <button
            type="button"
            disabled={
              loading || busy || pagination.page + 1 >= pagination.totalPages
            }
            onClick={() => pagination.onChange(pagination.page + 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
