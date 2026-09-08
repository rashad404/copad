import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateField } from "./DateField";
import { decimal, calendarDate } from "../core/validation";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useCopy } from "../core/copy";
import { useFamily, useSession } from "../core/Session";
import {
  readableError,
  enumLabel,
  formPayload,
  type Field as FormField,
} from "../api/recordModel";
import type { RecordValue } from "../api/healthRecord";
export const palette = {
  bg: "#f8f9f5",
  paper: "#ffffff",
  ink: "#172a35",
  muted: "#5c6c70",
  line: "#dce2d9",
  blue: "#214be2",
  sage: "#e8eee1",
  red: "#a72b2b",
  redBg: "#fff0ec",
};
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.bg },
  body: {
    padding: 22,
    paddingBottom: 40,
    gap: 20,
    width: "100%",
    maxWidth: 780,
    alignSelf: "center",
  },
  text: { fontSize: 16, lineHeight: 24, color: palette.ink },
  muted: { fontSize: 13, lineHeight: 20, color: palette.muted },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1.2,
    color: palette.ink,
  },
  heading: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: palette.ink,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  spread: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingVertical: 16,
    gap: 8,
  },
  button: {
    backgroundColor: palette.blue,
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.line,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b8c5bf",
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 16,
    color: palette.ink,
  },
  label: { fontSize: 14, fontWeight: "600", color: palette.ink },
  notice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: palette.sage,
    gap: 8,
  },
  danger: {
    backgroundColor: palette.redBg,
    borderColor: "#e8b7aa",
    borderWidth: 1,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.sage,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    padding: 16,
    gap: 10,
    backgroundColor: palette.paper,
  },
});
export function Body({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <Text selectable style={small ? styles.muted : styles.text}>
      {children}
    </Text>
  );
}
export function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text accessibilityRole="header" style={styles.title}>
      {children}
    </Text>
  );
}
export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Text accessibilityRole="header" style={styles.heading}>
      {children}
    </Text>
  );
}
export function Page({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const headerHeight = useHeaderHeight();
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.body}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Brand() {
  return (
    <View style={styles.row}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 26, height: 26 }}
        accessibilityIgnoresInvertColors
      />
      <Text
        style={{
          fontSize: 31,
          fontWeight: "800",
          letterSpacing: -1.8,
          color: palette.ink,
        }}
      >
        azdoc
      </Text>
    </View>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  danger = false,
}: {
  label: string;
  onPress: () => void | Promise<void>;
  secondary?: boolean;
  disabled?: boolean;
  danger?: boolean;
}) {
  const { c } = useCopy();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false);
  return (
    <View style={{ gap: 8 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || busy, busy }}
        disabled={disabled || busy}
        onPress={async () => {
          if (lock.current) return;
          lock.current = true;
          setBusy(true);
          setError("");
          try {
            await onPress();
          } catch (e) {
            if (e instanceof Error && e.message === "MAX_FILE_SIZE") {
              setError(
                c(
                  "The file exceeds 25 MB.",
                  "Faylın həcmi 25 MB-dan çoxdur.",
                  "Размер файла превышает 25 МБ.",
                ),
              );
              return;
            }
            setError(
              readableError(
                e,
                c(
                  "Could not complete the request. Please retry.",
                  "Sorğunu tamamlamaq mümkün olmadı. Yenidən cəhd edin.",
                  "Не удалось выполнить запрос. Повторите попытку.",
                ),
              ),
            );
          } finally {
            lock.current = false;
            setBusy(false);
          }
        }}
        style={({ pressed }) => [
          styles.button,
          secondary && styles.secondary,
          danger && { backgroundColor: palette.red },
          (disabled || busy) && { opacity: 0.5 },
          pressed && { opacity: 0.75 },
        ]}
      >
        {busy ? (
          <ActivityIndicator color={secondary ? palette.blue : "#fff"} />
        ) : (
          <Text
            style={[styles.buttonText, secondary && { color: palette.ink }]}
          >
            {label}
          </Text>
        )}
      </Pressable>
      {!!error && <Notice danger>{error}</Notice>}
    </View>
  );
}
export function Notice({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <View
      accessibilityRole={danger ? "alert" : undefined}
      style={[styles.notice, danger && styles.danger]}
    >
      <Body>{children}</Body>
    </View>
  );
}
export function Input({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={palette.muted}
        {...props}
        style={[
          styles.input,
          props.multiline && { minHeight: 90, textAlignVertical: "top" },
          props.style,
        ]}
      />
    </View>
  );
}
export function Toggle({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.spread}>
      <Text style={[styles.text, { flex: 1 }]}>{label}</Text>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: palette.blue }}
      />
    </View>
  );
}
export function Sheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const { c } = useCopy();
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.page}>
        <View style={[styles.spread, { padding: 20 }]}>
          <Text style={[styles.heading, { flex: 1 }]}>{title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={c("Close", "Bağla", "Закрыть")}
            onPress={onClose}
            style={{ padding: 12 }}
          >
            <Ionicons name="close" size={24} color={palette.ink} />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.body}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
export function Select({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[styles.input, styles.spread]}
      >
        <Text style={[styles.text, { flex: 1 }]}>
          {options.find((o) => o.value === value)?.label || "-"}
        </Text>
        <Ionicons name="chevron-down" size={16} />
      </Pressable>
      {open && (
        <Sheet title={label} onClose={() => setOpen(false)}>
          {options.map((o) => (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: value === o.value }}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
              style={[styles.line, styles.spread]}
            >
              <Text style={[styles.text, { flex: 1 }]}>{o.label}</Text>
              {value === o.value && (
                <Ionicons name="checkmark" color={palette.blue} size={22} />
              )}
            </Pressable>
          ))}
        </Sheet>
      )}
    </View>
  );
}
export function LinkRow({
  title,
  detail,
  onPress,
  icon = "chevron-forward",
}: {
  title: string;
  detail?: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={detail}
      onPress={onPress}
      style={[styles.line, styles.spread]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.heading}>{title}</Text>
        {detail && <Body small>{detail}</Body>}
      </View>
      <Ionicons name={icon} size={22} color={palette.blue} accessible={false} />
    </Pressable>
  );
}
export function LoadState({
  resource,
}: {
  resource: { loading: boolean; error: string; retry: () => void };
}) {
  const { c } = useCopy();
  if (resource.loading)
    return (
      <ActivityIndicator
        accessibilityLabel={c("Loading", "Yüklənir", "Загрузка")}
        color={palette.blue}
      />
    );
  if (resource.error)
    return (
      <View style={{ gap: 10 }}>
        <Notice danger>
          {resource.error === "REQUEST_FAILED"
            ? c(
                "Could not load data.",
                "Məlumatları yükləmək mümkün olmadı.",
                "Не удалось загрузить данные.",
              )
            : resource.error}
        </Notice>
        <Button
          secondary
          label={c("Retry", "Yenidən cəhd et", "Повторить")}
          onPress={resource.retry}
        />
      </View>
    );
  return null;
}
export function MemberPicker({ allowNone = true }: { allowNone?: boolean }) {
  const family = useFamily(),
    { user } = useSession(),
    { c } = useCopy();
  if (!user) return null;
  if (family.loading) return <ActivityIndicator color={palette.blue} />;
  if (family.error)
    return (
      <Button
        secondary
        label={c(
          "Reload family members",
          "Ailə üzvlərini yenidən yüklə",
          "Загрузить членов семьи",
        )}
        onPress={family.reload}
      />
    );
  return (
    <Select
      label={c("Family member", "Ailə üzvü", "Член семьи")}
      value={String(family.member?.id || "")}
      options={[
        {
          value: "",
          label: allowNone
            ? c(
                "No member selected",
                "Ailə üzvü seçilməyib",
                "Член семьи не выбран",
              )
            : c("Choose a member", "Ailə üzvünü seçin", "Выберите члена семьи"),
        },
        ...family.families.flatMap((f) =>
          f.members.map((m) => ({ value: String(m.id), label: m.fullName })),
        ),
      ]}
      onChange={(v) => family.select(Number(v) || null)}
    />
  );
}
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { user, loading, authError, refresh } = useSession(),
    { c } = useCopy();
  const nav = useNavigation<any>();
  if (loading) return <ActivityIndicator color={palette.blue} />;
  if (authError)
    return (
      <Button
        label={c(
          "Retry sign-in check",
          "Hesabı yenidən yoxla",
          "Повторить проверку входа",
        )}
        onPress={refresh}
      />
    );
  if (!user)
    return (
      <View style={styles.card}>
        <Heading>
          {c(
            "Your health records",
            "Sağlamlıq qeydləriniz",
            "Ваши медицинские записи",
          )}
        </Heading>
        <Body>
          {c(
            "Sign in to manage your family and appointments.",
            "Ailə üzvlərinizin qeydlərini və randevularınızı idarə etmək üçün daxil olun.",
            "Войдите, чтобы управлять записями семьи и приемами.",
          )}
        </Body>
        <Button
          label={c("Sign in", "Daxil ol", "Войти")}
          onPress={() => nav.navigate("Auth")}
        />
      </View>
    );
  return <React.Fragment key={user.id}>{children}</React.Fragment>;
}
export function Confirm({
  title,
  message,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const { c } = useCopy();
  return (
    <Sheet title={title} onClose={onClose}>
      <Notice danger>{message}</Notice>
      <Button
        danger
        label={c("Confirm", "Təsdiqlə", "Подтвердить")}
        onPress={onConfirm}
      />
      <Button
        secondary
        label={c("Keep", "Saxla", "Оставить")}
        onPress={onClose}
      />
    </Sheet>
  );
}
export function Form({
  title,
  fields,
  initial = {},
  onSave,
  onClose,
  before,
}: {
  before?: React.ReactNode;
  title: string;
  fields: FormField[];
  initial?: Record<string, RecordValue>;
  onSave: (v: Record<string, RecordValue>) => Promise<void>;
  onClose: () => void;
}) {
  const { c } = useCopy();
  const [values, setValues] = useState<Record<string, RecordValue>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.key, initial[f.key] ?? f.default ?? ""]),
    ),
  );
  const [error, setError] = useState("");
  const update = (key: string, value: RecordValue) =>
    setValues((v) => ({ ...v, [key]: value }));
  return (
    <Sheet title={title} onClose={onClose}>
      {before}
      {fields.map((f) => {
        const label = c(...f.label) + (f.required ? " *" : "");
        return f.type === "checkbox" ? (
          <Toggle
            key={f.key}
            label={label}
            value={!!values[f.key]}
            onChange={(v) => update(f.key, v)}
          />
        ) : f.type === "select" ? (
          <Select
            key={f.key}
            label={label}
            value={String(values[f.key] || "")}
            options={[
              { value: "", label: "-" },
              ...(f.options || []).map((value) => ({
                value,
                label: enumLabel(value, c),
              })),
            ]}
            onChange={(v) => update(f.key, v)}
          />
        ) : f.type === "date" ? (
          <DateField
            key={f.key}
            label={label}
            value={String(values[f.key] || "")}
            onChange={(v) => update(f.key, v)}
          />
        ) : (
          <Input
            key={f.key}
            label={label}
            value={String(values[f.key] ?? "")}
            onChangeText={(v) => update(f.key, v)}
            keyboardType={f.type === "number" ? "decimal-pad" : "default"}
            multiline={f.type === "textarea"}
          />
        );
      })}
      {!!error && <Notice danger>{error}</Notice>}
      <Button
        label={c("Save", "Yadda saxla", "Сохранить")}
        onPress={async () => {
          setError("");
          for (const f of fields) {
            const v = values[f.key];
            if (f.required && !String(v ?? "").trim()) {
              setError(
                c(
                  "Complete the required fields.",
                  "Vacib xanaları doldurun.",
                  "Заполните обязательные поля.",
                ),
              );
              return;
            }
            if (
              f.type === "number" &&
              v !== "" &&
              v != null &&
              (!Number.isFinite(decimal(v)) ||
                (f.min != null && decimal(v) < f.min))
            ) {
              setError(
                c(
                  "Enter a valid number.",
                  "Düzgün rəqəm daxil edin.",
                  "Введите корректное число.",
                ),
              );
              return;
            }
            if (f.type === "date" && v && !calendarDate(String(v))) {
              setError(
                c(
                  "Use YYYY-MM-DD for dates.",
                  "Tarixi YYYY-MM-DD şəklində yazın.",
                  "Введите дату в формате YYYY-MM-DD.",
                ),
              );
              return;
            }
          }
          await onSave(formPayload(fields, values));
        }}
      />
    </Sheet>
  );
}
