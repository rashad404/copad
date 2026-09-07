"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSiteContext } from "@/context/SiteContext";
import BrandLogo from "@/components/brand/BrandLogo";
import SiteHeader from "@/components/navigation/SiteHeader";
import { homeCopy } from "./copy";
import "./homepage.css";
const members = ["Leyla", "Ayan", "Rauf"];
export default function HomePage() {
  const { i18n } = useTranslation();
  const { WEBSITE_NAME } = useSiteContext();
  const brand =
    WEBSITE_NAME === "Localhost" ? "azdoc" : WEBSITE_NAME.toLowerCase();
  const requestedLanguage = i18n.language.split("-")[0];
  const language = requestedLanguage in homeCopy ? requestedLanguage : "en";
  const copy = (text: string) => homeCopy[language]?.[text] ?? text;
  const [member, setMember] = useState("Leyla");
  const [view, setView] = useState("Allergiyalar");
  return (
    <div
      className="azdoc-home"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <a className="skip-link" href="#main">
        {copy("Əsas məzmuna keç")}
      </a>
      <SiteHeader />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" />{" "}
              {copy("AZƏRBAYCAN DİLİNDƏ SAĞLAMLIQ KÖMƏKÇİSİ")}
            </div>
            <h1>
              {copy("Sağlamlıqla bağlı")}
              <br />
              <span>{copy("sualınız var?")}</span>
            </h1>
            <p>
              {copy(
                "Analiz cavabında anlamadığınız göstəricini soruşun, şikayətinizi yazın və ya tibbi sənədinizi göndərin. azdoc yazdıqlarınızı nəzərə alıb suallarınızı cavablandırır.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="button blue" href="/chat">
                {copy("Sual verin")}
                <span>^</span>
              </Link>
              <a className="text-link" href="#how">
                {copy("Necə istifadə olunur?")}
                <span>↓</span>
              </a>
            </div>
            <div className="hero-foot">
              <span className="mini-mark">↳</span>
              <span>
                {copy("Sual vermək üçün")}
                <br />
                <strong>{copy("qeydiyyatdan keçmək lazım deyil.")}</strong>
              </span>
            </div>
          </div>
          <div className="hero-stage" id="demo">
            <div className="stage-top">
              <span>{copy("SAĞLAMLIQ QEYDİ NÜMUNƏSİ")}</span>
              <span aria-hidden="true">^</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="record-window">
              <div className="window-top">
                <span className="small-logo">
                  {brand}
                  <span>-</span>
                </span>
                <span className="demo-label">{copy("NÜMUNƏ")}</span>
                <span className="profile">{member[0]}</span>
              </div>
              <div className="record-body">
                <div className="record-heading">
                  <div>
                    <span className="muted tiny">
                      {copy("SEÇİLMİŞ AİLƏ ÜZVÜ")}
                    </span>
                    <h2>{member}</h2>
                  </div>
                  <span className="sun">✳</span>
                </div>
                <div className="member-tabs" aria-label={copy("Ailə üzvü")}>
                  {members.map((m, i) => (
                    <button
                      key={m}
                      aria-pressed={member === m}
                      className={member === m ? "selected" : ""}
                      onClick={() => {
                        setMember(m);
                      }}
                    >
                      <span className={"avatar a" + i}>{m[0]}</span>
                      {m}
                    </button>
                  ))}
                </div>
                <div className="record-nav">
                  {["Allergiyalar", "Dərmanlar", "Ölçülər"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={view === v ? "active" : ""}
                      aria-pressed={view === v}
                    >
                      {copy(v)}
                    </button>
                  ))}
                </div>
                <div className="result-title">
                  <strong>{copy(view)}</strong>
                  <span>{copy("Nümunə qeyd")}</span>
                </div>
                {view === "Allergiyalar" ? (
                  <div className="result-line">
                    <span>{copy("Allergiya")}</span>
                    <strong>
                      {copy(
                        member === "Leyla" ? "Penisillin" : "Qeyd edilməyib",
                      )}
                    </strong>
                  </div>
                ) : view === "Dərmanlar" ? (
                  <div className="result-line">
                    <span>{copy("Qəbul olunan dərman")}</span>
                    <strong>{copy("Qeyd edilməyib")}</strong>
                  </div>
                ) : (
                  <>
                    <div className="result-line">
                      <span>{copy("Çəki")}</span>
                      <strong>
                        {member === "Leyla"
                          ? "64"
                          : member === "Ayan"
                            ? "24"
                            : "78"}{" "}
                        kg
                      </strong>
                    </div>
                    <div className="result-line">
                      <span>{copy("Qan təzyiqi")}</span>
                      <strong>
                        {member === "Ayan"
                          ? copy("Qeyd edilməyib")
                          : "120/80 mmHg"}
                      </strong>
                    </div>
                  </>
                )}
                <Link className="ask" href="/health-record">
                  {copy("Sağlamlıq qeydlərinə keçin")}
                </Link>
              </div>
            </div>
            <div className="floating-note">
              <span className="note-icon">✓</span>
              <div>
                <strong>{copy("Ailə üzvünü seçin.")}</strong>
                <span>{copy("Onun qeydlərinə ayrıca baxın.")}</span>
              </div>
            </div>
            <p className="preview-caption">
              {copy(
                "Buradakı adlar və qeydlər nümunədir, real şəxslərə aid deyil.",
              )}
            </p>
            <div className="stage-bottom">
              <span>{copy("ALLERGİYALAR, DƏRMANLAR VƏ ÖLÇÜLƏR")}</span>
              <span className="stage-arrow">^</span>
            </div>
          </div>
        </section>
        <section className="statement wrap">
          <span className="section-number">{copy("AZDOC NƏ ÜÇÜNDÜR?")}</span>
          <p>
            {copy("Analizdəki terminləri başa düşmürsünüz?")}
            <br />
            <strong>
              {copy("Sənədi göndərin, nəyi öyrənmək istədiyinizi yazın.")}
            </strong>
          </p>
        </section>
        <section className="how wrap" id="how">
          <div className="section-heading">
            <div className="eyebrow">{copy("NECƏ İSTİFADƏ OLUNUR?")}</div>
            <h2>
              {copy("Sualınızı öz")}
              <br />
              {copy("sözlərinizlə yazın.")}
            </h2>
            <p>
              {copy(
                "Tibbi terminləri bilməyiniz lazım deyil. Nəyin sizi narahat etdiyini yazmağınız kifayətdir.",
              )}
            </p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span>
              <div>
                <h3>{copy("Nəyi öyrənmək istəyirsiniz?")}</h3>
                <p>
                  {copy(
                    'Məsələn: "Analizimdə bu göstərici nə deməkdir?" Şikayətiniz varsa, nə vaxt başladığını və necə hiss etdiyinizi qeyd edin.',
                  )}
                </p>
              </div>
              <span className="step-symbol">^</span>
            </article>
            <article>
              <span className="step-number">02</span>
              <div>
                <h3>{copy("Analiz cavabınız varsa, göndərin.")}</h3>
                <p>
                  {copy(
                    "PDF faylını və ya sənədin aydın şəklini söhbətə əlavə edə bilərsiniz. Sual vermək üçün sənəd göndərmək məcburi deyil.",
                  )}
                </p>
              </div>
              <span className="step-symbol">✓</span>
            </article>
            <article>
              <span className="step-number">03</span>
              <div>
                <h3>{copy("Başa düşmədiyiniz hissəni soruşun.")}</h3>
                <p>
                  {copy(
                    "Cavabda sizə tanış olmayan söz varsa, izahını istəyin. Həkim qəbuluna gedirsinizsə, verəcəyiniz sualları hazırlamağa da kömək edə bilərik.",
                  )}
                </p>
              </div>
              <span className="step-symbol">✳</span>
            </article>
          </div>
        </section>
        <section className="family-section" id="family">
          <div className="family-inner wrap">
            <div className="family-art">
              <div className="family-circle c1">
                {copy("L")}
                <span>{copy("Leyla · Mən")}</span>
              </div>
              <div className="family-circle c2">
                {copy("A")}
                <span>{copy("Ayan · Övladım")}</span>
              </div>
              <div className="family-circle c3">
                {copy("R")}
                <span>{copy("Rauf · Atam")}</span>
              </div>
              <span className="family-caption">
                {copy("HƏR AİLƏ ÜZVÜ ÜÇÜN AYRICA QEYDLƏR")}
              </span>
            </div>
            <div className="family-copy">
              <div className="eyebrow">
                {copy("AİLƏNİZİN SAĞLAMLIQ QEYDLƏRİ")}
              </div>
              <h2>
                {copy("Özünüzün və ailənizin")}
                <br />
                {copy("qeydlərini saxlayın.")}
              </h2>
              <p>
                {copy(
                  "Allergiyaları, qəbul olunan dərmanları, xəstəlikləri və peyvəndləri hər ailə üzvü üçün ayrıca qeyd edin. Söhbətdə həmin şəxsi seçdikdə azdoc cavab verərkən onun sağlamlıq qeydlərini də nəzərə alır.",
                )}
              </p>
              <Link className="text-link" href="/health-record">
                {copy("Sağlamlıq qeydlərini açın")}
              </Link>
            </div>
          </div>
        </section>
        <section className="faq wrap" id="questions">
          <div>
            <div className="eyebrow">{copy("TEZ-TEZ VERİLƏN SUALLAR")}</div>
            <h2>{copy("Suallar və cavablar")}</h2>
            <p>
              {copy("Qeydiyyat, ailə qeydləri və azdoc-un imkanları haqqında.")}
            </p>
          </div>
          <div className="faq-items">
            <details>
              <summary>{copy("azdoc ilə nə edə bilərəm?")}</summary>
              <p>
                {copy(
                  "Sağlamlıqla bağlı suallar verə, tibbi sənədləri söhbətə göndərə, ailənizin sağlamlıq qeydlərini saxlaya bilərsiniz. Dərman kataloqunda isə dərmanların qiymətlərinə və tərkibində eyni təsiredici maddə olan digər preparatlara baxa bilərsiniz.",
                )}
              </p>
            </details>
            <details>
              <summary>{copy("azdoc həkimi əvəz edirmi?")}</summary>
              <p>
                {copy(
                  "Xeyr. azdoc süni intellekt köməkçisidir və səhv edə bilər. Diaqnoz qoymur, müalicə təyin etmir. Dərman qəbuluna və ya müalicəyə dair qərarı həkiminizlə verin. Təcili tibbi yardım üçün 103-ə zəng edin.",
                )}
              </p>
            </details>
            <details>
              <summary>
                {copy("Ailə üzvünün qeydlərini necə əlavə edim?")}
              </summary>
              <p>
                {copy(
                  'Hesabınıza daxil olub "Sağlamlıq qeydləri" bölməsini açın. Ailə üzvünü əlavə edin, sonra onun allergiyalarını, dərmanlarını və digər məlumatlarını qeyd edin. Mövcud qeydlərə baxmaq üçün siyahıdan həmin şəxsi seçin.',
                )}
              </p>
            </details>
          </div>
        </section>
        <section className="closing wrap">
          <div>
            <div className="eyebrow">
              {copy("QEYDİYYATSIZ SUAL VERƏ BİLƏRSİNİZ")}
            </div>
            <h2>
              {copy("Nəyi öyrənmək")}
              <br />
              {copy("istəyirsiniz?")}
            </h2>
          </div>
          <Link className="button lime" href="/chat">
            {copy("Sual verin")} <span>^</span>
          </Link>
          <span className="closing-star">✳</span>
        </section>
      </main>
      <footer className="wrap">
        <BrandLogo />
        <span>{copy("Sağlamlıq sualları və ailə qeydləri.")}</span>
        <div className="footer-links">
          <Link href="/blog">{copy("Bloq")}</Link>
          <Link href="/contact">{copy("Əlaqə")}</Link>
          <Link href="/privacy-policy">{copy("Məxfilik")}</Link>
          <Link href="/terms-of-service">{copy("İstifadə şərtləri")}</Link>
        </div>
      </footer>
    </div>
  );
}
