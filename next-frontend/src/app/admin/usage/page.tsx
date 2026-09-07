"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { getAdminUsage, type AdminUsage, type UsageMetrics } from "@/api/admin";
import ResourceTable from "@/components/admin/ResourceTable";
import type { ResourceConfig } from "@/components/admin/types";
import { useResource } from "@/components/admin/useResource";
import { costPerCall, usd, validateUsage } from "@/components/admin/usage";

const integer = (n: number) => n.toLocaleString("en-US");
type ModelUsage = AdminUsage["byModel"][number];
type DailyUsage = AdminUsage["daily"][number];
const metrics = <T extends UsageMetrics>(): ResourceConfig<T>["fields"] => [
  {
    key: "calls",
    label: "Calls",
    type: "number",
    render: (_, row) => integer(row.calls),
  },
  {
    key: "tokens",
    label: "Tokens",
    type: "number",
    render: (_, row) => integer(row.tokens),
  },
  {
    key: "costUsd",
    label: "Cost (USD)",
    type: "number",
    render: (_, row) => (
      <div>
        {usd(row.costUsd)}
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {costPerCall(row.costUsd, row.calls)} / call
        </div>
      </div>
    ),
  },
];
const modelConfig: ResourceConfig<ModelUsage> = {
  title: "By model",
  singular: "model",
  idKey: "model",
  fields: [
    { key: "model", label: "Model", type: "text" },
    ...metrics<ModelUsage>(),
  ],
  emptyMessage: "No model usage recorded for this period.",
};
const dailyConfig: ResourceConfig<DailyUsage> = {
  title: "Daily usage",
  singular: "day",
  idKey: "date",
  fields: [
    { key: "date", label: "Date", type: "text" },
    ...metrics<DailyUsage>(),
  ],
  emptyMessage: "No daily usage recorded for this period.",
};

export default function UsagePage() {
  const [days, setDays] = useState(30);
  const fetchUsage = useCallback(async () => {
    try {
      return validateUsage((await getAdminUsage(days)).data);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        [404, 501, 503].includes(error.response?.status ?? 0)
      )
        throw new Error(
          "Usage reporting is unavailable. Current spend and remaining budget are unknown. Try again after the endpoint is available.",
        );
      throw error;
    }
  }, [days]);
  const resource = useResource(fetchUsage);
  const data = resource.data;
  const reached = data ? data.spentTodayUsd >= data.dailyLimitUsd : false;
  const daily = data
    ? [...data.daily].sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const peakCost = Math.max(0, ...daily.map((day) => day.costUsd));
  const maxCost = Math.max(0.01, peakCost);
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Cost and usage
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            AI usage and daily budget. All costs are in USD.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Period{" "}
            <select
              className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </label>
          <button
            type="button"
            disabled={resource.loading}
            onClick={resource.reload}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
          >
            Refresh
          </button>
        </div>
      </header>
      {resource.loading ? (
        <div
          role="status"
          className="animate-pulse rounded-xl bg-gray-200 p-12 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          Loading usage...
        </div>
      ) : resource.error || !data ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          <p>{resource.error ?? "Usage data is unavailable."}</p>
          <p className="mt-2 text-sm">
            Do not assume the assistant has budget remaining.
          </p>
          <button
            type="button"
            onClick={resource.reload}
            className="mt-4 rounded-lg border border-current px-3 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section
            aria-labelledby="budget-title"
            className={`rounded-xl border p-6 ${reached ? "border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100" : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"}`}
          >
            <h2 id="budget-title" className="text-sm font-medium">
              Today&apos;s spend / daily ceiling
            </h2>
            <p className="mt-3 break-words text-4xl font-semibold tracking-tight">
              {usd(data.spentTodayUsd)}{" "}
              <span className="text-xl font-normal opacity-70">
                / {usd(data.dailyLimitUsd)}
              </span>
            </p>
            <div
              role="meter"
              aria-label="Daily AI budget used"
              aria-valuemin={0}
              aria-valuemax={data.dailyLimitUsd || 1}
              aria-valuenow={Math.min(
                data.spentTodayUsd,
                data.dailyLimitUsd || 1,
              )}
              aria-valuetext={`${usd(data.spentTodayUsd)} spent against ${usd(data.dailyLimitUsd)} daily ceiling`}
              className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <div
                className={`h-full rounded-full ${reached ? "bg-red-600" : "bg-indigo-600"}`}
                style={{
                  width: `${data.dailyLimitUsd > 0 ? Math.min(100, (100 * data.spentTodayUsd) / data.dailyLimitUsd) : 100}%`,
                }}
              />
            </div>
            {reached ? (
              <p role="alert" className="mt-4 font-semibold">
                Daily ceiling reached. The assistant stops answering when this
                limit is hit.
              </p>
            ) : (
              <p className="mt-4 text-sm">
                {usd(Math.max(0, data.dailyLimitUsd - data.spentTodayUsd))}{" "}
                remaining today. The assistant stops answering when the ceiling
                is reached.
              </p>
            )}
            <p className="mt-2 text-xs opacity-70">
              The ceiling is configured in the server environment. Today and
              daily dates follow the server&apos;s reporting clock. Use Refresh
              to check the latest spend.
            </p>
          </section>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Calls", integer(data.totals.calls)],
              ["Tokens", integer(data.totals.tokens)],
              ["Total cost", usd(data.totals.costUsd)],
              [
                "Average cost / call",
                costPerCall(data.totals.costUsd, data.totals.calls),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  {label}
                </dt>
                <dd className="mt-2 break-all text-xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </dd>
                <dd className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Last {days} days
                </dd>
              </div>
            ))}
          </dl>
          <section
            aria-labelledby="trend-title"
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <h2
              id="trend-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Daily spend
            </h2>
            {daily.length ? (
              <>
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>USD 0.00</span>
                  <span>Peak {usd(peakCost)}</span>
                </div>
                <svg
                  role="img"
                  aria-label="Daily spending trend. Exact dates, costs, calls and tokens are in the daily usage table below."
                  viewBox="0 0 800 180"
                  className="mt-2 h-44 w-full"
                  preserveAspectRatio="none"
                >
                  {daily.map((day, index) => {
                    const width = 800 / daily.length;
                    const height = (day.costUsd / maxCost) * 160;
                    return (
                      <rect
                        key={day.date}
                        x={index * width + width * 0.1}
                        y={170 - height}
                        width={width * 0.8}
                        height={height}
                        rx={Math.min(4, width * 0.1)}
                        className="fill-indigo-500"
                      >
                        <title>
                          {day.date}: {usd(day.costUsd)}
                        </title>
                      </rect>
                    );
                  })}
                </svg>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{daily[0].date}</span>
                  <span>{daily[daily.length - 1].date}</span>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  One bar per reported day. Unreported dates are not assumed to
                  have zero usage.
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No daily usage recorded for this period.
              </p>
            )}
          </section>
          <ResourceTable
            headingLevel={2}
            showCount={false}
            config={modelConfig}
            records={[...data.byModel].sort((a, b) => b.costUsd - a.costUsd)}
          />
          <ResourceTable
            headingLevel={2}
            showCount={false}
            config={dailyConfig}
            records={[...daily].reverse()}
          />
        </>
      )}
    </div>
  );
}
