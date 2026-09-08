import React, { useState, useRef } from "react";
import { View, Pressable, Text, Linking, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useWebsiteCopy } from "../core/websiteCopy";
import {
  Page,
  Title,
  Heading,
  Body,
  Button,
  LinkRow,
  Select,
  styles,
  palette,
} from "../ui/kit";
export function Disclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.line}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={[styles.spread, { paddingVertical: 12 }]}
      >
        <Text style={[styles.heading, { flex: 1 }]}>{title}</Text>
        <Text style={styles.heading}>{open ? "-" : "+"}</Text>
      </Pressable>
      {open && <View style={{ gap: 14, paddingVertical: 8 }}>{children}</View>}
    </View>
  );
}
const sections: Record<string, string[]> = {
  privacy: [
    "owner",
    "information",
    "usage",
    "transfer",
    "recipients",
    "retention",
    "security",
    "rights",
    "contact",
  ],
  security: [
    "dataProtection",
    "encryption",
    "access",
    "compliance",
    "monitoring",
    "contact",
  ],
  terms: [
    "acceptance",
    "services",
    "userResponsibilities",
    "limitations",
    "intellectualProperty",
    "liability",
    "changes",
    "contact",
  ],
};
export default function Information() {
  const { page } = useRoute<any>().params,
    nav = useNavigation<any>(),
    t = useWebsiteCopy(),
    { c } = useCopy();
  const ns =
    page === "privacy-policy"
      ? "privacy"
      : page === "terms-of-service"
        ? "terms"
        : page;
  const scrollRef = useRef<ScrollView>(null),
    offsets = useRef<Record<string, number>>({});
  const [section, setSection] = useState("");
  return (
    <Page scrollRef={scrollRef}>
      <Title>{t(`${ns}.title`)}</Title>
      <Body>
        {t(
          `${ns}.${["contact", "faq"].includes(ns) ? "subtitle" : "introduction"}`,
        )}
      </Body>
      {sections[ns] && (
        <Select
          label={c("On this page", "Bu səhifədə", "На этой странице")}
          value={section}
          options={[
            {
              value: "",
              label: c("Choose a section", "Bölmə seçin", "Выберите раздел"),
            },
            ...sections[ns].map((key) => ({
              value: key,
              label: t(`${ns}.${key}.title`),
            })),
          ]}
          onChange={(key) => {
            setSection(key);
            scrollRef.current?.scrollTo({
              y: offsets.current[key] || 0,
              animated: true,
            });
          }}
        />
      )}
      {sections[ns]?.map((key, i) => (
        <View
          style={styles.line}
          key={key}
          onLayout={(event) => {
            offsets.current[key] = event.nativeEvent.layout.y;
          }}
        >
          <Body small>{String(i + 1).padStart(2, "0")}</Body>
          <Heading>{t(`${ns}.${key}.title`)}</Heading>
          <Body>{t(`${ns}.${key}.description`)}</Body>
          {ns === "privacy" && key === "rights" && (
            <Button
              label={c(
                "Privacy and consent",
                "Məxfilik və razılıqlar",
                "Конфиденциальность и согласия",
              )}
              onPress={() => nav.navigate("Privacy")}
            />
          )}{" "}
          {ns === "privacy" && key === "transfer" && (
            <LinkRow
              title="OpenAI"
              onPress={() =>
                void Linking.openURL("https://openai.com/business-data/")
              }
            />
          )}{" "}
          {key === "contact" && (
            <LinkRow
              title="info@azdoc.ai"
              onPress={() => void Linking.openURL("mailto:info@azdoc.ai")}
            />
          )}
        </View>
      ))}
      {ns === "about" && (
        <>
          <View style={[styles.card, { backgroundColor: palette.sage }]}>
            <Heading>
              {c(
                "Health questions deserve a thoughtful conversation.",
                "Analiz cavabında başa düşmədiyiniz termin var? Soruşun.",
                "Вопросы о здоровье заслуживают внимательного разговора.",
              )}
            </Heading>
            <Button
              label={c(
                "Start a conversation",
                "Söhbətə başla",
                "Начать разговор",
              )}
              onPress={() => nav.navigate("Chat")}
            />
          </View>
          {["mission", "vision"].map((key) => (
            <View style={styles.line} key={key}>
              <Heading>{t(`about.${key}.title`)}</Heading>
              <Body>{t(`about.${key}.description`)}</Body>
            </View>
          ))}
          <Heading>{t("about.values.title")}</Heading>
          {["innovation", "quality", "accessibility", "privacy"].map(
            (key, i) => (
              <View key={key} style={styles.line}>
                <Body small>{i + 1}</Body>
                <Body>{t(`about.values.items.${key}`)}</Body>
              </View>
            ),
          )}
        </>
      )}
      {ns === "contact" && (
        <>
          {["email", "support", "medicalNote"].map((key) => (
            <View style={styles.line} key={key}>
              <Heading>{t(`contact.${key}.title`)}</Heading>
              <Body>{t(`contact.${key}.description`)}</Body>
              {key === "email" && (
                <LinkRow
                  title="info@azdoc.ai"
                  onPress={() => void Linking.openURL("mailto:info@azdoc.ai")}
                />
              )}
            </View>
          ))}
          <Button
            label={c("Ask azdoc", "Sual ver", "Спросить azdoc")}
            onPress={() => nav.navigate("Chat")}
          />
          <LinkRow
            title={t("faq.title")}
            onPress={() => nav.push("Information", { page: "faq" })}
          />
          <Body small>{t("contact.note")}</Body>
        </>
      )}
      {ns === "faq" && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <Disclosure key={i} title={t(`faq.questions.${i}.question`)}>
              <Body>{t(`faq.questions.${i}.answer`)}</Body>
            </Disclosure>
          ))}
          <LinkRow
            title={c(
              "Still have a question?",
              "Başqa sualınız var?",
              "Остались вопросы?",
            )}
            onPress={() => nav.push("Information", { page: "contact" })}
          />
        </>
      )}
    </Page>
  );
}
