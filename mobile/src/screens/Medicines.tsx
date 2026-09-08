import React, { useState } from "react";
import { View, Text, Pressable, Keyboard, Share } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { useMedicineCopy } from "../core/websiteCopy";
import { useSession, useFamily } from "../core/Session";
import { useResource } from "../core/useResource";
import {
  type MedicineSummary,
  type MedicineDetail,
  checkMedicineAllergies,
} from "../api/medicines";
import { money } from "../api/labModel";
import {
  Page,
  Title,
  Heading,
  Body,
  Input,
  Button,
  Notice,
  LoadState,
  MemberPicker,
  styles,
  palette,
} from "../ui/kit";
export const searchExamples = [
  "Parasetamol",
  "İbuprofen",
  "Diklofenak",
  "Amoksisillin",
  "Azitromisin",
  "Omeprazol",
  "Pantoprazol",
  "Amlodipin",
  "Metformin",
  "Loratadin",
  "Setirizin",
  "Rosuvastatin",
];
export const medicineQuery = (q: string) => q.trim().slice(0, 120);
export const priceOrder = (a: MedicineSummary, b: MedicineSummary) =>
  (a.lowestPrice ?? Infinity) - (b.lowestPrice ?? Infinity) ||
  a.name.localeCompare(b.name, "az", { sensitivity: "base" });
const difference = (a: number | null, b: number | null) =>
  a != null && b != null && a > b ? Math.round((a - b) * 100) / 100 : null;
export function Medicines() {
  const mc = useMedicineCopy(),
    { language } = useCopy();
  const [input, setInput] = useState(""),
    [query, setQuery] = useState("");
  const results = useResource(
    query.length >= 2 ? `medicines:${language}:${query}` : null,
    async (signal) =>
      (
        await api.get<MedicineSummary[]>("/medicines", {
          params: { q: query, limit: 50, lang: language },
          signal,
        })
      ).data,
  );
  function search(value: string) {
    setInput(value);
    setQuery(medicineQuery(value));
    Keyboard.dismiss();
  }
  return (
    <Page>
      {query ? (
        <Title>{mc("Dərman kataloqu")}</Title>
      ) : (
        <>
          <Body small>{mc("DƏRMAN KATALOQU")}</Body>
          <Title>
            {mc("Dərmanı tapın.")}
            {"\n"}
            {mc("Qiyməti müqayisə edin.")}
          </Title>
          <Body>
            {mc(
              "Adına və ya təsiredici maddəsinə görə axtarın. Müxtəlif qablaşdırmaların qiymətinə və oxşar tərkibli dərmanlara baxın.",
            )}
          </Body>
        </>
      )}
      <Input
        label={mc("Dərman və ya təsiredici maddə")}
        placeholder={mc("Məsələn, İbuprofen")}
        value={input}
        onChangeText={setInput}
        maxLength={120}
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={() => search(input)}
      />
      <Button label={mc("Axtar")} onPress={() => search(input)} />
      <LoadState resource={results} />
      {query.length < 2 ? (
        <>
          <Heading>{mc("Axtarış nümunələri")}</Heading>
          <Body>
            {mc(
              "Dərmanın ticarət adını və ya qutuda yazılan təsiredici maddəni daxil edin. Axtarış üçün ən azı 2 hərf lazımdır.",
            )}
          </Body>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {searchExamples.map((name) => (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityLabel={name}
                onPress={() => search(name)}
                style={({ pressed }) => ({
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: palette.line,
                  backgroundColor: pressed ? palette.sage : palette.paper,
                })}
              >
                <Text style={styles.text}>{name}</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.card, { backgroundColor: palette.sage }]}>
            <Heading>
              {mc("Eyni maddə.")} {mc("Fərqli qiymətlər.")}
            </Heading>
            <Body>
              {mc(
                "Qiymətlə yanaşı dozanı, dərman formasını və qablaşdırmanı da müqayisə edin.",
              )}
            </Body>
          </View>
        </>
      ) : (
        results.data && (
          <>
            <Heading>
              {'"'}
              {query}
              {mc("&quot; üçün nəticələr")}
            </Heading>
            <Body small>
              {results.data.length}
              {results.data.length === 50 ? "+" : ""} {mc("nəticə")}
            </Body>
            {!results.data.length ? (
              <Body>
                {mc(
                  "Nəticə tapılmadı. Dərmanın digər adını və ya təsiredici maddəsini yoxlayın.",
                )}
              </Body>
            ) : (
              <Body small>
                {mc(
                  "Axtarışa uyğunluğa görə sıralanıb. Qiymətlər qablaşdırmalara aiddir.",
                )}
              </Body>
            )}
            {results.data.map((m) => (
              <MedicineRow key={m.id} medicine={m} />
            ))}
            {results.data.length === 50 && (
              <Body>
                {mc("Daha dəqiq nəticə üçün dərmanın tam adını yazın.")}
              </Body>
            )}
          </>
        )
      )}
      <Body small>
        {mc(
          "Bu kataloq məlumat üçündür. Dərman seçimi və dəyişdirilməsi barədə həkim və ya əczaçı ilə məsləhətləşin. Qiymət məlumatı aptekdə mövcudluq zəmanəti deyil.",
        )}
      </Body>
    </Page>
  );
}
function MedicineRow({
  medicine: m,
  current,
  alternative = false,
}: {
  medicine: MedicineSummary;
  current?: number | null;
  alternative?: boolean;
}) {
  const nav = useNavigation<any>(),
    mc = useMedicineCopy(),
    { language } = useCopy();
  const price = (n: number | null) =>
    money(n, language, mc("qiymət yoxdur")).replace(" AZN", " ₼");
  const diff = difference(current ?? null, m.lowestPrice);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={m.name}
      onPress={() => nav.push("Medicine", { slug: m.slug })}
      style={({ pressed }) => [
        styles.line,
        { gap: 8, opacity: pressed ? 0.65 : 1 },
      ]}
    >
      <Heading>{m.name}</Heading>
      <Body>{m.activeIngredient || mc("Təsiredici maddə qeyd edilməyib")}</Body>
      {alternative && (
        <Body small>{m.manufacturer || mc("İstehsalçı qeyd edilməyib")}</Body>
      )}
      <View style={styles.spread}>
        <Body small>
          {m.priceCount} {mc("qablaşdırma variantı")}
        </Body>
        <Heading>{price(m.lowestPrice)}</Heading>
      </View>
      {diff != null ? (
        <Body small>
          {price(diff)} {mc("qiymət fərqi")}
        </Body>
      ) : (
        m.lowestPrice != null && <Body small>{mc("ən aşağı qiymət")}</Body>
      )}
    </Pressable>
  );
}
export function Medicine() {
  const { slug } = useRoute<any>().params;
  return <MedicineScope key={slug} slug={slug} />;
}
function MedicineScope({ slug }: { slug: string }) {
  const mc = useMedicineCopy(),
    { c, language } = useCopy(),
    { user } = useSession(),
    f = useFamily();
  const r = useResource(
    `medicine:${slug}:${language}`,
    async (signal) =>
      (
        await api.get<MedicineDetail>(
          `/medicines/${encodeURIComponent(slug)}`,
          { params: { lang: language }, signal },
        )
      ).data,
  );
  const warning = useResource(
    user && f.member && r.data
      ? `allergy:${user.id}:${f.member.id}:${r.data.id}`
      : null,
    (signal) => checkMedicineAllergies(r.data!.id, f.member!.id, signal),
  );
  const d = r.data,
    price = (n: number | null) =>
      money(n, language, mc("qiymət yoxdur")).replace(" AZN", " ₼");
  const prices = [...(d?.prices || [])].sort(
    (a, b) => (a.retailPrice ?? Infinity) - (b.retailPrice ?? Infinity),
  );
  const min = prices.find((p) => p.retailPrice != null)?.retailPrice ?? null,
    alternatives = [...(d?.alternatives || [])].sort(priceOrder),
    best = alternatives[0],
    diff = best ? difference(min, best.lowestPrice) : null;
  function prescription(value: string | null) {
    if (!value) return mc("Resept statusu qeyd edilməyib");
    const v = value.trim().toLocaleLowerCase("az");
    return [
      "reseptsiz",
      "otc",
      "non-prescription",
      "over the counter",
    ].includes(v)
      ? mc("Reseptsiz")
      : [
            "reseptlə",
            "reseptli",
            "prescription",
            "prescription only",
            "rx",
          ].includes(v)
        ? mc("Reseptlə")
        : value;
  }
  return (
    <Page>
      <LoadState resource={r} />
      {d && (
        <>
          <Body small>{mc("DƏRMAN HAQQINDA")}</Body>
          <Title>{d.name}</Title>
          <Body>
            {d.active_ingredient || mc("Təsiredici maddə qeyd edilməyib")}
          </Body>
          <Body>{d.manufacturer || mc("İstehsalçı qeyd edilməyib")}</Body>
          <Body small>{prescription(d.prescription_status)}</Body>
          <View style={[styles.card, { backgroundColor: palette.sage }]}>
            <Body>{mc("Ən ucuz qablaşdırma")}</Body>
            <Title>{price(min)}</Title>
            <Body small>
              {prices.length} {mc("qablaşdırma variantı")}
            </Body>
          </View>
          <MemberPicker />
          <LoadState resource={warning} />
          {warning.data?.map((w, i) => (
            <Notice danger key={i}>
              {w.critical
                ? c(
                    "Life-threatening allergy risk",
                    "Həyati təhlükəli allergiya riski",
                    "Риск аллергии с угрозой для жизни",
                  )
                : c(
                    "Possible allergy conflict",
                    "Mümkün allergiya riski",
                    "Возможный риск аллергии",
                  )}
              : {w.allergen}. {w.medicineName}.{" "}
              {w.basis === "CLASS"
                ? c(
                    "Drug-class match.",
                    "Dərman qrupu uyğun gəlir.",
                    "Совпадение по группе препаратов.",
                  )
                : c(
                    "Ingredient match.",
                    "Təsiredici maddə uyğun gəlir.",
                    "Совпадение по действующему веществу.",
                  )}{" "}
              {c(
                "This is advisory and does not replace a doctor or pharmacist.",
                "Bu xəbərdarlıq məlumat üçündür, həkim və ya əczaçı məsləhətini əvəz etmir.",
                "Предупреждение носит справочный характер и не заменяет консультацию врача или фармацевта.",
              )}
            </Notice>
          ))}
          <Body small>{mc("DİGƏR DƏRMANLARLA MÜQAYİSƏ")}</Body>
          <Heading>{mc("Eyni maddəni ehtiva edən dərmanlar")}</Heading>
          <Body>
            {mc(
              "Ən ucuz qablaşdırmalar əvvəl göstərilir. Bu dərmanlarda ən azı bir təsiredici maddə eynidir, amma tam tərkib, doza və dərman forması fərqlənə bilər. Dərmanı dəyişməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.",
            )}
          </Body>
          {diff != null && (
            <View style={[styles.card, { backgroundColor: palette.sage }]}>
              <Heading>{mc("Ən ucuz qablaşdırmaların qiymət fərqi")}</Heading>
              <Title>{price(diff)}</Title>
              <Body>
                {d.name}: {price(min)}
                {"\n"}
                {best.name}: {price(best.lowestPrice)}
              </Body>
              <Body small>
                {mc(
                  "Qablaşdırma qiyməti fərqidir; eyni doza üzrə hesablanmış qənaət deyil.",
                )}
              </Body>
            </View>
          )}
          {alternatives.map((a) => (
            <MedicineRow key={a.id} medicine={a} current={min} alternative />
          ))}
          {!alternatives.length && (
            <Body>{mc("Bu dərman üçün alternativ məlumatı yoxdur.")}</Body>
          )}
          <Heading>{mc("Qablaşdırma və qiymətlər")}</Heading>
          <Body small>{mc("AZN · ucuzdan bahaya")}</Body>
          {prices.map((p, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.spread}>
                <Heading>{p.tradeName}</Heading>
                <Heading>{price(p.retailPrice)}</Heading>
              </View>
              <Body>{p.manufacturer || mc("Qeyd edilməyib")}</Body>
              <Body>
                {mc("Doza və forma")}:{" "}
                {[p.dosage || mc("Qeyd edilməyib"), p.form]
                  .filter(Boolean)
                  .join(", ")}
              </Body>
              <Body>
                {mc("Qablaşdırma")}: {p.packaging || mc("Qeyd edilməyib")}
              </Body>
            </View>
          ))}
          {!prices.length && <Body>{mc("qiymət yoxdur")}</Body>}
          <Body small>
            {mc(
              "Qiymətlər aptekdə mövcudluq zəmanəti deyil. Qablaşdırmadakı vahid sayı bu məlumatda təqdim olunmur; alış zamanı dəqiqləşdirin.",
            )}
          </Body>
          {(d.release_form || d.description_az) && (
            <>
              <Heading>{mc("Əlavə məlumat")}</Heading>
              {d.release_form && (
                <Body>
                  {mc("Buraxılış forması:")} {d.release_form}
                </Body>
              )}
              {d.description_az && <Body>{d.description_az}</Body>}
            </>
          )}
          <Body small>
            {mc(
              "Bu səhifə məlumat üçündür və fərdi tibbi məsləhət deyil. Dərmanı qəbul etməzdən və ya dəyişməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.",
            )}
          </Body>
          <Button
            secondary
            label={c("Share", "Paylaş", "Поделиться")}
            onPress={async () => {
              await Share.share({
                message: `${d.name}\nhttps://azdoc.ai/dermanlar/${encodeURIComponent(d.slug)}`,
              });
            }}
          />
        </>
      )}
    </Page>
  );
}
