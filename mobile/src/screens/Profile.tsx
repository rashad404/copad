import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../core/api";
import { useSession } from "../core/Session";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import {
  Body,
  Title,
  Page,
  SignedIn,
  LoadState,
  Button,
  Form,
  LinkRow,
  Notice,
  styles,
} from "../ui/kit";
interface ProfileData {
  name?: string;
  email?: string;
  medicalProfile?: Record<string, string>;
  [key: string]: unknown;
}
export default function Profile() {
  return (
    <Page>
      <SignedIn>
        <ProfileScope />
      </SignedIn>
    </Page>
  );
}
function ProfileScope() {
  const { c } = useCopy(),
    session = useSession(),
    nav = useNavigation<any>();
  const r = useResource(
    `profile:${session.user!.id}`,
    async (s) => (await api.get<ProfileData>("/profile", { signal: s })).data,
  );
  const [edit, setEdit] = useState(false),
    [saved, setSaved] = useState(false);
  return (
    <>
      <Title>
        {c("Personal information", "Şəxsi məlumatlar", "Личные данные")}
      </Title>
      <LoadState resource={r} />
      {r.data && (
        <View style={styles.card}>
          <Body>{r.data.name || session.user!.name}</Body>
          <Body>{r.data.email || session.user!.email}</Body>
          <Button
            secondary
            label={c("Edit", "Redaktə et", "Изменить")}
            onPress={() => {
              setEdit(true);
              setSaved(false);
            }}
          />
        </View>
      )}
      {saved && (
        <Notice>
          {c(
            "Changes saved.",
            "Dəyişikliklər saxlanıldı.",
            "Изменения сохранены.",
          )}
        </Notice>
      )}
      <LinkRow
        title={c(
          "Family and medical information",
          "Ailə və sağlamlıq məlumatları",
          "Семья и медицинские данные",
        )}
        onPress={() => nav.navigate("Records")}
      />
      {edit && r.data && (
        <Form
          title={c("Personal information", "Şəxsi məlumatlar", "Личные данные")}
          fields={[
            {
              key: "name",
              label: ["Full name", "Ad və soyad"],
              required: true,
            },
            { key: "email", label: ["Email", "E-poçt"], required: true },
          ]}
          initial={{
            name: r.data.name || session.user!.name,
            email: r.data.email || session.user!.email,
          }}
          onClose={() => setEdit(false)}
          onSave={async (values) => {
            await api.put("/profile", { ...r.data, ...values });
            setEdit(false);
            setSaved(true);
            r.retry();
          }}
        />
      )}
    </>
  );
}
