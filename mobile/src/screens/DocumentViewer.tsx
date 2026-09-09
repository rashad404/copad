import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, ActivityIndicator } from "react-native";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { useSession, useFamily } from "../core/Session";
import { useCopy } from "../core/copy";
import { downloadForPreview, openPrivateFile } from "../core/files";
import PdfPreview from "../ui/PdfPreview";
import {
  Page,
  Heading,
  Body,
  Button,
  Notice,
  styles,
  palette,
} from "../ui/kit";
export default function DocumentViewer() {
  const { memberId, documentId, name } = useRoute<any>().params as {
    memberId: number;
    documentId: number;
    name: string;
  };
  const { user } = useSession(),
    f = useFamily(),
    { c } = useCopy(),
    focused = useIsFocused();
  const [file, setFile] = useState<{ uri: string; contentType: string } | null>(
      null,
    ),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const path = `/members/${memberId}/documents/${documentId}/content`,
    allowed = !!user && f.member?.id === memberId;
  useEffect(() => {
    let active = true,
      dispose: (() => void) | undefined;
    setFile(null);
    setError("");
    if (focused && allowed)
      downloadForPreview(path, `${documentId}.bin`)
        .then((r) => {
          if (!active) {
            r.dispose();
            return;
          }
          dispose = r.dispose;
          setFile(r);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });
    return () => {
      active = false;
      dispose?.();
    };
  }, [path, allowed, focused, attempt, user?.id]);
  const fallback = () =>
    setError(
      c(
        "This file cannot be previewed. You can open it in another app.",
        "Bu fayla burada baxmaq mümkün deyil. Başqa tətbiqdə aça bilərsiniz.",
        "Не удалось показать файл. Его можно открыть в другом приложении.",
      ),
    );
  return (
    <Page scroll={false}>
      <View style={{ padding: 20, gap: 12 }}>
        <Heading>{name || c("Document", "Sənəd", "Документ")}</Heading>
        {!allowed && (
          <Notice>
            {c(
              "Select this family member to view the document.",
              "Sənədə baxmaq üçün aid olduğu ailə üzvünü seçin.",
              "Выберите члена семьи, которому принадлежит документ.",
            )}
          </Notice>
        )}
        {!!error && (
          <>
            <Notice danger>{error}</Notice>
            <Button
              secondary
              label={c("Retry", "Yenidən cəhd et", "Повторить")}
              onPress={() => setAttempt((v) => v + 1)}
            />
          </>
        )}
        {allowed && (
          <Button
            secondary
            label={c(
              "Open or share file",
              "Faylı aç və ya paylaş",
              "Открыть или поделиться файлом",
            )}
            onPress={() => openPrivateFile(path, `${documentId}.bin`)}
          />
        )}
      </View>
      {allowed && focused && !file && !error && (
        <ActivityIndicator color={palette.blue} />
      )}
      {allowed &&
        focused &&
        file &&
        !error &&
        (file.contentType.includes("application/pdf") ? (
          <PdfPreview uri={file.uri} onError={fallback} />
        ) : file.contentType.startsWith("image/") ? (
          <ScrollView
            maximumZoomScale={5}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Image
              source={{ uri: file.uri }}
              resizeMode="contain"
              style={{ flex: 1, minHeight: 480, width: "100%" }}
              accessibilityLabel={name}
              onError={fallback}
            />
          </ScrollView>
        ) : (
          <View style={styles.body}>
            <Body>
              {c(
                'Use "Open or share file" to read this format in another app.',
                'Bu formatı oxumaq üçün "Faylı aç və ya paylaş" düyməsindən istifadə edin.',
                'Чтобы прочитать этот формат, нажмите "Открыть или поделиться файлом".',
              )}
            </Body>
          </View>
        ))}
    </Page>
  );
}
