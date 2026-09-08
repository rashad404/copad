import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSession } from "../core/Session";
import { useCopy } from "../core/copy";
import privacy from "../copy/privacy.json";
import {
  Page,
  Title,
  Body,
  Input,
  Button,
  Toggle,
  Notice,
  styles,
} from "../ui/kit";
export default function Auth() {
  const { c, language } = useCopy(),
    nav = useNavigation<any>(),
    session = useSession(),
    p = privacy[language];
  const [register, setRegister] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [storage, setStorage] = useState(session.pendingChoices?.storage ?? false),
    [ai, setAi] = useState(session.pendingChoices?.ai ?? false);
  return (
    <Page>
      <Title>
        {register
          ? c("Create an account", "Hesab yarat", "Создать аккаунт")
          : c("Welcome back", "Hesabınıza daxil olun", "Войдите в аккаунт")}
      </Title>
      <View style={styles.card}>
        {!session.consentPending && (
          <>
            {register && (
              <Input
                label={c("Full name", "Ad və soyad", "Имя и фамилия")}
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            )}
            <Input
              label={c("Email", "E-poçt", "Эл. почта")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Input
              label={c("Password", "Şifrə", "Пароль")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={register ? "new-password" : "current-password"}
            />
          </>
        )}
        {(register || session.consentPending) && (
          <>
            <Toggle
              label={p.storageConsent}
              value={storage}
              onChange={setStorage}
            />
            <Toggle label={p.aiConsent} value={ai} onChange={setAi} />
            <Body small>{p.separate}</Body>
            {!ai && <Body small>{p.noAi}</Body>}
          </>
        )}
        {session.consentPending && <Notice danger>{p.saveFailed}</Notice>}
        <Button
          disabled={
            !session.consentPending &&
            (!email.trim() || !password || (register && !name.trim()))
          }
          label={
            session.consentPending
              ? p.retryChoices
              : register
                ? c("Create account", "Hesab yarat", "Создать аккаунт")
                : c("Sign in", "Daxil ol", "Войти")
          }
          onPress={async () => {
            if (session.consentPending)
              await session.retryConsents(storage, ai);
            else
              await session.authenticate(
                email.trim(),
                password,
                register ? name.trim() : undefined,
                storage,
                ai,
              );
            if (nav.canGoBack()) nav.goBack();
          }}
        />
        {!session.consentPending && (
          <Button
            secondary
            label={
              register
                ? c(
                    "I already have an account",
                    "Hesabım var",
                    "У меня есть аккаунт",
                  )
                : c("Create an account", "Hesab yarat", "Создать аккаунт")
            }
            onPress={() => setRegister(!register)}
          />
        )}
      </View>
    </Page>
  );
}
