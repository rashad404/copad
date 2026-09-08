import React from "react";
import { SyncResult } from "./ConnectedSources";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useSession, useFamily } from "../core/Session";
import { useResource } from "../core/useResource";
import { healthApi } from "../api/healthRecord";
import { documentsApi } from "../api/documents";
import {
  Body,
  Title,
  Heading,
  Page,
  Button,
  LinkRow,
  MemberPicker,
  LoadState,
  Notice,
  styles,
  palette,
} from "../ui/kit";
export default function Home() {
  const { c } = useCopy(),
    nav = useNavigation<any>(),
    { user, deletionReceipt, consentPending } = useSession(),
    f = useFamily();
  const overview = useResource(
    user && f.member ? `home:${user.id}:${f.member.id}` : null,
    async (s) => {
      const [allergies, pendingLabs, pendingMedications] = await Promise.all([
        healthApi.list(f.member!.id, "allergies", s),
        documentsApi.pendingLabs(f.member!.id, s),
        documentsApi.pendingMedications(f.member!.id, s),
      ]);
      return {
        allergies: allergies.filter((a) => a.critical === true),
        pending: pendingLabs.length + pendingMedications.length,
      };
    },
  );
  return (
    <Page>
      {consentPending && (
        <Button
          label={c(
            "Finish consent choices",
            "Razılıq seçimlərini tamamla",
            "Завершить выбор согласий",
          )}
          onPress={() => nav.navigate("Auth")}
        />
      )}
      {deletionReceipt && (
        <Notice>
          {c(
            "Your account was deleted. Records removed:",
            "Hesabınız silindi. Silinən qeydlər:",
            "Аккаунт удален. Удаленные записи:",
          )}{" "}
          {Object.entries(deletionReceipt.removed || {})
            .map(([name, count]) => `${name}: ${count}`)
            .join(", ")}
        </Notice>
      )}
      <Body small>
        {c(
          "Your virtual doctor",
          "Sizin virtual həkiminiz",
          "Ваш виртуальный врач",
        )}
      </Body>
      <Title>
        {user
          ? c(
              "Your health, today",
              "Sağlamlığınız bu gün",
              "Ваше здоровье сегодня",
            )
          : c(
              "For you and your family",
              "Sizin və ailəniz üçün",
              "Для вас и вашей семьи",
            )}
      </Title>
      <MemberPicker />
      <SyncResult compact />
      <View
        style={[
          styles.card,
          { backgroundColor: palette.sage, padding: 24, gap: 18 },
        ]}
      >
        <Heading>
          {c(
            "A health question on your mind?",
            "Sağlamlığınızla bağlı sualınız var?",
            "Есть вопрос о здоровье?",
          )}
        </Heading>
        <Body>
          {c(
            "Ask azdoc about symptoms, test results or medicines.",
            "Əlamətlər, analiz nəticələri və ya dərmanlar haqqında azdoc-a sual verin.",
            "Спросите azdoc о симптомах, результатах анализов или лекарствах.",
          )}
        </Body>
        <Button
          label={c("Ask a question", "Sual ver", "Задать вопрос")}
          onPress={() => nav.navigate("Chat")}
        />
      </View>
      {user && f.member && (
        <>
          <Heading>{f.member.fullName}</Heading>
          <LoadState resource={overview} />
          {overview.data?.allergies.map((a) => (
            <Notice key={a.id} danger>
              {c(
                "Life-threatening allergy",
                "Həyati təhlükəli allergiya",
                "Аллергия с угрозой для жизни",
              )}
              : {String(a.allergen)}
            </Notice>
          ))}
          {!!overview.data?.pending && (
            <LinkRow
              title={c(
                `${overview.data.pending} results need review`,
                `${overview.data.pending} nəticə yoxlama gözləyir`,
                `${overview.data.pending} результатов ожидают проверки`,
              )}
              onPress={() => nav.navigate("Records")}
            />
          )}
        </>
      )}
      <LinkRow
        title={c("Health records", "Sağlamlıq qeydləri", "Медицинские записи")}
        detail={c(
          "Documents, medicines and measurements for each family member",
          "Hər ailə üzvünün sənədləri, dərmanları və ölçmələri",
          "Документы, лекарства и показатели каждого члена семьи",
        )}
        onPress={() => nav.navigate("Records")}
      />
      <LinkRow
        title={c("Find a doctor", "Həkim tap", "Найти врача")}
        detail={c(
          "Choose by specialty and clinic",
          "İxtisasa və klinikaya görə seçin",
          "Выберите специальность и клинику",
        )}
        onPress={() => nav.navigate("Directory", { kind: "doctors" })}
      />
      <LinkRow
        title={c("Order lab tests", "Analiz sifariş et", "Заказать анализы")}
        detail={c(
          "Compare prices and preparation instructions",
          "Qiymətlərə və hazırlıq qaydalarına baxın",
          "Посмотрите цены и правила подготовки",
        )}
        onPress={() => nav.navigate("Directory", { kind: "labs" })}
      />
    </Page>
  );
}
