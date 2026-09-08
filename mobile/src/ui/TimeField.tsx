import React, { useState } from "react";
import { Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Input, Body, Sheet } from "./kit";
import { useCopy } from "../core/copy";
export const validTime = (value: string) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export default function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false),
    { c } = useCopy();
  if (Platform.OS === "web")
    return (
      <Input label={`${label} (HH:MM)`} value={value} onChangeText={onChange} />
    );
  const date = new Date();
  date.setHours(
    Number(value.slice(0, 2)) || 0,
    Number(value.slice(3, 5)) || 0,
    0,
    0,
  );
  const picker = (
    <DateTimePicker
      mode="time"
      value={date}
      is24Hour
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={(e, d) => {
        if (Platform.OS === "android") setOpen(false);
        if (e.type === "set" && d)
          onChange(
            `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
          );
      }}
    />
  );
  return (
    <View style={{ gap: 8 }}>
      <Body small>{label}</Body>
      <Button secondary label={value} onPress={() => setOpen(true)} />
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
    </View>
  );
}
