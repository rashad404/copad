import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSession } from "../core/Session";
import { useCopy } from "../core/copy";
import { authCopy } from "../copy/website/auth";
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
  LinkRow,
  Heading,
} from "../ui/kit";
export default function Auth() {
  const { c, language } = useCopy(),
    nav = useNavigation<any>(),
    session = useSession(),
    p = privacy[language],
    words = authCopy[language];
  const route = useRoute<any>();
  const [register, setRegister] = useState(!!route.params?.register),
    [acceptedTerms, setAcceptedTerms] = useState(false),
    [visible, setVisible] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [storage, setStorage] = useState(session.pendingChoices?.storage ?? false),
    [ai, setAi] = useState(session.pendingChoices?.ai ?? false);
  return (
    <Page>
      <Body small>{register ? words.registerEyebrow : words.loginEyebrow}</Body>
      <Title>{register ? words.registerTitle : words.loginTitle}</Title>
      <Body>{register ? words.registerSubtitle : words.loginSubtitle}</Body>
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
              secureTextEntry={!visible}
              autoComplete={register ? "new-password" : "current-password"}
            />
            <Button
              secondary
              label={visible ? words.hidePassword : words.showPassword}
              onPress={() => setVisible(!visible)}
            />
            {register && <Body small>{words.passwordHelp}</Body>}
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
        {register && !session.consentPending && (
          <Toggle
            label={c(
              "I agree to the Terms of service",
              "İstifadə şərtlərini qəbul edirəm",
              "Я принимаю Условия использования",
            )}
            value={acceptedTerms}
            onChange={setAcceptedTerms}
          />
        )}
        <LinkRow
          title={words.terms}
          onPress={() =>
            nav.navigate("Information", { page: "terms-of-service" })
          }
        />
        <LinkRow
          title={p.policy}
          onPress={() =>
            nav.navigate("Information", { page: "privacy-policy" })
          }
        />
        {session.consentPending && <Notice danger>{p.saveFailed}</Notice>}
        <Button
          disabled={
            !session.consentPending &&
            (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
              !password ||
              (register &&
                (!name.trim() || password.length < 8 || !acceptedTerms)))
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
      <Heading>
        {words.lineOne} {words.lineTwo} {words.lineThree}
      </Heading>
      <Body>{words.story}</Body>
      <View style={styles.card}>
        <Body small>{words.sample}</Body>
        <Heading>{words.sampleQuestion}</Heading>
        <Body>{words.sampleAnswer}</Body>
      </View>
      <Heading>{words.note}</Heading>
      <Body>{words.noteDetail}</Body>
      <Body small>{words.smallPrint}</Body>
      <LinkRow
        title={words.contact}
        onPress={() => nav.navigate("Information", { page: "contact" })}
      />
    </Page>
  );
}
