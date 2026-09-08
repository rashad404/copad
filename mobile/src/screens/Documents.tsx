import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useFamily } from "../core/Session";
import { useResource } from "../core/useResource";
import { fileBody, openPrivateFile, pickFile } from "../core/files";
import {
  documentsApi,
  type DocumentType,
  type MemberDocument,
  type LabResult,
  type ProposedMedication,
} from "../api/documents";
import { canWrite, enumLabel, type Field } from "../api/recordModel";
import { shortDate } from "../utils/dates";
import {
  Body,
  Heading,
  Button,
  Notice,
  LoadState,
  Form,
  Confirm,
  Select,
  Input,
  styles,
} from "../ui/kit";
import { DateField } from "../ui/DateField";
import { calendarDate } from "../core/validation";
import { ReadingChart } from "../ui/ReadingChart";
const labFields: Field[] = [
  { key: "analyte", label: ["Analyte", "Analizin adı"], required: true },
  { key: "value", label: ["Numeric value", "Rəqəmlə nəticə"], type: "number" },
  {
    key: "valueText",
    label: ["Text result (e.g. negative)", "Sözlə nəticə (məs. neqativ)"],
  },
  { key: "unit", label: ["Unit", "Vahid"] },
  {
    key: "referenceLow",
    label: [
      "Reference lower bound (optional)",
      "Normanın aşağı həddi (istəyə bağlı)",
    ],
    type: "number",
  },
  {
    key: "referenceHigh",
    label: [
      "Reference upper bound (optional)",
      "Normanın yuxarı həddi (istəyə bağlı)",
    ],
    type: "number",
  },
  {
    key: "referenceLabel",
    label: ["Reference range as printed", "Sənəddəki norma aralığı"],
  },
  {
    key: "collectedAt",
    label: ["Collection date", "Nümunənin götürülmə tarixi"],
    type: "date",
  },
];
const reviewLabFields = labFields.filter((f) =>
  ["analyte", "value", "unit", "collectedAt"].includes(f.key),
);
const prescriptionFields: Field[] = [
  { key: "name", label: ["Medication name", "Dərmanın adı"] },
  {
    key: "doseAmount",
    label: ["Dose amount", "Doza miqdarı"],
    type: "number",
    min: 0,
  },
  { key: "doseUnit", label: ["Dose unit", "Doza vahidi"] },
  { key: "frequency", label: ["Frequency", "Qəbul tezliyi"] },
  { key: "route", label: ["Route", "Qəbul yolu"] },
  { key: "startedOn", label: ["Start date", "Başlama tarixi"], type: "date" },
  { key: "endedOn", label: ["End date", "Bitmə tarixi"], type: "date" },
];
export default function Documents({
  section,
}: {
  section: "documents" | "labs" | "prescriptions";
}) {
  const f = useFamily();
  return (
    <View key={`${f.member!.id}:${section}`} style={{ gap: 20 }}>
      {section === "documents" ? (
        <DocumentList />
      ) : section === "labs" ? (
        <LabResults />
      ) : (
        <Prescriptions />
      )}
    </View>
  );
}
function useManualForm(reload: () => void) {
  const { c } = useCopy(),
    f = useFamily();
  const [manual, setManual] = useState(false);
  const form = manual ? (
    <Form
      title={c(
        "Enter a lab result",
        "Analiz nəticəsi əlavə et",
        "Ввести результат анализа",
      )}
      fields={labFields}
      onClose={() => setManual(false)}
      onSave={async (body) => {
        if (!canWrite(f.role)) return;
        if (body.value == null && !body.valueText)
          throw Error(
            c(
              "Enter a number or a text result.",
              "Rəqəmlə və ya sözlə nəticəni daxil edin.",
              "Введите числовой или текстовый результат.",
            ),
          );
        if (
          body.referenceLow != null &&
          body.referenceHigh != null &&
          Number(body.referenceLow) > Number(body.referenceHigh)
        )
          throw Error(
            c(
              "Check the reference bounds.",
              "Norma hədlərini yoxlayın.",
              "Проверьте границы нормы.",
            ),
          );
        await documentsApi.createLab(f.member!.id, {
          analyte: String(body.analyte),
          value: body.value == null ? null : Number(body.value),
          valueText: body.valueText ? String(body.valueText) : null,
          unit: body.unit ? String(body.unit) : null,
          referenceLow:
            body.referenceLow == null ? null : Number(body.referenceLow),
          referenceHigh:
            body.referenceHigh == null ? null : Number(body.referenceHigh),
          referenceLabel: body.referenceLabel
            ? String(body.referenceLabel)
            : null,
          collectedAt: body.collectedAt ? `${body.collectedAt}T00:00:00` : null,
        });
        setManual(false);
        reload();
      }}
    />
  ) : null;
  return { form, open: () => setManual(true) };
}
function DocumentList() {
  const { c, language } = useCopy(),
    f = useFamily(),
    focused = useIsFocused();
  const resource = useResource(`docs:${f.member!.id}`, (s) =>
    documentsApi.list(f.member!.id, s),
  );
  const manual = useManualForm(resource.retry);
  const [type, setType] = useState<DocumentType>("LAB_RESULT"),
    [title, setTitle] = useState(""),
    [documentDate, setDocumentDate] = useState(""),
    [provider, setProvider] = useState(""),
    [progress, setProgress] = useState<number | null>(null),
    [remove, setRemove] = useState<MemberDocument | null>(null);
  useEffect(() => {
    if (
      !focused ||
      !resource.data?.some((d) =>
        ["PENDING", "PROCESSING"].includes(d.extractionStatus),
      )
    )
      return;
    const timer = setInterval(resource.retry, 8000);
    return () => clearInterval(timer);
  }, [resource.data, focused]);
  const types: [DocumentType, string][] = [
    ["LAB_RESULT", c("Lab result", "Analiz nəticəsi", "Результат анализа")],
    ["PRESCRIPTION", c("Prescription", "Resept", "Рецепт")],
    ["IMAGING", c("Imaging", "Görüntüləmə", "Исследование")],
    ["DISCHARGE_SUMMARY", c("Discharge summary", "Epikriz", "Выписка")],
    ["REFERRAL", c("Referral", "Göndəriş", "Направление")],
    ["VACCINATION", c("Vaccination", "Peyvənd", "Вакцинация")],
    ["INSURANCE", c("Insurance", "Sığorta", "Страховка")],
    ["OTHER", c("Other", "Digər", "Другое")],
  ];
  return (
    <>
      <Heading>{c("Documents", "Sənədlər", "Документы")}</Heading>
      {canWrite(f.role) && (
        <View style={styles.card}>
          <Select
            label={c("Document type", "Sənəd növü", "Тип документа")}
            value={type}
            options={types.map(([value, label]) => ({ value, label }))}
            onChange={(v) => setType(v as DocumentType)}
          />
          <Input
            label={c(
              "Title (optional)",
              "Başlıq (istəyə bağlı)",
              "Название (необязательно)",
            )}
            value={title}
            onChangeText={setTitle}
          />
          <DateField
            label={c(
              "Document date (optional)",
              "Sənədin tarixi (istəyə bağlı)",
              "Дата документа (необязательно)",
            )}
            value={documentDate}
            onChange={setDocumentDate}
          />
          <Input
            label={c(
              "Provider (optional)",
              "Tibb müəssisəsi (istəyə bağlı)",
              "Медучреждение (необязательно)",
            )}
            value={provider}
            onChangeText={setProvider}
          />
          <Body small>
            {c(
              "Up to 25 MB. PDF, images, TXT, DOC or DOCX.",
              "25 MB-a qədər. PDF, şəkil, TXT, DOC və ya DOCX.",
              "До 25 МБ. PDF, изображения, TXT, DOC или DOCX.",
            )}
          </Body>
          <Button
            label={c(
              "Choose and upload file",
              "Fayl seç və yüklə",
              "Выбрать и загрузить файл",
            )}
            onPress={async () => {
              if (documentDate && !calendarDate(documentDate))
                throw Error(
                  c(
                    "Enter a valid date.",
                    "Düzgün tarix daxil edin.",
                    "Введите корректную дату.",
                  ),
                );
              const file = await pickFile();
              if (!file) return;
              const body = fileBody(file);
              body.append("documentType", type);
              if (title.trim()) body.append("title", title.trim());
              if (documentDate) body.append("documentDate", documentDate);
              if (provider.trim()) body.append("provider", provider.trim());
              setProgress(0);
              try {
                await documentsApi.upload(
                  f.member!.id,
                  body,
                  undefined,
                  setProgress,
                );
                setTitle("");
                resource.retry();
              } finally {
                setProgress(null);
              }
            }}
          />
          {progress !== null && (
            <Body>
              {c("Uploading", "Yüklənir", "Загрузка")}: {progress}%
            </Body>
          )}
          <Button
            secondary
            label={c(
              "Enter a result manually",
              "Nəticəni əl ilə daxil et",
              "Ввести результат вручную",
            )}
            onPress={manual.open}
          />
        </View>
      )}
      <LoadState resource={resource} />
      {resource.data?.length === 0 && (
        <Body>
          {c("No documents yet.", "Hələ sənəd yoxdur.", "Документов пока нет.")}
        </Body>
      )}
      {[...(resource.data || [])]
        .sort((a, b) =>
          (b.documentDate || b.createdAt).localeCompare(
            a.documentDate || a.createdAt,
          ),
        )
        .map((doc) => (
          <View key={doc.id} style={styles.card}>
            <Heading>
              {doc.title ||
                types.find((t) => t[0] === doc.documentType)?.[1] ||
                c("Document", "Sənəd", "Документ")}
            </Heading>
            <Body small>
              {shortDate(doc.documentDate || doc.createdAt, language)}
            </Body>
            {["PENDING", "PROCESSING"].includes(doc.extractionStatus) && (
              <Notice>
                {c(
                  "File saved. Reading its contents...",
                  "Fayl saxlanıldı. Məzmunu oxunur...",
                  "Файл сохранен. Читаем содержимое...",
                )}
              </Notice>
            )}
            {doc.extractionStatus === "SKIPPED" && (
              <Notice>
                {c(
                  "File saved, but no text could be read. You can enter the results manually.",
                  "Fayl saxlanıldı, amma mətn oxunmadı. Nəticələri əl ilə daxil edə bilərsiniz.",
                  "Файл сохранен, но текст прочитать не удалось. Результаты можно ввести вручную.",
                )}
              </Notice>
            )}
            {doc.extractionStatus === "FAILED" && (
              <Notice>
                {c(
                  "File saved. Automatic reading failed. You can enter results manually.",
                  "Fayl saxlanıldı. Avtomatik oxuma alınmadı. Nəticələri əl ilə daxil edə bilərsiniz.",
                  "Файл сохранен. Автоматическое чтение не удалось. Можно ввести результаты вручную.",
                )}
              </Notice>
            )}
            {doc.extractionStatus === "COMPLETED" && (
              <Body small>
                {c(
                  "Reading complete. Check extracted results before adding them to the record.",
                  "Oxuma tamamlandı. Çıxarılan nəticələri qeydlərə əlavə etməzdən əvvəl yoxlayın.",
                  "Чтение завершено. Проверьте извлеченные результаты перед добавлением в записи.",
                )}
              </Body>
            )}
            <Button
              secondary
              label={c(
                "Open / share file",
                "Faylı aç / paylaş",
                "Открыть / поделиться",
              )}
              onPress={() =>
                openPrivateFile(
                  `/members/${f.member!.id}/documents/${doc.id}/content`,
                  `${doc.id}.${doc.contentType?.includes("pdf") ? "pdf" : doc.contentType?.split("/")[1] || "bin"}`,
                )
              }
            />
            {canWrite(f.role) && (
              <>
                <Button
                  secondary
                  label={c("Delete", "Sil", "Удалить")}
                  onPress={() => setRemove(doc)}
                />
                {["SKIPPED", "FAILED"].includes(doc.extractionStatus) && (
                  <Button
                    secondary
                    label={c(
                      "Enter result manually",
                      "Nəticəni əl ilə daxil et",
                      "Ввести результат вручную",
                    )}
                    onPress={manual.open}
                  />
                )}
              </>
            )}
          </View>
        ))}
      {manual.form}
      {remove && (
        <Confirm
          title={c("Delete document", "Sənədi sil", "Удалить документ")}
          message={c(
            "The document file will be permanently deleted.",
            "Sənəd faylı birdəfəlik silinəcək.",
            "Файл документа будет удален навсегда.",
          )}
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            if (!canWrite(f.role)) return;
            await documentsApi.remove(f.member!.id, remove.id);
            setRemove(null);
            resource.retry();
          }}
        />
      )}
    </>
  );
}
function LabResults() {
  const { c, language } = useCopy(),
    f = useFamily();
  const rows = useResource(`labs:${f.member!.id}`, (s) =>
      documentsApi.labs(f.member!.id, s),
    ),
    pending = useResource(`pendinglabs:${f.member!.id}`, (s) =>
      documentsApi.pendingLabs(f.member!.id, s),
    );
  const manual = useManualForm(rows.retry);
  const [edit, setEdit] = useState<LabResult | null>(null),
    [reject, setReject] = useState<LabResult | null>(null),
    [analyte, setAnalyte] = useState("");
  const series = useResource(
    analyte ? `labseries:${f.member!.id}:${analyte}` : null,
    (s) => documentsApi.series(f.member!.id, analyte, s),
  );
  const reload = () => {
    rows.retry();
    pending.retry();
    series.retry();
  };
  const confirmed = rows.data?.filter((r) => r.confirmed) || [];
  return (
    <>
      <Heading>
        {c("Lab results", "Analiz nəticələri", "Результаты анализов")}
      </Heading>
      {canWrite(f.role) && (
        <Button
          label={c(
            "Enter a result manually",
            "Nəticəni əl ilə daxil et",
            "Ввести результат вручную",
          )}
          onPress={manual.open}
        />
      )}
      <LoadState resource={pending} />
      {!!pending.data?.length && (
        <Notice>
          {c(
            "These are extracted proposals, not confirmed health record data. Check each value and unit against the original.",
            "Bunlar sənəddən çıxarılmış təkliflərdir, təsdiqlənmiş sağlamlıq qeydləri deyil. Hər nəticəni və vahidi sənədlə tutuşdurun.",
            "Это извлеченные предложения, а не подтвержденные медицинские записи. Сверьте каждое значение и единицу с оригиналом.",
          )}
        </Notice>
      )}
      {pending.data?.map((row) => (
        <View key={row.id} style={[styles.card, { borderColor: "#c7a955" }]}>
          <Heading>{row.analyte}</Heading>
          <Body>
            {c("Awaiting review", "Yoxlama gözləyir", "Ожидает проверки")}:{" "}
            {row.displayValue ?? row.valueText ?? row.value ?? "-"}{" "}
            {row.unit || ""}
          </Body>
          <Body small>
            {c("Reference", "Norma", "Норма")}: {row.referenceLabel || "-"}
          </Body>
          {row.abnormalFlag && row.abnormalFlag !== "NORMAL" && (
            <Notice danger>{enumLabel(row.abnormalFlag, c)}</Notice>
          )}
          {row.documentId && (
            <Button
              secondary
              label={c("Original document", "Əsl sənəd", "Исходный документ")}
              onPress={() =>
                openPrivateFile(
                  `/members/${f.member!.id}/documents/${row.documentId}/content`,
                  `${row.documentId}.pdf`,
                )
              }
            />
          )}
          <Body small>
            {c(
              "Extracted from document",
              "Sənəddən çıxarılıb",
              "Извлечено из документа",
            )}
          </Body>
          {canWrite(f.role) && (
            <>
              <Button
                label={c(
                  "Accept value",
                  "Nəticəni qəbul et",
                  "Принять значение",
                )}
                onPress={async () => {
                  await documentsApi.confirmLab(f.member!.id, row.id, {});
                  reload();
                }}
              />
              <Button
                secondary
                label={c(
                  "Correct before accepting",
                  "Qəbul etməzdən əvvəl düzəlt",
                  "Исправить перед принятием",
                )}
                onPress={() => setEdit(row)}
              />
              <Button
                secondary
                label={c("Reject", "Rədd et", "Отклонить")}
                onPress={() => setReject(row)}
              />
            </>
          )}
        </View>
      ))}
      <Heading>
        {c(
          "Confirmed results",
          "Təsdiqlənmiş nəticələr",
          "Подтвержденные результаты",
        )}
      </Heading>
      <LoadState resource={rows} />
      {!rows.loading && !rows.error && !confirmed.length && (
        <Body>
          {c(
            "No confirmed results yet.",
            "Hələ təsdiqlənmiş nəticə yoxdur.",
            "Подтвержденных результатов пока нет.",
          )}
        </Body>
      )}
      {confirmed.map((row) => (
        <View key={row.id} style={styles.line}>
          <Heading>
            {row.analyte}:{" "}
            {row.displayValue ?? row.valueText ?? row.value ?? "-"}{" "}
            {row.unit || ""}
          </Heading>
          <Body small>
            {row.source === "MANUAL"
              ? c("Entered manually", "Əl ilə daxil edilib", "Введено вручную")
              : c(
                  "Extracted and confirmed",
                  "Sənəddən çıxarılıb və təsdiqlənib",
                  "Извлечено и подтверждено",
                )}
            {row.collectedAt
              ? " - " + shortDate(row.collectedAt, language)
              : ""}
          </Body>
          <Body small>
            {row.referenceLabel ||
              c(
                "No reference range recorded",
                "Norma aralığı qeyd edilməyib",
                "Референсный диапазон не указан",
              )}
          </Body>
          {row.abnormalFlag && row.abnormalFlag !== "NORMAL" && (
            <Notice danger>{enumLabel(row.abnormalFlag, c)}</Notice>
          )}
          <Button
            secondary
            label={c("View trend", "Dəyişməyə bax", "Динамика")}
            onPress={() => setAnalyte(row.analyteKey)}
          />
        </View>
      ))}
      {analyte && (
        <>
          <LoadState resource={series} />
          {[
            ...new Set(
              series.data
                ?.filter((r) => r.confirmed && r.value != null)
                .map((r) => r.unit || "") || [],
            ),
          ].map((unit) => {
            const matching = series.data!.filter(
              (r) => r.confirmed && r.value != null && (r.unit || "") === unit,
            );
            const sameRange = matching.every(
              (r) =>
                r.referenceLow === matching[0]?.referenceLow &&
                r.referenceHigh === matching[0]?.referenceHigh,
            );
            return (
              <ReadingChart
                key={unit}
                label={`${analyte} (${unit})`}
                low={sameRange ? matching[0]?.referenceLow : null}
                high={sameRange ? matching[0]?.referenceHigh : null}
                rows={matching.map((r) => ({
                  value: r.value!,
                  date: r.collectedAt || "",
                }))}
              />
            );
          })}
          {series.data
            ?.filter((r) => r.confirmed)
            .map((r) => (
              <Body small key={r.id}>
                {r.collectedAt ? shortDate(r.collectedAt, language) : "-"}:{" "}
                {r.displayValue ?? r.valueText ?? r.value} {r.unit || ""} -{" "}
                {r.source === "MANUAL"
                  ? c("Manual", "Əl ilə", "Вручную")
                  : c("Extracted", "Sənəddən", "Из документа")}
              </Body>
            ))}
        </>
      )}
      {manual.form}
      {edit && (
        <Form
          title={c(
            "Correct extracted result",
            "Çıxarılan nəticəni düzəlt",
            "Исправить извлеченный результат",
          )}
          fields={reviewLabFields}
          initial={{
            analyte: edit.analyte,
            value: edit.value,
            unit: edit.unit,
            collectedAt: edit.collectedAt?.slice(0, 10) || null,
          }}
          onClose={() => setEdit(null)}
          onSave={async (body) => {
            if (!canWrite(f.role)) return;
            await documentsApi.confirmLab(f.member!.id, edit.id, {
              analyte: String(body.analyte),
              ...(body.value == null ? {} : { value: Number(body.value) }),
              unit: body.unit ? String(body.unit) : null,
              collectedAt: body.collectedAt
                ? `${body.collectedAt}T00:00:00`
                : null,
            });
            setEdit(null);
            reload();
          }}
        />
      )}
      {reject && (
        <Confirm
          title={c(
            "Reject proposal",
            "Təklifi rədd et",
            "Отклонить предложение",
          )}
          message={c(
            "This value will not become part of the record.",
            "Bu nəticə sağlamlıq qeydlərinə əlavə edilməyəcək.",
            "Это значение не будет добавлено в медицинские записи.",
          )}
          onClose={() => setReject(null)}
          onConfirm={async () => {
            if (!canWrite(f.role)) return;
            await documentsApi.rejectLab(f.member!.id, reject.id);
            setReject(null);
            reload();
          }}
        />
      )}
    </>
  );
}
function Prescriptions() {
  const { c } = useCopy(),
    f = useFamily();
  const r = useResource(`pendingmeds:${f.member!.id}`, (s) =>
    documentsApi.pendingMedications(f.member!.id, s),
  );
  const [edit, setEdit] = useState<ProposedMedication | null>(null),
    [reject, setReject] = useState<ProposedMedication | null>(null);
  return (
    <>
      <Heading>
        {c("Prescription review", "Resept yoxlaması", "Проверка рецептов")}
      </Heading>
      <Notice>
        {c(
          "Extracted medications are proposals. Check the original prescription before accepting.",
          "Sənəddən çıxarılan dərmanlar təklifdir. Qəbul etməzdən əvvəl reseptlə tutuşdurun.",
          "Извлеченные препараты являются предложениями. Сверьте с рецептом перед принятием.",
        )}
      </Notice>
      <LoadState resource={r} />
      {r.data?.length === 0 && (
        <Body>
          {c(
            "No prescriptions awaiting review.",
            "Yoxlama gözləyən resept yoxdur.",
            "Рецептов на проверке нет.",
          )}
        </Body>
      )}
      {r.data?.map((row) => (
        <View key={row.id} style={[styles.card, { borderColor: "#c7a955" }]}>
          <Heading>
            {row.name ||
              c("Name not read", "Ad oxunmayıb", "Название не распознано")}
          </Heading>
          <Body>
            {c("Awaiting review", "Yoxlama gözləyir", "Ожидает проверки")}
          </Body>
          {[
            ["Dose", "Doza", "Доза", row.doseLabel],
            ["Frequency", "Qəbul tezliyi", "Частота", row.frequency],
            ["Route", "Qəbul yolu", "Способ", row.route],
            [
              "Prescriber",
              "Təyin edən həkim",
              "Назначивший врач",
              row.prescriber,
            ],
          ].map(([en, az, ru, value]) => (
            <Body small key={en}>
              {c(en!, az!, ru!)}:{" "}
              {value || c("Not specified", "Qeyd edilməyib", "Не указано")}
            </Body>
          ))}
          {row.sourceDocumentId && (
            <Button
              secondary
              label={c(
                "Original prescription",
                "Əsl resept",
                "Исходный рецепт",
              )}
              onPress={() =>
                openPrivateFile(
                  `/members/${f.member!.id}/documents/${row.sourceDocumentId}/content`,
                  `${row.sourceDocumentId}.pdf`,
                )
              }
            />
          )}{" "}
          {canWrite(f.role) && (
            <>
              <Button
                label={c("Accept", "Qəbul et", "Принять")}
                onPress={async () => {
                  await documentsApi.confirmMedication(
                    f.member!.id,
                    row.id,
                    {},
                  );
                  r.retry();
                }}
              />
              <Button
                secondary
                label={c("Correct", "Düzəlt", "Исправить")}
                onPress={() => setEdit(row)}
              />
              <Button
                secondary
                label={c("Reject", "Rədd et", "Отклонить")}
                onPress={() => setReject(row)}
              />
            </>
          )}
        </View>
      ))}
      {edit && (
        <Form
          title={c(
            "Correct medication",
            "Dərmanı düzəlt",
            "Исправить препарат",
          )}
          fields={prescriptionFields}
          initial={
            edit as unknown as Record<string, string | number | boolean | null>
          }
          onClose={() => setEdit(null)}
          onSave={async (body) => {
            if (!canWrite(f.role)) return;
            await documentsApi.confirmMedication(f.member!.id, edit.id, body);
            setEdit(null);
            r.retry();
          }}
        />
      )}
      {reject && (
        <Confirm
          title={c(
            "Reject medication proposal",
            "Dərman təklifini rədd et",
            "Отклонить препарат",
          )}
          message={c(
            "This medication will not be added to the record.",
            "Bu dərman qeydlərə əlavə edilməyəcək.",
            "Препарат не будет добавлен в записи.",
          )}
          onClose={() => setReject(null)}
          onConfirm={async () => {
            if (!canWrite(f.role)) return;
            await documentsApi.rejectMedication(f.member!.id, reject.id);
            setReject(null);
            r.retry();
          }}
        />
      )}
    </>
  );
}
