import React, { useState } from "react";
import { useHealthSyncRevision } from "../health/HealthSyncContext";
import { View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useFamily } from "../core/Session";
import { useResource } from "../core/useResource";
import {
  healthApi,
  type RecordKind,
  type ClinicalEntry,
  type RecordValue,
  type VitalType,
} from "../api/healthRecord";
import {
  canWrite,
  recordDefinitions,
  vitalDefinitions,
  enteredReading,
  enumLabel,
  type Field,
} from "../api/recordModel";
import { memberFields, birthFields } from "../api/memberFields";
import { shortDate } from "../utils/dates";
import { openPrivateFile } from "../core/files";
import {
  Body,
  Title,
  Heading,
  Page,
  Button,
  MemberPicker,
  SignedIn,
  Notice,
  LoadState,
  Form,
  Confirm,
  Select,
  LinkRow,
  styles,
} from "../ui/kit";
import Documents from "./Documents";
import { ReadingChart } from "../ui/ReadingChart";
const kinds = Object.keys(recordDefinitions) as RecordKind[];
export default function Records() {
  return (
    <Page>
      <SignedIn>
        <Workspace />
      </SignedIn>
    </Page>
  );
}
function Workspace() {
  const { c } = useCopy(),
    f = useFamily(),
    nav = useNavigation<any>();
  const [tab, setTab] = useState("overview"),
    [memberForm, setMemberForm] = useState<"add" | "edit" | null>(null),
    [remove, setRemove] = useState(false),
    [familyId, setFamilyId] = useState("");
  const writable = f.families.filter((f) => canWrite(f.role));
  const choices = [
    ["overview", c("Overview", "Ümumi baxış", "Обзор")],
    ...kinds.map((k) => [k, c(...recordDefinitions[k].label)]),
    ["documents", c("Documents", "Sənədlər", "Документы")],
    ["labs", c("Lab results", "Analiz nəticələri", "Результаты анализов")],
    [
      "prescriptions",
      c("Prescription review", "Resept yoxlaması", "Проверка рецептов"),
    ],
    ["vitals", c("Vitals", "Ölçmələr", "Показатели")],
    ["timeline", c("Timeline", "Hadisələr", "Хронология")],
    ["history", c("History", "Dəyişiklik tarixçəsi", "История изменений")],
  ];
  return (
    <>
      <Title>
        {c("Health records", "Sağlamlıq qeydləri", "Медицинские записи")}
      </Title>
      <MemberPicker allowNone={false} />
      <LinkRow
        title={c(
          "Connected sources",
          "Qoşulmuş mənbələr",
          "Подключенные источники",
        )}
        icon="watch-outline"
        onPress={() => nav.navigate("ConnectedSources")}
      />
      {writable.length > 0 && (
        <Button
          secondary
          label={c(
            "Add a family member",
            "Ailə üzvü əlavə et",
            "Добавить члена семьи",
          )}
          onPress={() => {
            setFamilyId(String(writable[0].id));
            setMemberForm("add");
          }}
        />
      )}
      {f.member && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {choices.map(([key, label]) => (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === key }}
                key={key}
                onPress={() => setTab(key)}
                style={[
                  styles.chip,
                  tab === key && { backgroundColor: "#cedcc8" },
                ]}
              >
                <Body small>{label}</Body>
              </Pressable>
            ))}
          </ScrollView>
          {!canWrite(f.role) && (
            <Notice>
              {c(
                "Read-only access",
                "Yalnız baxış icazəsi",
                "Доступ только для чтения",
              )}
            </Notice>
          )}
          <View key={`${f.member.id}:${tab}`} style={{ gap: 20 }}>
            {tab === "overview" ? (
              <>
                <Overview />
                {canWrite(f.role) && (
                  <>
                    <Button
                      secondary
                      label={c(
                        "Edit member",
                        "Üzvü redaktə et",
                        "Изменить данные",
                      )}
                      onPress={() => setMemberForm("edit")}
                    />
                    <Button
                      secondary
                      label={c(
                        "Delete member",
                        "Üzvü sil",
                        "Удалить члена семьи",
                      )}
                      onPress={() => setRemove(true)}
                    />
                  </>
                )}
              </>
            ) : kinds.includes(tab as RecordKind) ? (
              <Clinical kind={tab as RecordKind} />
            ) : tab === "vitals" ? (
              <Vitals />
            ) : tab === "timeline" ? (
              <Timeline />
            ) : tab === "history" ? (
              <History />
            ) : (
              <Documents
                section={tab as "documents" | "labs" | "prescriptions"}
              />
            )}
          </View>
        </>
      )}
      {memberForm && (
        <>
          <Form
            before={
              memberForm === "add" &&
              writable.length > 1 && (
                <Select
                  label={c("Family", "Ailə", "Семья")}
                  value={familyId}
                  options={writable.map((f) => ({
                    value: String(f.id),
                    label: f.name,
                  }))}
                  onChange={setFamilyId}
                />
              )
            }
            title={
              memberForm === "add"
                ? c(
                    "Add a family member",
                    "Ailə üzvü əlavə et",
                    "Добавить члена семьи",
                  )
                : c("Edit member", "Üzvü redaktə et", "Изменить данные")
            }
            fields={[...memberFields, ...birthFields]}
            initial={
              memberForm === "edit"
                ? (f.member as unknown as Record<string, RecordValue>)
                : undefined
            }
            onClose={() => setMemberForm(null)}
            onSave={async (body) => {
              if (memberForm === "edit" && f.member && canWrite(f.role))
                await healthApi.updateMember(f.member.id, body);
              else if (writable.some((f) => String(f.id) === familyId))
                await healthApi.addMember(Number(familyId), body);
              setMemberForm(null);
              f.reload();
            }}
          />
        </>
      )}
      {remove && f.member && (
        <Confirm
          title={c("Delete member", "Üzvü sil", "Удалить члена семьи")}
          message={c(
            `Delete ${f.member.fullName} and their record? This cannot be undone.`,
            `${f.member.fullName} və onun qeydləri silinsin? Bu əməliyyat geri qaytarılmır.`,
            `Удалить ${f.member.fullName} и медицинские записи? Это необратимо.`,
          )}
          onClose={() => setRemove(false)}
          onConfirm={async () => {
            if (!f.member || !canWrite(f.role)) return;
            await healthApi.deleteMember(f.member.id);
            setRemove(false);
            f.select(null);
            f.reload();
          }}
        />
      )}
    </>
  );
}
function Overview() {
  const { c } = useCopy(),
    { member } = useFamily(),
    nav = useNavigation<any>();
  const syncRevision = useHealthSyncRevision(member!.id);
  const latest = useResource(`latest:${member!.id}:${syncRevision}`, (s) =>
    healthApi.latest(member!.id, s),
  );
  const allergies = useResource(`allergies:${member!.id}`, (s) =>
    healthApi.list(member!.id, "allergies", s),
  );
  return (
    <>
      <Heading>{member!.fullName}</Heading>
      <Body>
        {c("Age", "Yaş", "Возраст")}: {member!.ageYears ?? "-"} |{" "}
        {c("Blood type", "Qan qrupu", "Группа крови")}:{" "}
        {member!.bloodType || "-"}
      </Body>
      {member!.minor && member!.correctedAgeMonths != null && (
        <Body>
          {c(
            "Corrected age (months)",
            "Düzəldilmiş yaş (ay)",
            "Скорректированный возраст (мес.)",
          )}
          : {member!.correctedAgeMonths}
        </Body>
      )}
      <LoadState resource={allergies} />
      {allergies.data
        ?.filter((a) => a.critical === true)
        .map((a) => (
          <Notice key={a.id} danger>
            {c(
              "Life-threatening allergy",
              "Həyati təhlükəli allergiya",
              "Аллергия с угрозой для жизни",
            )}
            : {String(a.allergen)}
          </Notice>
        ))}
      <Button
        label={c(
          "Ask about this member",
          "Bu şəxs haqqında sual ver",
          "Задать вопрос об этом человеке",
        )}
        onPress={() => nav.navigate("Chat")}
      />
      <LoadState resource={latest} />
      {latest.data &&
        Object.values(latest.data).map(
          (v) =>
            v && (
              <View style={styles.line} key={v.id}>
                <Heading>{c(...vitalDefinitions[v.vitalType].label)}</Heading>
                <Body>
                  {enteredReading(v).value} {enteredReading(v).unit}
                </Body>
                {v.abnormalFlag && v.abnormalFlag !== "NORMAL" && (
                  <Notice danger>{enumLabel(v.abnormalFlag, c)}</Notice>
                )}
              </View>
            ),
        )}
      <Button
        secondary
        label={c(
          "Share doctor summary (PDF)",
          "Həkim üçün xülasə (PDF)",
          "Поделиться сводкой для врача (PDF)",
        )}
        onPress={() =>
          openPrivateFile(
            `/members/${member!.id}/summary.pdf`,
            "azdoc-summary.pdf",
          )
        }
      />
    </>
  );
}
function Clinical({ kind }: { kind: RecordKind }) {
  const { c, language } = useCopy(),
    f = useFamily(),
    def = recordDefinitions[kind];
  const resource = useResource(`${f.member!.id}:${kind}`, (s) =>
    healthApi.list(f.member!.id, kind, s),
  );
  const [editing, setEditing] = useState<ClinicalEntry | true | null>(null),
    [remove, setRemove] = useState<ClinicalEntry | null>(null);
  return (
    <>
      <Heading>{c(...def.label)}</Heading>
      {canWrite(f.role) && (
        <Button
          label={c("Add", "Əlavə et", "Добавить")}
          onPress={() => setEditing(true)}
        />
      )}
      <LoadState resource={resource} />
      {resource.data?.length === 0 && (
        <Body>
          {c("No entries yet.", "Hələ qeyd yoxdur.", "Записей пока нет.")}
        </Body>
      )}
      {resource.data?.map((row) => (
        <View key={row.id} style={styles.card}>
          <Heading>{String(row[def.titleKey] || "-")}</Heading>
          {(row.critical === true || row.severity === "LIFE_THREATENING") && (
            <Notice danger>
              {c("Life-threatening", "Həyati təhlükəli", "Угроза для жизни")}
            </Notice>
          )}
          {def.fields
            .filter(
              (field) =>
                field.key !== def.titleKey &&
                row[field.key] !== null &&
                row[field.key] !== undefined &&
                row[field.key] !== "",
            )
            .map((field) => (
              <Body small key={field.key}>
                {c(...field.label)}:{" "}
                {field.type === "date"
                  ? shortDate(String(row[field.key]), language)
                  : field.type === "select"
                    ? enumLabel(String(row[field.key]), c)
                    : typeof row[field.key] === "boolean"
                      ? row[field.key]
                        ? c("Yes", "Bəli", "Да")
                        : c("No", "Xeyr", "Нет")
                      : String(row[field.key])}
              </Body>
            ))}
          {canWrite(f.role) && (
            <View style={styles.row}>
              <Button
                secondary
                label={c("Edit", "Redaktə et", "Изменить")}
                onPress={() => setEditing(row)}
              />
              <Button
                secondary
                label={c("Delete", "Sil", "Удалить")}
                onPress={() => setRemove(row)}
              />
            </View>
          )}
        </View>
      ))}
      {editing && (
        <Form
          title={c(...def.label)}
          fields={def.fields}
          initial={editing === true ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={async (body) => {
            if (!canWrite(f.role)) return;
            await healthApi.save(
              f.member!.id,
              kind,
              body,
              editing === true ? undefined : editing.id,
            );
            setEditing(null);
            resource.retry();
          }}
        />
      )}
      {remove && (
        <Confirm
          title={c("Delete entry", "Qeydi sil", "Удалить запись")}
          message={c(
            "Delete this entry from the record?",
            "Bu qeyd silinsin?",
            "Удалить эту запись?",
          )}
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            if (!canWrite(f.role)) return;
            await healthApi.remove(f.member!.id, kind, remove.id);
            setRemove(null);
            resource.retry();
          }}
        />
      )}
    </>
  );
}
function Vitals() {
  const { c, language } = useCopy(),
    f = useFamily();
  const [type, setType] = useState<VitalType>("WEIGHT"),
    [add, setAdd] = useState(false);
  const syncRevision = useHealthSyncRevision(f.member!.id);
  const rows = useResource(
    `series:${f.member!.id}:${type}:${syncRevision}`,
    (s) => healthApi.series(f.member!.id, type, s),
  );
  const trends = useResource(
    `trends:${f.member!.id}:${type}:${syncRevision}`,
    (s) => healthApi.trends(f.member!.id, 90, s),
  );
  const trend = trends.data?.find((t) => t.type === type);
  const units = [
    ...new Set(rows.data?.map((r) => enteredReading(r).unit) || []),
  ];
  const fields: Field[] = [
    {
      key: "value",
      label: ["Value", "Göstərici"],
      type: "number",
      required: true,
    },
    {
      key: "unit",
      label: ["Unit", "Vahid"],
      default: vitalDefinitions[type].unit,
      required: true,
    },
    { key: "notes", label: ["Notes", "Qeydlər"], type: "textarea" },
  ];
  return (
    <>
      <Select
        label={c("Measurement", "Ölçmə", "Показатель")}
        value={type}
        options={Object.entries(vitalDefinitions).map(([value, d]) => ({
          value,
          label: c(...d.label),
        }))}
        onChange={(v) => setType(v as VitalType)}
      />
      {canWrite(f.role) && (
        <Button
          label={c("Add reading", "Ölçmə əlavə et", "Добавить измерение")}
          onPress={() => setAdd(true)}
        />
      )}
      <LoadState resource={rows} />
      <LoadState resource={trends} />
      {trend && (
        <Notice>
          {enumLabel(trend.direction, c)}: {trend.changePercent.toFixed(1)}%
        </Notice>
      )}
      {units.map((unit) => (
        <ReadingChart
          key={unit}
          label={`${c(...vitalDefinitions[type].label)} (${unit})`}
          rows={(rows.data || [])
            .filter((r) => enteredReading(r).unit === unit)
            .map((r) => ({
              value: enteredReading(r).value,
              date: r.measuredAt,
            }))}
        />
      ))}
      {rows.data?.length === 0 && (
        <Body>
          {c("No readings yet.", "Hələ ölçmə yoxdur.", "Измерений пока нет.")}
        </Body>
      )}
      {rows.data?.map((r) => (
        <View key={r.id} style={styles.line}>
          <Heading>
            {enteredReading(r).value} {enteredReading(r).unit}
          </Heading>
          <Body small>{shortDate(r.measuredAt, language)}</Body>
          {r.abnormalFlag && r.abnormalFlag !== "NORMAL" && (
            <Notice danger>{enumLabel(r.abnormalFlag, c)}</Notice>
          )}
        </View>
      ))}
      {add && (
        <Form
          title={c("Add reading", "Ölçmə əlavə et", "Добавить измерение")}
          fields={fields}
          onClose={() => setAdd(false)}
          onSave={async (v) => {
            if (!canWrite(f.role)) return;
            await healthApi.addVital(f.member!.id, {
              vitalType: type,
              value: Number(v.value),
              unit: String(v.unit),
              notes: v.notes ? String(v.notes) : undefined,
            });
            setAdd(false);
            rows.retry();
            trends.retry();
          }}
        />
      )}
    </>
  );
}
function Timeline() {
  const { c, language } = useCopy(),
    { member } = useFamily();
  const syncRevision = useHealthSyncRevision(member!.id);
  const r = useResource(`timeline:${member!.id}:${syncRevision}`, (s) =>
    healthApi.timeline(member!.id, s),
  );
  return (
    <>
      <Heading>
        {c("Clinical timeline", "Sağlamlıq hadisələri", "Хронология здоровья")}
      </Heading>
      <Body small>
        {c(
          "Clinical dates, newest first. Only abnormal vital readings appear here.",
          "Hadisələr baş verdiyi tarixə görə sıralanır. Ölçmələrdən yalnız normadan kənar olanlar göstərilir.",
          "По дате события, сначала новые. Здесь отображаются только отклонения показателей.",
        )}
      </Body>
      <LoadState resource={r} />
      {r.data?.length === 0 && (
        <Body>
          {c("No events yet.", "Hələ hadisə yoxdur.", "Событий пока нет.")}
        </Body>
      )}
      {r.data?.map((e, i) => (
        <View
          key={`${e.type}:${e.recordId}:${i}`}
          style={[styles.line, e.notable && styles.danger]}
        >
          <Heading>{e.title}</Heading>
          <Body>{e.detail || "-"}</Body>
          <Body small>
            {e.type === "MEDICATION_STOPPED"
              ? c(
                  "Medication stopped",
                  "Dərman qəbulu dayandırılıb",
                  "Прием прекращен",
                )
              : e.type === "MEDICATION_STARTED"
                ? c(
                    "Medication started",
                    "Dərman qəbulu başlayıb",
                    "Прием начат",
                  )
                : enumLabel(e.type, c)}
            {e.occurredAt ? " - " + shortDate(e.occurredAt, language) : ""}
          </Body>
        </View>
      ))}
    </>
  );
}
function History() {
  const { c, language } = useCopy(),
    { member } = useFamily();
  const syncRevision = useHealthSyncRevision(member!.id);
  const r = useResource(`history:${member!.id}:${syncRevision}`, (s) =>
    healthApi.history(member!.id, s),
  );
  return (
    <>
      <Heading>
        {c("Change history", "Dəyişiklik tarixçəsi", "История изменений")}
      </Heading>
      <LoadState resource={r} />
      {r.data?.length === 0 && (
        <Body>
          {c(
            "No changes recorded.",
            "Hələ dəyişiklik qeydə alınmayıb.",
            "Изменений пока нет.",
          )}
        </Body>
      )}
      {r.data?.map((row) => (
        <View style={styles.line} key={row.id}>
          <Heading>
            {enumLabel(row.action, c)} - {enumLabel(row.recordType, c)}
          </Heading>
          <Body small>
            {row.changedByName || "-"} - {shortDate(row.createdAt, language)}
          </Body>
        </View>
      ))}
    </>
  );
}
