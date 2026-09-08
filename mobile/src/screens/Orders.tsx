import React, { useState } from "react";
import { View, Linking } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useCopy } from "../core/copy";
import { useResource } from "../core/useResource";
import { useSession } from "../core/Session";
import { healthApi, type Member, type FamilyRole } from "../api/healthRecord";
import { canWrite } from "../api/recordModel";
import { labApi } from "../api/labs";
import { listBookings, cancelBooking, type Booking } from "../api/booking";
import { money, terminal, cancellable, type LabOrder } from "../api/labModel";
import { shortDate } from "../utils/dates";
import words from "../copy/labs.json";
import {
  Page,
  Title,
  Body,
  Heading,
  SignedIn,
  Button,
  Confirm,
  Notice,
  LoadState,
  styles,
} from "../ui/kit";
type Row = { member: Member; role: FamilyRole; order: Booking | LabOrder };
export default function Orders() {
  const { kind } = useRoute<any>().params as { kind: "bookings" | "labs" };
  return (
    <Page>
      <SignedIn>
        <OrderList key={kind} kind={kind} />
      </SignedIn>
    </Page>
  );
}
function OrderList({ kind }: { kind: "bookings" | "labs" }) {
  const { c, language } = useCopy(),
    { user } = useSession(),
    w = words[language];
  const [cancel, setCancel] = useState<Row | null>(null);
  const r = useResource(`orders:${user!.id}:${kind}`, async (signal) => {
    const families = await healthApi.families(signal);
    const requests = families.flatMap((f) =>
      f.members.map(async (member) => {
        const rows =
          kind === "labs"
            ? await labApi.orders(member.id, signal)
            : await listBookings(member.id, signal);
        return rows.map((order) => ({ member, role: f.role, order }));
      }),
    );
    const results = await Promise.allSettled(requests);
    const failures = results.filter((r) => r.status === "rejected").length;
    if (failures && failures === results.length) throw Error("REQUEST_FAILED");
    return {
      rows: results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])),
      partial: failures > 0,
    };
  });
  const status = (value: string) =>
    kind === "labs"
      ? w[value as keyof typeof w]
      : value === "REQUESTED"
        ? c(
            "Awaiting doctor confirmation",
            "Həkimin təsdiqi gözlənilir",
            "Ожидает подтверждения врача",
          )
        : value === "CONFIRMED"
          ? c("Confirmed", "Təsdiqlənib", "Подтверждено")
          : value === "COMPLETED"
            ? c("Completed", "Tamamlanıb", "Завершено")
            : value === "CANCELLED"
              ? c("Cancelled", "Ləğv edilib", "Отменено")
              : c("Missed appointment", "Randevuya gəlməyib", "Неявка");
  return (
    <>
      <Title>
        {kind === "labs"
          ? w.myOrders
          : c("My appointments", "Randevularım", "Мои приемы")}
      </Title>
      <LoadState resource={r} />
      {r.data?.partial && (
        <>
          <Notice danger>{w.partialFailure}</Notice>
          <Button secondary label={w.retry} onPress={r.retry} />
        </>
      )}
      {r.data && !r.data.partial && !r.data.rows.length && (
        <Body>
          {kind === "labs"
            ? w.noOrders
            : c(
                "No appointments yet.",
                "Hələ randevunuz yoxdur.",
                "Записей на прием пока нет.",
              )}
        </Body>
      )}
      {[false, true].map((past) => {
        const rows =
          r.data?.rows.filter((row) =>
            kind === "labs"
              ? terminal((row.order as LabOrder).status) === past
              : ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(
                  row.order.status,
                ) === past,
          ) || [];
        return (
          rows.length > 0 && (
            <View key={String(past)} style={{ gap: 16 }}>
              <Heading>{past ? w.past : w.upcoming}</Heading>
              {rows.map((row) => {
                const order = row.order,
                  lab = kind === "labs" ? (order as LabOrder) : null,
                  booking = kind === "bookings" ? (order as Booking) : null;
                return (
                  <View
                    key={`${row.member.id}:${order.id}`}
                    style={styles.card}
                  >
                    <Heading>
                      {lab?.labName || booking?.doctorName || "-"}
                    </Heading>
                    <Body>{row.member.fullName}</Body>
                    <Notice>{status(order.status)}</Notice>
                    {lab && (
                      <>
                        <Body>{w[lab.collection]}</Body>
                        {lab.address && <Body>{lab.address}</Body>}
                        {lab.contactPhone && <Body>{lab.contactPhone}</Body>}
                        {lab.preferredAt && (
                          <Body>
                            {shortDate(lab.preferredAt.slice(0, 10), language)}{" "}
                            {lab.preferredAt.slice(11, 16)}
                          </Body>
                        )}
                        {lab.items.map((item) => (
                          <View key={item.id} style={styles.line}>
                            <Body>
                              {item.name} -{" "}
                              {money(item.price, language, w.priceUnknown)}
                            </Body>
                            {lab.status !== "CANCELLED" && (
                              <Body small>
                                {item.resultReady
                                  ? w.resultReady
                                  : w.resultPending}
                              </Body>
                            )}
                          </View>
                        ))}
                        <Heading>
                          {w.snapshotPrice}:{" "}
                          {money(lab.totalPrice, language, w.priceUnknown)}
                        </Heading>
                        <Body small>{w.priceNotice}</Body>
                        {lab.status === "REQUESTED" && (
                          <Body small>{w.requestNote}</Body>
                        )}
                        {lab.labPhone && (
                          <Button
                            secondary
                            label={lab.labPhone}
                            onPress={() =>
                              Linking.openURL(
                                `tel:${lab.labPhone!.replace(/[^+\d]/g, "")}`,
                              )
                            }
                          />
                        )}
                      </>
                    )}
                    {booking && (
                      <>
                        <Body>
                          {shortDate(booking.startsAt.slice(0, 10), language)},{" "}
                          {booking.startsAt.slice(11, 16)}
                        </Body>
                        <Body small>
                          {[booking.clinicName, booking.clinicAddress]
                            .filter(Boolean)
                            .join(", ")}
                        </Body>
                        {booking.sharedRecord && (
                          <Notice>
                            {c(
                              "Record shared for this appointment",
                              "Bu randevu üçün qeydlər paylaşılıb",
                              "Записи предоставлены для этого приема",
                            )}
                          </Notice>
                        )}
                      </>
                    )}
                    {canWrite(row.role) &&
                      (lab
                        ? cancellable(lab.status)
                        : ["REQUESTED", "CONFIRMED"].includes(
                            order.status,
                          )) && (
                        <Button
                          secondary
                          label={w.cancel}
                          onPress={() => setCancel(row)}
                        />
                      )}
                  </View>
                );
              })}
            </View>
          )
        );
      })}
      {cancel && (
        <Confirm
          title={w.cancel}
          message={w.cancelQuestion}
          onClose={() => setCancel(null)}
          onConfirm={async () => {
            if (!canWrite(cancel.role)) return;
            if (kind === "labs")
              await labApi.cancel(cancel.member.id, cancel.order.id);
            else await cancelBooking(cancel.member.id, cancel.order.id);
            setCancel(null);
            r.retry();
          }}
        />
      )}
    </>
  );
}
