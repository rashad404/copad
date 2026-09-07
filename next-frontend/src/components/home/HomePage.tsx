"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useSiteContext } from "@/context/SiteContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { homeCopy } from "./copy";
import "./homepage.css";
const members = ["Leyla", "Ayan", "Rauf"];
export default function HomePage() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { WEBSITE_NAME } = useSiteContext();
  const brand =
    WEBSITE_NAME === "Localhost" ? "azdoc" : WEBSITE_NAME.toLowerCase();
  const requestedLanguage = i18n.language.split("-")[0];
  const language = requestedLanguage in homeCopy ? requestedLanguage : "en";
  const copy = (text: string) => homeCopy[language]?.[text] ?? text;
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  const [member, setMember] = useState("Leyla");
  const [view, setView] = useState("Nəticələr");
  const [menu, setMenu] = useState(false);
  const [answer, setAnswer] = useState(false);
  return (
    <div
      className="azdoc-home"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <a className="skip-link" href="#main">
        {copy("Əsas məzmuna keç")}
      </a>
      <header className="header wrap">
        <a className="logo" href="#">
          {brand}
          <span className="logo-dot">•</span>
        </a>
        <nav
          id="home-navigation"
          onClick={() => setMenu(false)}
          aria-label={copy("Əsas naviqasiya")}
          className={menu ? "nav open" : "nav"}
        >
          <a href="#how">{copy("Necə işləyir")}</a>
          <a href="#family">{copy("Ailəniz üçün")}</a>
          <a href="#questions">{copy("Suallar")}</a>
          <Link
            className="mobile-account"
            href={isAuthenticated ? "/dashboard" : "/login"}
          >
            {copy(isAuthenticated ? "Hesabım" : "Daxil ol")}
          </Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link
            className="login-link"
            href={isAuthenticated ? "/dashboard" : "/login"}
          >
            {copy(isAuthenticated ? "Hesabım" : "Daxil ol")}
          </Link>
          <Link className="header-cta" href="/chat">
            {copy("Sual ver")}
            <span>↗</span>
          </Link>
        </div>
        <button
          className="menu"
          aria-label={copy("Menyu")}
          aria-controls="home-navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          ☰
        </button>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" />{" "}
              {copy("SAĞLAMLIQ HAQQINDA DAHA AYDIN SÖHBƏT")}
            </div>
            <h1>
              {copy("Hər nəticə.")}
              <br />
              {copy("Hər sual.")}
              <br />
              <span>{copy("Bir yerdə.")}</span>
            </h1>
            <p>
              {copy(
                "Sağlamlıq suallarınızı Azərbaycan dilində verin. Söhbətinizə sənəd əlavə edin və məlumatları anlamaq üçün ilk addımı atın.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="button blue" href="/chat">
                {copy("Söhbətə başla")}
                <span>↗</span>
              </Link>
              <a className="text-link" href="#how">
                {copy("azdoc ilə tanış ol")}
                <span>↓</span>
              </a>
            </div>
            <div className="hero-foot">
              <span className="mini-mark">↳</span>
              <span>
                {copy("Bir sualdan başlayır.")}
                <br />
                <strong>{copy("Daha aydın bir söhbətə çevrilir.")}</strong>
              </span>
            </div>
          </div>
          <div className="hero-stage" id="demo">
            <div className="stage-top">
              <span>{copy("GƏLƏCƏK MƏHSULDAN BİR DEMO")}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="record-window">
              <div className="window-top">
                <span className="small-logo">
                  {brand}
                  <span>•</span>
                </span>
                <span className="demo-label">{copy("DEMO")}</span>
                <span className="profile">{member[0]}</span>
              </div>
              <div className="record-body">
                <div className="record-heading">
                  <div>
                    <span className="muted tiny">
                      {copy("AİLƏNİZİN SAĞLAMLIĞI")}
                    </span>
                    <h2>
                      {copy("Salam,")} {member}.
                    </h2>
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
                        setAnswer(false);
                      }}
                    >
                      <span className={"avatar a" + i}>{m[0]}</span>
                      {m}
                    </button>
                  ))}
                </div>
                <div className="record-nav">
                  {["Nəticələr", "Sənədlər", "Tarixçə"].map((v) => (
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
                {view === "Nəticələr" ? (
                  <>
                    <div className="result-title">
                      <div>
                        <span className="file-icon">▤</span>
                        <strong>{copy("Ümumi qan analizi")}</strong>
                      </div>
                      <span>{copy("04 sent.")}</span>
                    </div>
                    <div className="result-line">
                      <div>
                        <span>{copy("Hemoqlobin")}</span>
                        <small>
                          {copy("Son nəticə ·")} {member}
                        </small>
                      </div>
                      <strong>
                        13.2 <small>{copy("g/dL")}</small>
                      </strong>
                    </div>
                    <div
                      className="mini-chart"
                      role="img"
                      aria-label={copy(
                        "Nümunə hemoqlobin nəticələri, may 12.8, iyun 13.0, iyul 12.9, avqust 13.1, sentyabr 13.2 g/dL",
                      )}
                    >
                      <div className="chart-axis">
                        <span>14</span>
                        <span>13</span>
                        <span>12</span>
                      </div>
                      <div className="bars">
                        {[12.8, 13.0, 12.9, 13.1, 13.2].map((value, i) => (
                          <div key={i}>
                            <span
                              style={{ height: ((value - 12) / 2) * 76 + "px" }}
                            />
                            <small>
                              {copy(["May", "İyn", "İyl", "Avq", "Sen"][i])}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="source-line">
                      <span className="source-dot" />{" "}
                      {copy("Mənbə: analiz-nəticəsi.pdf")}
                    </div>
                  </>
                ) : view === "Sənədlər" ? (
                  <div className="alternate">
                    <span className="file-icon">▤</span>
                    <h3>
                      {member} {copy("üçün sənədlər")}
                    </h3>
                    <p>{copy("Ümumi qan analizi")}</p>
                    <small>{copy("04 sentyabr 2026 · PDF · Nümunə")}</small>
                    <button onClick={() => setView("Nəticələr")}>
                      {copy("Nəticələrə bax →")}
                    </button>
                  </div>
                ) : (
                  <div className="alternate timeline">
                    <h3>
                      {member} {copy("üçün tarixçə")}
                    </h3>
                    <p>
                      <b>{copy("04 sentyabr")}</b>{" "}
                      {copy("Analiz nəticəsi əlavə edilib")}
                    </p>
                    <p>
                      <b>{copy("12 avqust")}</b> {copy("Yeni ölçü qeyd edilib")}
                    </p>
                    <p>
                      <b>{copy("20 iyul")}</b> {copy("Sənəd əlavə edilib")}
                    </p>
                    <small>{copy("Nümunə fəaliyyət tarixçəsi")}</small>
                  </div>
                )}
                <button
                  className="ask"
                  onClick={() => setAnswer(!answer)}
                  aria-expanded={answer}
                >
                  <span>✳</span> {copy("Bu nəticəni anlamağa kömək et")}
                  <span>↗</span>
                </button>
                {answer && (
                  <div className="demo-answer">
                    {copy(
                      "Bu, dizayn nümunəsidir. Hazır məhsulda izah seçilmiş üzvün təsdiqlənmiş məlumatlarına əsaslanacaq və mənbəyə keçid göstərəcək.",
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="floating-note">
              <span className="note-icon">✓</span>
              <div>
                <strong>{copy("Sənəddən tarixçəyə.")}</strong>
                <span>{copy("Mənbəsi ilə birlikdə, bir yerdə.")}</span>
              </div>
            </div>
            <p className="preview-caption">
              {copy(
                "Ailə tarixçəsi və nəticə qrafikləri hazırlanır. Burada göstərilənlər nümunədir.",
              )}
            </p>
            <div className="stage-bottom">
              <span>{copy("ÖZÜNÜZÜ DAHA YAXŞI TANIYIN.")}</span>
              <span className="stage-arrow">↗</span>
            </div>
          </div>
        </section>
        <section className="statement wrap">
          <span className="section-number">
            {copy("01 — DAHA AZ QARIŞIQLIQ")}
          </span>
          <p>
            {copy("Ayrı-ayrı fayllar arasında itən məlumatlar.")}
            <br />
            <strong>
              {copy("Daha aydın məlumat üçün bir yerdən başlayın.")}
            </strong>
          </p>
        </section>
        <section className="how wrap" id="how">
          <div className="section-heading">
            <div className="eyebrow">{copy("SADƏ BİR BAŞLANĞIC")}</div>
            <h2>
              {copy("Sualınızdan")}
              <br />
              {copy("başlayaq.")}
            </h2>
            <p>
              {copy("Sual verin, sənəd əlavə edin və söhbəti davam etdirin.")}
            </p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span>
              <div>
                <h3>{copy("Sualınızı yazın.")}</h3>
                <p>
                  {copy(
                    "Nəyi anlamaq istədiyinizi öz sözlərinizlə izah edin. Haradan başlayacağınızı bilməsəniz də yaza bilərsiniz.",
                  )}
                </p>
              </div>
              <span className="step-symbol">↗</span>
            </article>
            <article>
              <span className="step-number">02</span>
              <div>
                <h3>{copy("Sənəd əlavə edin.")}</h3>
                <p>
                  {copy(
                    "Lazım olduqda analiz PDF-i və ya sənəd şəklini söhbətə əlavə edin.",
                  )}
                </p>
              </div>
              <span className="step-symbol">✓</span>
            </article>
            <article>
              <span className="step-number">03</span>
              <div>
                <h3>{copy("Söhbəti davam etdirin.")}</h3>
                <p>
                  {copy(
                    "Aydın olmayan hissələr haqqında yenidən soruşun. Tibbi qərarları həkiminizlə müzakirə edin.",
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
                {copy("FƏRQLİ İNSANLAR. AYRI TARİXÇƏLƏR.")}
              </span>
            </div>
            <div className="family-copy">
              <div className="eyebrow">
                {copy("NÖVBƏTİ ADDIM · HAZIRLANIR")}
              </div>
              <h2>
                {copy("Sizin üçün.")}
                <br />
                {copy("Sevdikləriniz üçün.")}
              </h2>
              <p>
                {copy(
                  "Ailə üzvləri üçün ayrıca tarixçələr, sənədlər və ölçülər üzərində işləyirik. Hər kəsin məlumatını öz yerində saxlamaq üçün.",
                )}
              </p>
              <a className="text-link" href="#demo">
                {copy("Ailə nümunəsini araşdır")}
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>
        <section className="faq wrap" id="questions">
          <div>
            <div className="eyebrow">{copy("BİLMƏK İSTƏDİKLƏRİNİZ")}</div>
            <h2>{copy("Aydın cavablar.")}</h2>
            <p>{copy("Başlamazdan əvvəl bir neçə vacib məqam.")}</p>
          </div>
          <div className="faq-items">
            <details>
              <summary>{copy("Hazırda azdoc ilə nə edə bilərəm?")}</summary>
              <p>
                {copy(
                  "Sağlamlıq haqqında suallar verə, söhbətə sənədlər əlavə edə və hesab yarada bilərsiniz. Ailə tarixçəsi və nəticə qrafikləri gələcək məhsulun nümunəsidir.",
                )}
              </p>
            </details>
            <details>
              <summary>{copy("azdoc həkimi əvəz edirmi?")}</summary>
              <p>
                {copy(
                  "Xeyr. azdoc məlumatları anlamağa kömək edən AI köməkçisidir. Diaqnoz və müalicə qərarları üçün həkimə müraciət edin.",
                )}
              </p>
            </details>
            <details>
              <summary>{copy("Ailə tarixçəsi artıq mövcuddur?")}</summary>
              <p>
                {copy(
                  "Hələ yox. Yuxarıdakı ailə tarixçəsi interaktiv nümunədir. Bu imkanlar hazır olduqda ayrıca təqdim ediləcək.",
                )}
              </p>
            </details>
          </div>
        </section>
        <section className="closing wrap">
          <div>
            <div className="eyebrow">{copy("DAHA AYDIN BİR BAŞLANĞIC")}</div>
            <h2>
              {copy("Sağlamlığınıza")}
              <br />
              {copy("bütöv baxın.")}
            </h2>
          </div>
          <Link
            className="button lime"
            href={isAuthenticated ? "/chat" : "/register"}
          >
            {copy(isAuthenticated ? "Söhbətə davam et" : "Hesab yarat")}{" "}
            <span>↗</span>
          </Link>
          <span className="closing-star">✳</span>
        </section>
      </main>
      <footer className="wrap">
        <a className="logo" href="#">
          {brand}
          <span className="logo-dot">•</span>
        </a>
        <span>{copy("Sağlamlığınızın bütöv hekayəsi.")}</span>
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
