import React, { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../core/api";
import { useResource } from "../core/useResource";
import { useCopy } from "../core/copy";
import { useFamily, useSession } from "../core/Session";
import { labApi } from "../api/labs";
import {
  basketTotal,
  money,
  orderRequest,
  type LabDetail,
  type LabTest,
  type LabOrder,
  type Collection,
} from "../api/labModel";
import { canWrite } from "../api/recordModel";
import words from "../copy/labs.json";
import {
  Page,
  Title,
  Body,
  Heading,
  Input,
  Select,
  MemberPicker,
  SignedIn,
  Notice,
  LoadState,
  Button,
  styles,
} from "../ui/kit";
export default function Laboratory() {
  const { slug } = useRoute<any>().params as { slug: string };
  return <LaboratoryScope key={slug} slug={slug} />;
}
function LaboratoryScope({ slug }: { slug: string }) {
  const { language } = useCopy(),
    { user } = useSession();
  const r = useResource(
    `lab:${slug}:${language}`,
    async (s) =>
      (
        await api.get<LabDetail>(`/labs/${encodeURIComponent(slug)}`, {
          params: { lang: language },
          signal: s,
        })
      ).data,
  );
  return (
    <Page>
      <LoadState resource={r} />
      {r.data && (
        <Catalogue
          key={`${r.data.id}:${user?.id || "guest"}:${language}`}
          lab={r.data}
        />
      )}
    </Page>
  );
}
function Catalogue({ lab }: { lab: LabDetail }) {
  const { language } = useCopy(),
    c = words[language],
    f = useFamily(),
    nav = useNavigation<any>();
  const [q, setQ] = useState(""),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<LabTest[]>([]),
    [collection, setCollection] = useState<Collection>("LAB"),
    [address, setAddress] = useState(""),
    [phone, setPhone] = useState(""),
    [success, setSuccess] = useState<{
      order: LabOrder;
      tests: LabTest[];
      name: string;
    } | null>(null);
  const tests = useResource(`labtests:${lab.slug}:${search}:${language}`, (s) =>
    labApi.tests(lab.slug, search, language, s),
  );
  useEffect(() => {
    if (!tests.data) return;
    setSelected((previous) =>
      previous.map((t) => tests.data!.find((r) => r.id === t.id) || t),
    );
  }, [tests.data]);
  const price = (value: number | null) =>
    money(value, language, c.priceUnknown);
  const total = basketTotal(selected, collection, lab.homeCollectionFee);
  if (success)
    return (
      <>
        <Title>{c.received}</Title>
        <Notice>{c.requestNote}</Notice>
        <Heading>{success.name}</Heading>
        <Body>{c[success.order.status]}</Body>
        <Body>
          {success.order.labName} - {c[success.order.collection]}
        </Body>
        {success.order.address && <Body>{success.order.address}</Body>}
        {success.order.contactPhone && (
          <Body>{success.order.contactPhone}</Body>
        )}
        {success.order.items.map((item) => (
          <View key={item.id} style={styles.line}>
            <Heading>{item.name}</Heading>
            <Body>{price(item.price)}</Body>
          </View>
        ))}
        <Heading>
          {c.snapshotPrice}: {price(success.order.totalPrice)}
        </Heading>
        <Body small>{c.priceNotice}</Body>
        <Heading>{c.confirmationPrep}</Heading>
        {success.tests.map((t) => (
          <View key={t.id} style={styles.line}>
            <Heading>{t.name}</Heading>
            <Body>{t.preparation || c.noPreparation}</Body>
          </View>
        ))}
        <Button
          label={c.myOrders}
          onPress={() => nav.navigate("Orders", { kind: "labs" })}
        />
        <Button
          secondary
          label={c.another}
          onPress={() => {
            setSuccess(null);
            setSelected([]);
            setAddress("");
            setPhone("");
          }}
        />
      </>
    );
  return (
    <>
      <Title>{lab.name}</Title>
      <Body>
        {[lab.city, lab.district, lab.address].filter(Boolean).join(", ")}
      </Body>
      {lab.phone && (
        <Button
          secondary
          label={lab.phone}
          onPress={() =>
            Linking.openURL(`tel:${lab.phone!.replace(/[^+\d]/g, "")}`)
          }
        />
      )}
      <Body small>{lab.homeCollection ? c.homeYes : c.homeNo}</Body>
      <Heading>{c.catalogue}</Heading>
      <Input
        label={c.testSearch}
        value={q}
        onChangeText={setQ}
        onSubmitEditing={() => setSearch(q.trim())}
      />
      <Button label={c.search} onPress={() => setSearch(q.trim())} />
      <LoadState resource={tests} />
      {tests.data?.length === 0 && (
        <Notice>{search ? c.noTestMatch : c.noTests}</Notice>
      )}
      {(tests.data || lab.tests).map((test) => {
        const chosen = selected.some((t) => t.id === test.id);
        return (
          <View key={test.id} style={styles.card}>
            <Heading>{test.name}</Heading>
            <Body>{price(test.price)}</Body>
            <Body small>
              {c.sample}: {test.sampleType || c.notSpecified}
            </Body>
            <Body small>
              {c.turnaround}:{" "}
              {test.turnaroundHours == null
                ? c.notSpecified
                : `${test.turnaroundHours} ${c.hours}`}
            </Body>
            <Notice>
              {c.preparation}: {test.preparation || c.noPreparation}
            </Notice>
            <Button
              secondary={!chosen}
              disabled={tests.loading || !!tests.error}
              label={chosen ? c.remove : c.add}
              onPress={() =>
                setSelected((previous) =>
                  chosen
                    ? previous.filter((t) => t.id !== test.id)
                    : [...previous, test],
                )
              }
            />
          </View>
        );
      })}
      <View style={styles.card}>
        <Heading>
          {c.basket} ({selected.length})
        </Heading>
        {!selected.length ? (
          <Body>{c.basketEmpty}</Body>
        ) : (
          <>
            {selected.map((test) => (
              <View key={test.id} style={styles.line}>
                <Body>
                  {test.name} - {price(test.price)}
                </Body>
                <Button
                  secondary
                  label={c.remove}
                  onPress={() =>
                    setSelected((previous) =>
                      previous.filter((t) => t.id !== test.id),
                    )
                  }
                />
              </View>
            ))}
            {collection === "HOME" && (
              <Body>
                {c.homeFee}: {price(lab.homeCollectionFee)}
              </Body>
            )}
            <Heading>
              {total.complete ? c.total : c.knownTotal}: {price(total.known)}
            </Heading>
            {!total.complete && <Notice>{c.unknownNotice}</Notice>}
          </>
        )}
        <Body small>{c.priceNotice}</Body>
        <SignedIn>
          <MemberPicker allowNone={false} />
          {f.member && !canWrite(f.role) ? (
            <Notice>{c.viewer}</Notice>
          ) : (
            <>
              <Select
                label={c.collection}
                value={collection}
                options={[
                  { value: "LAB", label: c.LAB },
                  ...(lab.homeCollection
                    ? [{ value: "HOME", label: c.HOME }]
                    : []),
                ]}
                onChange={(v) => setCollection(v as Collection)}
              />
              {collection === "HOME" && (
                <>
                  <Input
                    label={c.address}
                    value={address}
                    onChangeText={setAddress}
                    autoComplete="street-address"
                  />
                  <Input
                    label={c.contactPhone}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </>
              )}
              <Notice>{c.requestNote}</Notice>
              <Button
                label={c.submit}
                disabled={
                  !f.member ||
                  !canWrite(f.role) ||
                  !selected.length ||
                  tests.loading ||
                  !!tests.error ||
                  (collection === "HOME" && (!address.trim() || !phone.trim()))
                }
                onPress={async () => {
                  if (!f.member || !canWrite(f.role)) return;
                  const member = f.member;
                  const snapshot = [...selected];
                  const order = await labApi.create(
                    member.id,
                    orderRequest(lab.id, snapshot, collection, address, phone),
                  );
                  setSuccess({ order, tests: snapshot, name: member.fullName });
                }}
              />
            </>
          )}
        </SignedIn>
      </View>
    </>
  );
}
