"use client";
import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  healthApi,
  type VitalReading,
  type VitalType,
  type AbnormalFlag,
  type Member,
} from "@/api/healthRecord";
import { usePublicCopy } from "@/components/public/ProductLayout";
import {
  dateLabel,
  enteredReading,
  enumLabel,
  readableError,
  vitalDefinitions,
} from "./model";
import { RecordDialog } from "./RecordForms";
import { useResource } from "./useResource";
import styles from "./health.module.css";
export function Flag({ flag }: { flag: AbnormalFlag | null }) {
  const c = usePublicCopy();
  if (!flag)
    return (
      <span className={styles.muted}>
        {c("Not assessed", "Qiymətləndirilməyib")}
      </span>
    );
  return (
    <span
      className={`${styles.flag} ${flag.startsWith("CRITICAL") ? styles.critical : flag === "NORMAL" ? styles.normal : styles.abnormal}`}
    >
      {enumLabel(flag, c)}
    </span>
  );
}
export function VitalForm({
  member,
  initialType,
  onClose,
  onSaved,
}: {
  member: Member;
  initialType: VitalType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = usePublicCopy();
  const [type, setType] = useState<VitalType>(
    initialType === "BMI" ? "WEIGHT" : initialType,
  );
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState(vitalDefinitions[type].unit);
  const [measuredAt, setMeasuredAt] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  return (
    <RecordDialog
      title={c("Add a measurement", "Ölçü əlavə et")}
      onClose={onClose}
      busy={busy}
    >
      <p className={styles.formPerson}>{member.fullName}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          try {
            await healthApi.addVital(member.id, {
              vitalType: type,
              value: Number(value),
              unit: unit.trim() || undefined,
              measuredAt: measuredAt || undefined,
              notes: notes.trim() || undefined,
            });
            onSaved();
          } catch (err) {
            setError(
              readableError(
                err,
                c(
                  "Could not save this measurement. Please try again.",
                  "Ölçünü saxlamaq mümkün olmadı. Yenidən cəhd edin.",
                ),
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <div className={styles.fields}>
            <label className={styles.wide} htmlFor={id + "type"}>
              {c("Measurement", "Ölçü")}
              <select
                id={id + "type"}
                value={type}
                onChange={(e) => {
                  const next = e.target.value as VitalType;
                  setType(next);
                  setUnit(vitalDefinitions[next].unit);
                  setValue("");
                }}
              >
                {(Object.keys(vitalDefinitions) as VitalType[])
                  .filter((key) => key !== "BMI")
                  .map((key) => (
                    <option key={key} value={key}>
                      {c(...vitalDefinitions[key].label)}
                    </option>
                  ))}
              </select>
            </label>
            <label htmlFor={id + "value"}>
              {c("Value", "Dəyər")}
              <input
                id={id + "value"}
                type="number"
                step="any"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <label htmlFor={id + "unit"}>
              {c("Unit", "Vahid")}
              <input
                id={id + "unit"}
                list={id + "units"}
                value={unit}
                required
                onChange={(e) => setUnit(e.target.value)}
              />
              <datalist id={id + "units"}>
                {vitalDefinitions[type].units.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>
            <label className={styles.wide} htmlFor={id + "date"}>
              {c(
                "Measured at (leave blank for now)",
                "Ölçmə vaxtı (cari vaxt üçün boş saxlayın)",
              )}
              <input
                id={id + "date"}
                type="datetime-local"
                value={measuredAt}
                onChange={(e) => setMeasuredAt(e.target.value)}
              />
            </label>
            <label className={styles.wide} htmlFor={id + "notes"}>
              {c("Notes", "Qeydlər")}
              <textarea
                id={id + "notes"}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>
        </fieldset>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <p className={styles.helper}>
          {c(
            "Your value and chosen unit will be shown in the record.",
            "Nəticə yazdığınız rəqəm və seçdiyiniz ölçü vahidi ilə göstəriləcək.",
          )}
        </p>
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={onClose}
            disabled={busy}
          >
            {c("Cancel", "Ləğv et")}
          </button>
          <button className="public-button" disabled={busy}>
            {busy
              ? c("Saving...", "Saxlanılır...")
              : c("Save measurement", "Ölçünü saxla")}
          </button>
        </div>
      </form>
    </RecordDialog>
  );
}
function HistoryChart({
  readings,
  type,
}: {
  readings: VitalReading[];
  type: VitalType;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const id = useId();
  const ordered = useMemo(
    () =>
      [...readings]
        .filter(
          (r) =>
            Number.isFinite(Number(enteredReading(r).value)) &&
            !Number.isNaN(new Date(r.measuredAt).getTime()),
        )
        .sort(
          (a, b) =>
            new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime(),
        ),
    [readings],
  );
  const units = Array.from(new Set(ordered.map((r) => enteredReading(r).unit)));
  const [chosenUnit, setUnit] = useState<string | null>(null);
  const unit =
    chosenUnit && units.includes(chosenUnit)
      ? chosenUnit
      : ordered.length
        ? enteredReading(ordered[ordered.length - 1]).unit
        : undefined;
  const filtered = ordered.filter((r) => enteredReading(r).unit === unit);
  const [selected, setSelected] = useState<number | null>(null);
  const active = filtered.find((r) => r.id === selected) ?? filtered.at(-1);
  if (!filtered.length)
    return (
      <div className={styles.empty}>
        {c("No measurements recorded yet.", "Hələ ölçü qeydə alınmayıb.")}
      </div>
    );
  const values = filtered.map((r) => Number(enteredReading(r).value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.2, Math.abs(max) * 0.02, 0.1);
  const low = min - padding;
  const high = max + padding;
  const times = filtered.map((r) => new Date(r.measuredAt).getTime());
  const start = times[0];
  const end = times.at(-1)!;
  const x = (time: number) =>
    end === start ? 330 : 64 + ((time - start) / (end - start)) * 550;
  const y = (value: number) => 210 - ((value - low) / (high - low)) * 160;
  return (
    <div className={styles.chart}>
      <div className={styles.chartToolbar}>
        <div>
          <p className={styles.eyebrow}>
            {c("Measurement history", "Ölçü tarixçəsi")}
          </p>
          <h3>{c(...vitalDefinitions[type].label)}</h3>
        </div>
        {units.length > 1 && (
          <label htmlFor={id + "unit"}>
            {c("Show entered unit", "Ölçü vahidi")}
            <select
              id={id + "unit"}
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                setSelected(null);
              }}
            >
              {units.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <p className={styles.helper}>
        {c(
          "Readings are plotted in their entered units. Different units are shown separately.",
          "Ölçülər daxil edilmiş vahidlərlə göstərilir. Fərqli vahidlər ayrı göstərilir.",
        )}
      </p>
      <svg viewBox="0 0 650 260" role="group" aria-labelledby={id + "title"}>
        <title id={id + "title"}>
          {c(...vitalDefinitions[type].label)} · {unit}.{" "}
          {c(
            "Select a point for details; all readings are in the table below.",
            "Təfərrüatlar üçün nöqtəni seçin; bütün ölçülər aşağıdakı cədvəldədir.",
          )}
        </title>
        {[0, 0.5, 1].map((f) => {
          const value = low + (high - low) * f;
          return (
            <g key={f}>
              <line
                x1="64"
                x2="614"
                y1={y(value)}
                y2={y(value)}
                stroke="#dce1da"
              />
              <text
                x="54"
                y={y(value) + 4}
                textAnchor="end"
                fill="#5d6b70"
                fontSize="11"
              >
                {Number(value.toFixed(1))}
              </text>
            </g>
          );
        })}
        {filtered.length > 1 && (
          <polyline
            points={filtered
              .map(
                (r) =>
                  `${x(new Date(r.measuredAt).getTime())},${y(Number(enteredReading(r).value))}`,
              )
              .join(" ")}
            fill="none"
            stroke="#214be2"
            strokeWidth="2.5"
          />
        )}
        {filtered.map((r) => (
          <circle
            key={r.id}
            cx={x(new Date(r.measuredAt).getTime())}
            cy={y(Number(enteredReading(r).value))}
            r={active?.id === r.id ? 7 : 5}
            fill={
              r.abnormalFlag && r.abnormalFlag !== "NORMAL"
                ? "#a43c2c"
                : "#214be2"
            }
            stroke="white"
            strokeWidth="2"
            tabIndex={0}
            role="button"
            aria-label={`${dateLabel(r.measuredAt, i18n.language)}: ${enteredReading(r).value} ${unit}, ${enumLabel(r.abnormalFlag, c)}`}
            onFocus={() => setSelected(r.id)}
            onClick={() => setSelected(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(r.id);
              }
            }}
          />
        ))}
        <text x="64" y="240" fill="#5d6b70" fontSize="11">
          {dateLabel(filtered[0].measuredAt, i18n.language)}
        </text>
        <text x="614" y="240" textAnchor="end" fill="#5d6b70" fontSize="11">
          {dateLabel(filtered.at(-1)!.measuredAt, i18n.language)}
        </text>
        <text x="64" y="25" fill="#5d6b70" fontSize="12">
          {unit}
        </text>
      </svg>
      {active && (
        <div className={styles.selectedReading} aria-live="polite">
          <span>{dateLabel(active.measuredAt, i18n.language)}</span>
          <strong>
            {enteredReading(active).value} {enteredReading(active).unit}
          </strong>
          <Flag flag={active.abnormalFlag} />
        </div>
      )}
    </div>
  );
}
export default function Vitals({
  member,
  write,
  version,
  onChanged,
  initialType = "WEIGHT",
}: {
  member: Member;
  write: boolean;
  version: number;
  onChanged: () => void;
  initialType?: VitalType;
}) {
  const c = usePublicCopy();
  const { i18n } = useTranslation();
  const [type, setType] = useState<VitalType>(initialType);
  const [windowDays, setWindow] = useState(90);
  const [adding, setAdding] = useState(false);
  const [retry, setRetry] = useState(0);
  const fallback = c(
    "Could not load measurements. Please try again.",
    "Ölçüləri yükləmək mümkün olmadı. Yenidən cəhd edin.",
  );
  const series = useResource(
    `${member.id}.${type}.${version}.${retry}`,
    (signal) => healthApi.series(member.id, type, signal),
    fallback,
  );
  const trends = useResource(
    `${member.id}.${windowDays}.${version}.${retry}`,
    (signal) => healthApi.trends(member.id, windowDays, signal),
    fallback,
  );
  const trend = trends.data?.find((item) => item.type === type);
  const DirectionIcon =
    trend?.direction === "RISING"
      ? ArrowUpRight
      : trend?.direction === "FALLING"
        ? ArrowDownRight
        : Minus;
  return (
    <section>
      <div className={styles.sectionToolbar}>
        <div>
          <h2>
            {c("Vitals & measurements", "Həyati göstəricilər və ölçülər")}
          </h2>
          <p>
            {c(
              "Your measurements, with the units you entered.",
              "Ölçüləri qeyd edin və zamanla necə dəyişdiyinə baxın.",
            )}
          </p>
        </div>
        {write && (
          <button className="public-button" onClick={() => setAdding(true)}>
            <Plus size={17} />
            {c("Add measurement", "Ölçü əlavə et")}
          </button>
        )}
      </div>
      <div className={styles.vitalFilters}>
        <label htmlFor="vital-type">
          {c("Measurement", "Ölçü")}
          <select
            id="vital-type"
            value={type}
            onChange={(e) => setType(e.target.value as VitalType)}
          >
            {(Object.keys(vitalDefinitions) as VitalType[]).map((key) => (
              <option key={key} value={key}>
                {c(...vitalDefinitions[key].label)}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="trend-window">
          {c("Trend window", "Müqayisə dövrü")}
          <select
            id="trend-window"
            value={windowDays}
            onChange={(e) => setWindow(Number(e.target.value))}
          >
            {[30, 90, 180, 365].map((days) => (
              <option value={days} key={days}>
                {days} {c("days", "gün")}
              </option>
            ))}
          </select>
        </label>
      </div>
      {type === "BMI" && (
        <p className={styles.helper}>
          {c(
            "BMI is calculated by the backend from recorded height and weight.",
            "Bədən kütlə indeksi qeydə alınmış boy və çəki əsasında hesablanır.",
          )}
        </p>
      )}
      {trends.error ? (
        <p className={styles.error} role="alert">
          {trends.error}
          <button onClick={() => setRetry((n) => n + 1)}>
            {c("Retry", "Yenidən cəhd et")}
          </button>
        </p>
      ) : (
        <div className={styles.trend}>
          <DirectionIcon size={24} />
          {trends.loading ? (
            <span>{c("Loading trend...", "Tendensiya yüklənir...")}</span>
          ) : trend ? (
            <>
              <strong>
                {enumLabel(trend.direction, c)} ·{" "}
                {Number(trend.changePercent) > 0 ? "+" : ""}
                {trend.changePercent}%
              </strong>
              <span>
                {trend.readings} {c("readings", "ölçü")} · {windowDays}{" "}
                {c("days", "gün")}
              </span>
            </>
          ) : (
            <span>
              {c(
                "A trend needs at least two readings in this period.",
                "Dəyişikliyi hesablamaq üçün seçilmiş dövrdə ən azı iki ölçü olmalıdır.",
              )}
            </span>
          )}
        </div>
      )}
      {series.loading ? (
        <p className={styles.loading} role="status">
          {c("Loading measurements...", "Ölçülər yüklənir...")}
        </p>
      ) : series.error ? (
        <div role="alert" className={styles.error}>
          {series.error}
          <button onClick={() => setRetry((n) => n + 1)}>
            {c("Retry", "Yenidən cəhd et")}
          </button>
        </div>
      ) : (
        <>
          <HistoryChart key={type} readings={series.data ?? []} type={type} />
          {!!series.data?.length && (
            <div className={styles.tableWrap}>
              <table>
                <caption>
                  {c("All entered readings", "Bütün daxil edilmiş ölçülər")}
                </caption>
                <thead>
                  <tr>
                    <th>{c("Measured at", "Ölçmə vaxtı")}</th>
                    <th>{c("Value", "Dəyər")}</th>
                    <th>{c("Status", "Status")}</th>
                    <th>{c("Notes", "Qeydlər")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...(series.data ?? [])]
                    .sort(
                      (a, b) =>
                        new Date(b.measuredAt).getTime() -
                        new Date(a.measuredAt).getTime(),
                    )
                    .map((r) => (
                      <tr key={r.id}>
                        <td>
                          {dateLabel(r.measuredAt, i18n.language)}
                          <small>
                            {new Date(r.measuredAt).toLocaleTimeString(
                              i18n.language,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </small>
                        </td>
                        <td>
                          <strong>{enteredReading(r).value}</strong>{" "}
                          {enteredReading(r).unit}
                        </td>
                        <td>
                          <Flag flag={r.abnormalFlag} />
                        </td>
                        <td>{r.notes || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {adding && (
        <VitalForm
          member={member}
          initialType={type}
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            onChanged();
          }}
        />
      )}
    </section>
  );
}
