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
  SignedIn,
  Button,
  LinkRow,
  MemberPicker,
  LoadState,
  Notice,
  styles,
  palette,
} from "../ui/kit";
export default function Dashboard() {
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
      <SignedIn>
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
        <Body small>{c("Your space", "Hesabınız", "Ваш аккаунт")}</Body>
        <Title>
          {c("Hello", "Salam", "Здравствуйте")}
          {user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </Title>
        <Body>
          {c(
            "Pick up a conversation, ask something new, or update the details that matter to you.",
            "Söhbətlərinizə keçin və ya ailənizin sağlamlıq qeydlərinə baxın.",
            "Продолжите разговор, задайте новый вопрос или обновите медицинские записи семьи.",
          )}
        </Body>
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
        <View style={styles.card}>
          <Heading>{user?.name}</Heading>
          <Body>{user?.email}</Body>
          <Body>
            {c(
              "Keep your personal and medical information up to date.",
              "Şəxsi və tibbi məlumatlarınızı yeniləyin.",
              "Обновляйте личные и медицинские данные.",
            )}
          </Body>
          <LinkRow
            title={c("View profile", "Profilə bax", "Открыть профиль")}
            onPress={() => nav.navigate("Profile")}
          />
        </View>
        <LinkRow
          title={c(
            "Health records",
            "Sağlamlıq qeydləri",
            "Медицинские записи",
          )}
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
        <LinkRow
          title={c("Useful reading", "Faydalı məlumatlar", "Полезные статьи")}
          onPress={() => nav.navigate("Blog")}
        />
        <LinkRow
          title={c(
            "Privacy policy",
            "Məxfilik siyasəti",
            "Политика конфиденциальности",
          )}
          onPress={() =>
            nav.navigate("Information", { page: "privacy-policy" })
          }
        />
      </SignedIn>
    </Page>
  );
}
