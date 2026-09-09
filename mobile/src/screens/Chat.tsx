import MarkdownIt from "markdown-it";
import { RichText } from "./Blog";
import ChatAttachments, {
  type ChatFile,
  type StoredChatFile,
  chatFile,
} from "./ChatAttachments";
import { API_URL } from "../core/api";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Image,
  Pressable,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useCopy } from "../core/copy";
import { useFamily, useSession } from "../core/Session";
import api from "../core/api";
import { postChatMessage } from "../api/chatMessage";
import {
  urgencyFromHeaders,
  savedUrgency,
  type ChatUrgency,
} from "../api/chatUrgency";
import {
  Body,
  Heading,
  Page,
  Button,
  Input,
  Notice,
  MemberPicker,
  Sheet,
  LinkRow,
  styles,
  palette,
} from "../ui/kit";
const secret = {
  get: async (key: string) =>
    Platform.OS === "web"
      ? sessionStorage.getItem(key)
      : SecureStore.getItemAsync(key),
  set: async (key: string, value: string) => {
    if (Platform.OS === "web") sessionStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
};
const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });
type Message = {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatFile[];
};
type ChatRow = {
  id: string;
  title?: string;
  messages?: {
    sender: string;
    message: string;
    attachments?: StoredChatFile[];
  }[];
};
export default function Chat() {
  const { user, loading: authLoading, consentPending } = useSession(),
    { member } = useFamily();
  const nav = useNavigation<any>(),
    { c } = useCopy();
  if (consentPending)
    return (
      <Page>
        <Notice>
          {c(
            "Complete your consent choices before using chat.",
            "Söhbətdən əvvəl razılıq seçimlərini tamamlayın.",
            "Завершите выбор согласий перед использованием чата.",
          )}
        </Notice>
        <Button
          label={c("Complete choices", "Seçimləri tamamla", "Завершить выбор")}
          onPress={() => nav.navigate("Auth")}
        />
      </Page>
    );
  if (authLoading)
    return (
      <Page>
        <ActivityIndicator color={palette.blue} />
      </Page>
    );
  return (
    <Page scroll={false}>
      <ChatScope
        key={`${user?.id || "guest"}:${member?.id || "none"}`}
        account={user?.id}
        memberId={user ? member?.id : undefined}
      />
    </Page>
  );
}
function ChatScope({
  account,
  memberId,
}: {
  account?: string;
  memberId?: number;
}) {
  const { c, language } = useCopy();
  const family = useFamily();
  const scope = `chat-${account || "guest"}-${memberId || "none"}`;
  const [sid, setSid] = useState(""),
    [chat, setChat] = useState(""),
    [messages, setMessages] = useState<Message[]>([]),
    [text, setText] = useState(""),
    [loading, setLoading] = useState(true),
    [failed, setFailed] = useState(false),
    [attempt, setAttempt] = useState(0),
    [busy, setBusy] = useState(false),
    [inputHeight, setInputHeight] = useState(48),
    [files, setFiles] = useState<ChatFile[]>([]),
    [uploadOpen, setUploadOpen] = useState(false),
    [previewImage, setPreviewImage] = useState<ChatFile | null>(null),
    [urgency, setUrgency] = useState<ChatUrgency | null>(null),
    [history, setHistory] = useState<ChatRow[] | null>(null);
  const active = useRef(true),
    lock = useRef(false),
    selection = useRef(0),
    scroll = useRef<ScrollView>(null);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    (async () => {
      let session = await secret.get(scope);
      let rows: ChatRow[] = [];
      if (session) {
        try {
          const r = await api.get(
            `/guest/session/${encodeURIComponent(session)}`,
          );
          rows = r.data.chats || [];
        } catch (e) {
          const status = (e as { response?: { status: number } }).response
            ?.status;
          if (status === 404 || status === 410) session = null;
          else throw e;
        }
      }
      if (!session) {
        session = (await api.post("/guest/start")).data.sessionId;
        if (!session) throw Error("Missing session");
        await secret.set(scope, session!);
      }
      if (!alive) return;
      setSid(session!);
      const recent = rows[rows.length - 1];
      if (recent) {
        setChat(String(recent.id));
        setMessages(
          (recent.messages || []).map((m) => ({
            role: m.sender === "USER" ? "user" : "assistant",
            content: m.message,
            attachments: m.attachments?.map(chatFile),
          })),
        );
        const saved = await secret.get(`${scope}-urgent-${recent.id}`);
        if (alive && saved) {
          try {
            setUrgency(savedUrgency(saved));
          } catch {}
        }
      } else {
        const r = await api.post(
          `/guest/chats/${encodeURIComponent(session!)}`,
          { title: null },
        );
        if (alive) setChat(String(r.data.id));
      }
    })()
      .catch(() => {
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [scope, attempt]);
  async function newChat() {
    selection.current++;
    const r = await api.post(`/guest/chats/${encodeURIComponent(sid)}`, {
      title: null,
    });
    if (!active.current) return;
    setChat(String(r.data.id));
    setMessages([]);
    setFiles([]);
    setUrgency(null);
    setText("");
  }
  return (
    <>
      <View style={[styles.footer, { borderTopWidth: 0 }]}>
        <MemberPicker />
        {memberId && (
          <Body small>
            {c(
              `About ${family.member?.fullName}`,
              `${family.member?.fullName} haqqında`,
              `О ${family.member?.fullName}`,
            )}
          </Body>
        )}
        <View style={styles.spread}>
          <Heading>
            {c("Ask azdoc", "azdoc-a sual ver", "Спросить azdoc")}
          </Heading>
          <View style={styles.row}>
            <Button
              secondary
              disabled={loading || busy || !sid}
              label={c("History", "Tarixçə", "История")}
              onPress={async () => {
                const r = await api.get(
                  `/guest/session/${encodeURIComponent(sid)}`,
                );
                if (active.current) setHistory(r.data.chats || []);
              }}
            />
            <Button
              secondary
              disabled={loading || busy || !sid}
              label={c("New", "Yeni", "Новый")}
              onPress={newChat}
            />
          </View>
        </View>
      </View>
      {urgency && (
        <View style={[styles.notice, styles.danger, { margin: 12 }]}>
          <Heading>
            {c(
              "Urgent medical help",
              "Təcili tibbi yardım",
              "Экстренная медицинская помощь",
            )}
          </Heading>
          <Body>{urgency.categories.join("; ")}</Body>
          <Button
            danger
            label={c(
              `Call ${urgency.number}`,
              `${urgency.number} nömrəsinə zəng et`,
              `Позвонить ${urgency.number}`,
            )}
            onPress={() => Linking.openURL(`tel:${urgency.number}`)}
          />
        </View>
      )}
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.body, { flexGrow: 1 }]}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
      >
        {loading ? (
          <ActivityIndicator color={palette.blue} />
        ) : failed ? (
          <>
            <Notice danger>
              {c(
                "Could not load the conversation.",
                "Söhbəti yükləmək mümkün olmadı.",
                "Не удалось загрузить беседу.",
              )}
            </Notice>
            <Button
              label={c("Retry", "Yenidən cəhd et", "Повторить")}
              onPress={() => setAttempt((n) => n + 1)}
            />
          </>
        ) : messages.length === 0 ? (
          <View style={{ gap: 20, paddingTop: 28 }}>
            <Heading>
              {c(
                "What would you like to ask?",
                "Nə soruşmaq istəyirsiniz?",
                "О чем хотите спросить?",
              )}
            </Heading>
            <Body>
              {c(
                "Tell me how you feel, ask a question, or share a medical document.",
                "Əlamətlər, analiz nəticələri və dərmanlar haqqında soruşa bilərsiniz.",
                "Расскажите о самочувствии, задайте вопрос или прикрепите медицинский документ.",
              )}
            </Body>
            {[
              c(
                "Help me understand a lab result",
                "Analiz nəticəmi izah edə bilərsən?",
                "Помогите разобраться в результатах анализов",
              ),
              c(
                "I have a health question",
                "Sağlamlıqla bağlı sualım var",
                "У меня вопрос о здоровье",
              ),
              c(
                "Help me prepare for a doctor's visit",
                "Həkim qəbuluna nə aparmalıyam?",
                "Что взять с собой на прием к врачу?",
              ),
            ].map((q) => (
              <LinkRow
                key={q}
                title={q}
                onPress={() => setText(q)}
                icon="arrow-up-outline"
              />
            ))}
          </View>
        ) : (
          messages.map((m, i) => (
            <View
              key={i}
              style={[
                { gap: 8, paddingVertical: 12 },
                m.role === "user" && {
                  backgroundColor: palette.sage,
                  padding: 16,
                  borderRadius: 14,
                  marginLeft: 22,
                },
              ]}
            >
              <Body small>
                {m.role === "user" ? c("You", "Siz", "Вы") : "azdoc"}
              </Body>
              {m.role === "assistant" ? (
                <RichText html={markdown.render(m.content)} />
              ) : (
                <Body>{m.content}</Body>
              )}
              {m.attachments?.map((file) => (
                <Attachment
                  key={file.id}
                  file={file}
                  onImage={setPreviewImage}
                />
              ))}
            </View>
          ))
        )}
        {busy && <ActivityIndicator color={palette.blue} />}
      </ScrollView>
      <View style={styles.footer}>
        {files.map((file) => (
          <View style={styles.spread} key={file.id}>
            <Text style={[styles.muted, { flex: 1 }]}>{file.name}</Text>
            <Button
              secondary
              label={c("Remove", "Çıxar", "Убрать")}
              disabled={busy}
              onPress={() => setFiles((f) => f.filter((x) => x.id !== file.id))}
            />
          </View>
        ))}
        <Input
          label={c("Message", "Mesaj", "Сообщение")}
          value={text}
          onChangeText={setText}
          multiline
          style={{ minHeight: 48, height: inputHeight, maxHeight: 120 }}
          onContentSizeChange={(event) =>
            setInputHeight(
              Math.max(48, Math.min(120, event.nativeEvent.contentSize.height)),
            )
          }
          editable={!loading && !busy}
          placeholder={c(
            "Ask your question",
            "Sualınızı yazın",
            "Напишите вопрос",
          )}
        />
        <View style={styles.spread}>
          <Button
            secondary
            disabled={loading || busy || !sid}
            label={c("Attach file", "Fayl əlavə et", "Прикрепить файл")}
            onPress={() => setUploadOpen(true)}
          />
          <Button
            disabled={
              loading ||
              busy ||
              failed ||
              !chat ||
              (!text.trim() && !files.length)
            }
            label={c("Send", "Göndər", "Отправить")}
            onPress={async () => {
              if (lock.current) return;
              lock.current = true;
              setBusy(true);
              const question = text.trim();
              try {
                const r = await postChatMessage(
                  sid,
                  chat,
                  question,
                  language,
                  files.map((f) => f.id),
                  account ? memberId : undefined,
                );
                const urgent = urgencyFromHeaders(r.headers);
                if (urgent) {
                  if (active.current) setUrgency(urgent);
                  await secret
                    .set(`${scope}-urgent-${chat}`, JSON.stringify(urgent))
                    .catch(() => {});
                }
                const answer =
                  typeof r.data === "string"
                    ? r.data
                    : r.data.response || r.data.message;
                if (!answer)
                  throw Error(
                    c(
                      "No reply was returned.",
                      "Cavab qaytarılmadı.",
                      "Ответ не получен.",
                    ),
                  );
                if (active.current) {
                  setMessages((m) => [
                    ...m,
                    {
                      role: "user",
                      content: question,
                      attachments: [...files],
                    },
                    { role: "assistant", content: answer },
                  ]);
                  setText("");
                  setFiles([]);
                }
              } finally {
                lock.current = false;
                if (active.current) setBusy(false);
              }
            }}
          />
        </View>
        <Body small>
          {c(
            "azdoc doesn't replace a doctor. Emergency: 103.",
            "azdoc tibbi məsləhət vermir. Təcili hallarda 103.",
            "azdoc не заменяет врача. Экстренная помощь: 103.",
          )}
        </Body>
      </View>
      {uploadOpen && (
        <ChatAttachments
          sessionId={sid}
          chatId={chat}
          onFiles={(newFiles) =>
            setFiles((previous) => [
              ...previous,
              ...newFiles.filter((f) => !previous.some((p) => p.id === f.id)),
            ])
          }
          onClose={() => setUploadOpen(false)}
        />
      )}
      {previewImage && (
        <Sheet title={previewImage.name} onClose={() => setPreviewImage(null)}>
          <ScrollView maximumZoomScale={5}>
            <Image
              source={{ uri: attachmentUri(previewImage.url) }}
              resizeMode="contain"
              style={{ width: "100%", height: 500 }}
              accessibilityLabel={previewImage.name}
            />
          </ScrollView>
        </Sheet>
      )}
      {history && (
        <Sheet
          title={c("Conversations", "Söhbətlər", "Беседы")}
          onClose={() => setHistory(null)}
        >
          {history.map((row) => (
            <LinkRow
              key={row.id}
              title={row.title || c("Conversation", "Söhbət", "Беседа")}
              onPress={() => {
                const selected = ++selection.current;
                setChat(String(row.id));
                setMessages(
                  (row.messages || []).map((m) => ({
                    role: m.sender === "USER" ? "user" : "assistant",
                    content: m.message,
                    attachments: m.attachments?.map(chatFile),
                  })),
                );
                setFiles([]);
                setText("");
                setUrgency(null);
                setHistory(null);
                void secret.get(`${scope}-urgent-${row.id}`).then((saved) => {
                  if (
                    active.current &&
                    selected === selection.current &&
                    saved
                  ) {
                    try {
                      setUrgency(savedUrgency(saved));
                    } catch {}
                  }
                });
              }}
            />
          ))}
        </Sheet>
      )}
    </>
  );
}

function attachmentUri(value?: string) {
  if (!value) return undefined;
  // Session-bound attachments stay on the configured API origin.
  if (value.startsWith("/api/attachments/")) return API_URL + value.slice(4);
  return /^https?:\/\//.test(value) ? value : undefined;
}
function Attachment({
  file,
  onImage,
}: {
  file: ChatFile;
  onImage: (file: ChatFile) => void;
}) {
  const image = file.fileType?.startsWith("image/") && attachmentUri(file.url);
  return (
    <View style={styles.line}>
      {image && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={file.name}
          onPress={() => onImage(file)}
        >
          <Image
            source={{ uri: image }}
            style={{ width: 230, height: 160, borderRadius: 12 }}
            resizeMode="cover"
          />
        </Pressable>
      )}
      <Body small>
        {file.name}
        {file.fileSize
          ? ` - ${file.fileSize < 1024 ? file.fileSize + " B" : file.fileSize < 1048576 ? Math.round(file.fileSize / 1024) + " KB" : (file.fileSize / 1048576).toFixed(1) + " MB"}`
          : ""}
      </Body>
    </View>
  );
}
