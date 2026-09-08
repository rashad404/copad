import React, { useState, useRef } from "react";
import { Image, View, Text, Linking, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSession } from "../core/Session";
import { useCopy } from "../core/copy";
import { plain } from "../core/websiteCopy";
import home from "../copy/website/home.json";
import { Disclosure } from "./Information";
import {
  Page,
  Title,
  Heading,
  Body,
  Button,
  LinkRow,
  Toggle,
  Select,
  Notice,
  styles,
  palette,
} from "../ui/kit";
export default function Home() {
  const { language, c: copy } = useCopy(),
    nav = useNavigation<any>(),
    session = useSession();
  const c = Object.fromEntries(
    Object.entries(home[language]).map(([k, v]) => [k, plain(v)]),
  ) as typeof home.az;
  const [step, setStep] = useState(0),
    [time, setTime] = useState("10:00"),
    [share, setShare] = useState(false),
    [family, setFamily] = useState<"self" | "child" | "parent">("self");
  const scrollRef = useRef<ScrollView>(null),
    journeyTop = useRef(0);
  const showJourney = () =>
    scrollRef.current?.scrollTo({ y: journeyTop.current, animated: true });
  return (
    <Page scrollRef={scrollRef}>
      {session.consentPending && (
        <Button
          label={copy(
            "Finish consent choices",
            "Razılıq seçimlərini tamamla",
            "Завершить выбор согласий",
          )}
          onPress={() => nav.navigate("Auth")}
        />
      )}
      {session.deletionReceipt && (
        <Notice>
          {copy(
            "Your account was deleted. Records removed:",
            "Hesabınız silindi. Silinən qeydlər:",
            "Аккаунт удален. Удаленные записи:",
          )}{" "}
          {Object.entries(session.deletionReceipt.removed || {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")}
        </Notice>
      )}
      {session.user && (
        <View style={styles.line}>
          <Heading>{c.welcome}</Heading>
          <LinkRow
            title={c.continueChat}
            onPress={() => nav.navigate("Chat")}
          />
          <LinkRow
            title={c.recordsAction}
            onPress={() => nav.navigate("Records")}
          />
          <LinkRow
            title={c.appointmentsAction}
            onPress={() => nav.navigate("Orders", { kind: "bookings" })}
          />
          <LinkRow
            title={copy("My overview", "Hesabım", "Обзор аккаунта")}
            onPress={() => nav.navigate("Dashboard")}
          />
        </View>
      )}
      <Body small>{c.eyebrow}</Body>
      <Title>
        {c.heroLine1}
        {"\n"}
        {c.heroLine2}
        {"\n"}
        {c.heroLine3}
      </Title>
      <Body>{c.heroBody}</Body>
      <Button label={c.ask} onPress={() => nav.navigate("Chat")} />
      <Button secondary label={c.seeHow} onPress={showJourney} />
      {!session.user && <Body small>{c.guestNote}</Body>}
      <Image
        source={require("../../assets/home/time-together.jpg")}
        style={{ width: "100%", height: 340, borderRadius: 20 }}
        accessibilityLabel={c.heroAlt}
      />
      <Text
        style={styles.muted}
        accessibilityRole="link"
        onPress={() =>
          void Linking.openURL(
            "https://www.pexels.com/photo/happy-mother-and-daughter-walking-in-the-park-17066530/",
          )
        }
      >
        {c.photoLabel} - Danik Prihodko
      </Text>
      <View style={styles.card}>
        <Body small>{c.sample}</Body>
        <Heading>{c.appointmentConfirmed}</Heading>
        <Body>
          {c.appointmentDate}, {time}
        </Body>
        <Button secondary label={c.seeJourney} onPress={showJourney} />
        <Body small>{c.demoCaption}</Body>
      </View>
      <View style={styles.line}>
        <Body small>{c.recognitionLabel}</Body>
        <Heading>{c.recognitionTitle}</Heading>
        <Body>{c.recognitionBody}</Body>
        <Heading>{c.recognitionResolution}</Heading>
      </View>
      <View
        onLayout={(event) => {
          journeyTop.current = event.nativeEvent.layout.y;
        }}
      >
        <Body small>{c.journeyLabel}</Body>
      </View>
      <Title>{c.journeyTitle}</Title>
      <Body>{c.journeyBody}</Body>
      <Select
        label={c.journeyGroup}
        value={String(step)}
        options={[0, 1, 2].map((i) => ({
          value: String(i),
          label: `${i + 1}. ${c[`step${i}Title` as keyof typeof c]}`,
        }))}
        onChange={(v) => setStep(Number(v))}
      />
      <Heading>{c[`step${step}Title` as keyof typeof c]}</Heading>
      <Body>{c[`step${step}Body` as keyof typeof c]}</Body>
      <View style={[styles.card, { backgroundColor: palette.sage }]}>
        <View style={styles.spread}>
          <Heading>azdoc</Heading>
          <Body small>{c.sample}</Body>
        </View>
        <Body>{c.demoPerson}</Body>
        {step === 0 ? (
          <>
            <Body small>{c.contextLabel}</Body>
            <Body>
              {c.lab} - {c.medication}
            </Body>
            <View style={styles.card}>
              <Body>{c.question}</Body>
            </View>
            <Body>{c.answer}</Body>
            <Body small>{c.answerSource}</Body>
            <Button label={c.showTimes} onPress={() => setStep(1)} />
          </>
        ) : step === 1 ? (
          <>
            <Heading>{c.doctorType}</Heading>
            <Body>{c.clinic}</Body>
            <Body>{c.appointmentDate}</Body>
            <Select
              label={c.chooseTime}
              value={time}
              options={["10:00", "11:30", "14:00"].map((t) => ({
                value: t,
                label: t,
              }))}
              onChange={setTime}
            />
            <Body>
              {c.timeSelected}: {time}
            </Body>
            <Body small>{c.requestNote}</Body>
            <Button label={c.nextExample} onPress={() => setStep(2)} />
          </>
        ) : (
          <>
            <Heading>{c.confirmedByDoctor}</Heading>
            <Body>
              {c.appointmentDate}, {time}
            </Body>
            <Body>
              {c.doctorType} / {c.demoPerson}
            </Body>
            <Heading>{c.summary}</Heading>
            {[c.lab, c.medication, c.measurements].map((t) => (
              <View style={styles.line} key={t}>
                <Body>{t}</Body>
                <Body small>{c.inSummary}</Body>
              </View>
            ))}
            <Toggle label={c.share} value={share} onChange={setShare} />
            <Body small>{share ? c.sharedExample : c.privateExample}</Body>
            <Button
              label={c.findDoctor}
              onPress={() => nav.navigate("Directory", { kind: "doctors" })}
            />
          </>
        )}
        <Body small>{c.demoCaption}</Body>
      </View>
      <Body small>{c.familyLabel}</Body>
      <Title>{c.familyTitle}</Title>
      <Body>{c.familyBody}</Body>
      <Image
        source={require("../../assets/home/family-afternoon.jpg")}
        style={{ width: "100%", height: 280, borderRadius: 20 }}
        accessibilityLabel={c.familyAlt}
      />
      <Text
        style={styles.muted}
        accessibilityRole="link"
        onPress={() =>
          void Linking.openURL(
            "https://www.pexels.com/photo/smiling-mother-playing-with-daughter-at-park-20806575/",
          )
        }
      >
        {c.photoLabel} - Anastasia Nagibina
      </Text>
      <Select
        label={c.familyGroup}
        value={family}
        options={(["self", "child", "parent"] as const).map((value) => ({
          value,
          label: c[value],
        }))}
        onChange={(v) => setFamily(v as typeof family)}
      />
      <Heading>{c[`${family}Title`]}</Heading>
      <Body>{c[`${family}Body`]}</Body>
      <Button
        label={session.user ? c.recordsAction : c.familyAction}
        onPress={() =>
          session.user
            ? nav.navigate("Records")
            : nav.navigate("Auth", { register: true })
        }
      />
      <Body small>{c.ongoingLabel}</Body>
      <Title>{c.ongoingTitle}</Title>
      <Body>{c.ongoingBody}</Body>
      {[0, 1, 2].map((i) => (
        <View style={styles.line} key={i}>
          <Heading>{c[`follow${i}Title` as keyof typeof c]}</Heading>
          <Body>{c[`follow${i}Body` as keyof typeof c]}</Body>
        </View>
      ))}
      <LinkRow
        title={c.compareMedicines}
        onPress={() => nav.navigate("Directory", { kind: "medicines" })}
      />
      <View style={[styles.card, { backgroundColor: palette.sage }]}>
        <Heading>{c.privacyTitle}</Heading>
        <Body>{c.privacyBody}</Body>
        <LinkRow
          title={c.privacyAction}
          onPress={() =>
            nav.navigate("Information", { page: "privacy-policy" })
          }
        />
      </View>
      <Heading>{c.faqTitle}</Heading>
      {[1, 2, 3, 4].map((i) => (
        <Disclosure key={i} title={c[`faq${i}q` as keyof typeof c]}>
          <Body>{c[`faq${i}a` as keyof typeof c]}</Body>
        </Disclosure>
      ))}
      <Title>{c.closingTitle}</Title>
      <Body>{c.closingBody}</Body>
      <Button label={c.ask} onPress={() => nav.navigate("Chat")} />
    </Page>
  );
}
