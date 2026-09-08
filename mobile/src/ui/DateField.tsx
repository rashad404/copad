import React, { useState } from "react";
import { Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCopy } from "../core/copy";
import { shortDate } from "../utils/dates";
import { Body, Input, Button, Sheet } from "./kit";
export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { c, language } = useCopy();
  const [open, setOpen] = useState(false);
  if (Platform.OS === "web")
    return (
      <Input
        label={`${label} (YYYY-MM-DD)`}
        value={value}
        onChangeText={onChange}
      />
    );
  const current = value
    ? new Date(`${value.slice(0, 10)}T12:00:00`)
    : new Date();
  const picker = (
    <DateTimePicker
      value={Number.isNaN(current.getTime()) ? new Date() : current}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "default"}
      locale={
        language === "az" ? "az_AZ" : language === "ru" ? "ru_RU" : "en_GB"
      }
      onChange={(event, date) => {
        if (Platform.OS === "android") setOpen(false);
        if (event.type === "set" && date)
          onChange(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
          );
      }}
    />
  );
  return (
    <View style={{ gap: 8 }}>
      <Body small>{label}</Body>
      <Button
        secondary
        label={
          value
            ? shortDate(value, language)
            : c("Choose date", "Tarix seçin", "Выберите дату")
        }
        onPress={() => setOpen(true)}
      />
      {open &&
        (Platform.OS === "ios" ? (
          <Sheet title={label} onClose={() => setOpen(false)}>
            {picker}
            <Button
              label={c("Done", "Hazırdır", "Готово")}
              onPress={() => setOpen(false)}
            />
          </Sheet>
        ) : (
          picker
        ))}
      {!!value && (
        <Button
          secondary
          label={c("Clear date", "Tarixi sil", "Убрать дату")}
          onPress={() => onChange("")}
        />
      )}
    </View>
  );
}
