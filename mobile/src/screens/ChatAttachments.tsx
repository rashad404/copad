import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { readableError } from "../api/recordModel";
import { Sheet, Button, Select, Body, Notice, styles } from "../ui/kit";
export type ChatFile = {
  id: string;
  name: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
};
export type StoredChatFile = {
  fileId: string;
  filename: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
};
export const chatFile = (f: StoredChatFile): ChatFile => ({
  id: f.fileId,
  name: f.filename,
  url: f.url,
  fileType: f.fileType,
  fileSize: f.fileSize,
});
const categories: Record<string, { extensions: string[]; max: number }> = {
  general: {
    extensions: ["pdf", "txt", "jpg", "jpeg", "png", "doc", "docx"],
    max: 10,
  },
  "lab-results": { extensions: ["pdf", "txt", "csv"], max: 10 },
  imaging: { extensions: ["jpg", "jpeg", "png", "dicom", "pdf"], max: 25 },
  prescriptions: { extensions: ["pdf", "jpg", "jpeg", "png"], max: 5 },
  "clinical-notes": { extensions: ["pdf", "txt", "doc", "docx"], max: 10 },
};
export default function ChatAttachments({
  sessionId,
  chatId,
  onFiles,
  onClose,
}: {
  sessionId: string;
  chatId: string;
  onFiles: (files: ChatFile[]) => void;
  onClose: () => void;
}) {
  const { c } = useCopy(),
    [category, setCategory] = useState("general"),
    [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [message, setMessage] = useState(""),
    [done, setDone] = useState(false);
  const controller = useRef(new AbortController());
  useEffect(() => () => controller.current.abort(), []);
  const config = categories[category];
  return (
    <Sheet
      title={c(
        "Attach medical documents",
        "Tibbi sənədləri əlavə edin",
        "Прикрепить медицинские документы",
      )}
      onClose={onClose}
    >
      <Select
        label={c("Document category", "Sənəd növü", "Категория документа")}
        value={category}
        disabled={busy || files.length > 0}
        onChange={setCategory}
        options={[
          {
            value: "general",
            label: c(
              "General medical documents",
              "Tibbi sənədlər",
              "Медицинские документы",
            ),
          },
          {
            value: "lab-results",
            label: c("Lab results", "Analiz nəticələri", "Результаты анализов"),
          },
          {
            value: "imaging",
            label: c(
              "Medical imaging",
              "Tibbi görüntülər",
              "Медицинские снимки",
            ),
          },
          {
            value: "prescriptions",
            label: c("Prescriptions", "Reseptlər", "Рецепты"),
          },
          {
            value: "clinical-notes",
            label: c("Clinical notes", "Həkim qeydləri", "Записи врача"),
          },
        ]}
      />
      <Body small>
        {config.extensions.join(", ")}. {c("Maximum", "Maksimum", "Не более")}{" "}
        {config.max} MB.{" "}
        {c("Up to 10 files.", "10 fayla qədər.", "До 10 файлов.")}
      </Body>
      {files.map((f, i) => (
        <View key={`${f.name}:${i}`} style={styles.line}>
          <Body>{f.name}</Body>
          <Body small>{((f.size || 0) / 1024 / 1024).toFixed(1)} MB</Body>
          {!busy && !done && (
            <Button
              secondary
              label={c("Remove", "Çıxar", "Убрать")}
              onPress={() => setFiles((v) => v.filter((_, idx) => idx !== i))}
            />
          )}
        </View>
      ))}
      {!done && (
        <Button
          secondary
          disabled={busy || files.length >= 10}
          label={c("Choose files", "Faylları seçin", "Выбрать файлы")}
          onPress={async () => {
            const r = await DocumentPicker.getDocumentAsync({
              multiple: true,
              copyToCacheDirectory: true,
            });
            if (r.canceled) return;
            if (r.assets.length + files.length > 10)
              throw Error(
                c(
                  "Choose up to 10 files.",
                  "10-dan çox fayl seçməyin.",
                  "Выберите не более 10 файлов.",
                ),
              );
            for (const f of r.assets) {
              if ((f.size || 0) > config.max * 1024 * 1024)
                throw Error(`${f.name}: ${config.max} MB`);
              if (
                !config.extensions.includes(
                  f.name.split(".").pop()?.toLowerCase() || "",
                )
              )
                throw Error(`${f.name}: ${config.extensions.join(", ")}`);
            }
            setFiles((v) => [...v, ...r.assets]);
          }}
        />
      )}
      {busy && (
        <Body>
          {c(
            "Uploading and processing",
            "Yüklənir və oxunur",
            "Загрузка и обработка",
          )}
          : {progress}%
        </Body>
      )}
      {!!message && <Notice>{message}</Notice>}
      {!done && (
        <Button
          disabled={busy || !files.length}
          label={c("Upload files", "Faylları yüklə", "Загрузить файлы")}
          onPress={async () => {
            setBusy(true);
            setMessage("");
            const signal = controller.current.signal;
            try {
              const body = new FormData();
              for (const f of files) {
                if (Platform.OS === "web" && f.file)
                  body.append("files", f.file, f.name);
                else
                  body.append("files", {
                    uri: f.uri,
                    name: f.name,
                    type: f.mimeType || "application/octet-stream",
                  } as unknown as Blob);
              }
              body.append("category", category);
              const headers = { "X-Guest-Session-Id": sessionId };
              const r = await api.post(
                "/v2/messages/chat/" +
                  encodeURIComponent(chatId) +
                  "/files/batch",
                body,
                { headers, signal },
              );
              let terminal = false;
              for (
                let attempt = 0;
                attempt < 60 && !signal.aborted;
                attempt++
              ) {
                const response = await api.get(
                  `/v2/messages/files/batch/${encodeURIComponent(r.data.batchId)}/status`,
                  { headers, signal },
                );
                if (signal.aborted) return;
                setProgress(response.data.progressPercentage || 0);
                if (["completed", "partial"].includes(response.data.status)) {
                  const uploaded = await api.get<StoredChatFile[]>(
                    `/v2/messages/files/batch/${encodeURIComponent(r.data.batchId)}/files`,
                    { headers, signal },
                  );
                  if (signal.aborted) return;
                  onFiles(uploaded.data.map(chatFile));
                  const count = uploaded.data.length;
                  setMessage(
                    c(
                      `${count} of ${files.length} files attached.`,
                      `${files.length} fayldan ${count}-i əlavə edildi.`,
                      `Прикреплено ${count} из ${files.length} файлов.`,
                    ) +
                      (count < files.length
                        ? " " +
                          c(
                            "Some files could not be attached.",
                            "Bəzi faylları əlavə etmək mümkün olmadı.",
                            "Часть файлов не удалось прикрепить.",
                          )
                        : ""),
                  );
                  setDone(true);
                  terminal = true;
                  break;
                }
                if (response.data.status === "failed")
                  throw Error(
                    c(
                      "Files could not be processed.",
                      "Faylları oxumaq mümkün olmadı.",
                      "Не удалось обработать файлы.",
                    ),
                  );
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
              if (!terminal && !signal.aborted)
                throw Error(
                  c(
                    "Processing is taking longer than expected. Check the conversation before uploading again.",
                    "Faylların oxunması gözləniləndən uzun çəkir. Yenidən yükləməzdən əvvəl söhbəti yoxlayın.",
                    "Обработка занимает больше времени. Перед повторной загрузкой проверьте чат.",
                  ),
                );
            } catch (e) {
              if (!signal.aborted)
                throw Error(
                  readableError(
                    e,
                    c(
                      "Upload failed.",
                      "Yükləmək mümkün olmadı.",
                      "Не удалось загрузить.",
                    ),
                  ),
                );
            } finally {
              if (!signal.aborted) setBusy(false);
            }
          }}
        />
      )}
      <Button
        secondary
        label={c("Done", "Hazırdır", "Готово")}
        onPress={onClose}
      />
    </Sheet>
  );
}
