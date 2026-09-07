"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import BrandLogo from "@/components/brand/BrandLogo";
import SiteHeader from "@/components/navigation/SiteHeader";
import { homeCopy } from "./copy";
import "./homepage.css";

const members = ["Leyla", "Ayan", "Rauf"];
export default function HomePage() {
  const { i18n } = useTranslation();
  const requestedLanguage = i18n.language.split("-")[0];
  const language = requestedLanguage in homeCopy ? requestedLanguage : "en";
  const copy = (text: string) =>
    homeCopy[language]?.[text] ?? homeCopy.en?.[text] ?? text;
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
            <h1>
              {copy("Sağlamlıqla bağlı")}
              <br />
              <span>{copy("sualınız var?")}</span>
            </h1>
            <p>
              {copy(
                "azdoc analizlər, dərmanlar və sağlamlığınız haqqında sualları Azərbaycan dilində cavablandıran süni intellekt köməkçisidir.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="button blue" href="/chat">
                {copy("Sual verin")}
              </Link>
            </div>
            <p className="home-account-note">
              {copy("Söhbətə qeydiyyatsız başlaya bilərsiniz.")}
            </p>
          </div>
          <aside
            className="home-question-examples"
            aria-labelledby="example-questions"
          >
            <h2 id="example-questions">{copy("Nə soruşa bilərsiniz?")}</h2>
            <ul>
              <li>{copy("Qan analizində ferritin nəyi göstərir?")}</li>
              <li>{copy("İbuprofenin hansı yan təsirləri var?")}</li>
              <li>{copy("Uşağımın qulağı ağrıyır. Nəyə diqqət etməliyəm?")}</li>
            </ul>
          </aside>
        </section>
        <section className="how wrap" id="how">
          <div className="section-heading">
            <h2>{copy("azdoc nə üçün istifadə olunur?")}</h2>
          </div>
          <div className="steps">
            <article>
              <div>
                <h3>{copy("Analiz cavablarının izahı")}</h3>
                <p>
                  {copy(
                    "Analiz cavabını göndərib göstəricilərin və tibbi terminlərin mənasını soruşa bilərsiniz.",
                  )}
                </p>
              </div>
            </article>
            <article>
              <div>
                <h3>{copy("Şikayətlər və əlamətlər")}</h3>
                <p>
                  {copy(
                    "Sizi narahat edən əlamətlər barədə məlumat ala, həkim qəbulunda verəcəyiniz sualları hazırlaya bilərsiniz.",
                  )}
                </p>
              </div>
            </article>
            <article>
              <div>
                <h3>{copy("Dərman qiymətləri")}</h3>
                <p>
                  {copy(
                    "Dərmanların qiymətlərinə, qablaşdırmalarına və tərkibində eyni təsiredici maddə olan digər preparatlara baxa bilərsiniz.",
                  )}
                </p>
                <Link className="text-link home-inline-link" href="/dermanlar">
                  {copy("Dərman kataloqu")}
                </Link>
              </div>
            </article>
          </div>
        </section>
        <section className="family-section" id="family">
          <div className="family-inner wrap home-family-records">
            <div className="family-copy">
              <h2>{copy("Ailənizin sağlamlıq qeydləri")}</h2>
              <p>
                {copy(
                  "Allergiyalar, qəbul olunan dərmanlar, peyvəndlər və ölçülər hər ailə üzvü üçün ayrıca saxlanılır.",
                )}
              </p>
              <p>
                {copy(
                  "Söhbətdə ailə üzvünü seçdikdə azdoc onun sağlamlıq qeydlərini də nəzərə alır.",
                )}
              </p>
              <Link className="text-link" href="/health-record">
                {copy("Sağlamlıq qeydlərini açın")}
              </Link>
              <p className="home-account-note">
                {copy("Bu bölmədən istifadə etmək üçün hesabınıza daxil olun.")}
              </p>
            </div>
            <div className="home-record-example">
              <div className="record-window">
                <div className="record-body">
                  <div className="record-heading">
                    <h3>{member}</h3>
                  </div>
                  <div className="member-tabs" aria-label={copy("Ailə üzvü")}>
                    {members.map((m, i) => (
                      <button
                        key={m}
                        aria-pressed={member === m}
                        className={member === m ? "selected" : ""}
                        onClick={() => setMember(m)}
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
                  <div className="home-record-values">
                    {view === "Allergiyalar" ? (
                      <div className="result-line">
                        <span>{copy("Allergiya")}</span>
                        <strong>
                          {copy(
                            member === "Leyla"
                              ? "Penisillin"
                              : "Qeyd edilməyib",
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
                            {copy("kq")}
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
                  </div>
                </div>
              </div>
              <p className="preview-caption">
                {copy("Nümunə məlumatlardır, real şəxslərə aid deyil.")}
              </p>
            </div>
          </div>
        </section>
        <section className="faq wrap" id="questions">
          <div>
            <h2>{copy("Suallar və cavablar")}</h2>
          </div>
          <div className="faq-items">
            <details>
              <summary>{copy("Qeydiyyat mütləqdirmi?")}</summary>
              <p>
                {copy(
                  "Sual vermək üçün yox. Ailə üzvlərini və onların sağlamlıq məlumatlarını saxlamaq üçün hesab yaratmalısınız.",
                )}
              </p>
            </details>
            <details>
              <summary>{copy("Hansı sənədləri göndərə bilərəm?")}</summary>
              <p>
                {copy(
                  "Analiz cavablarını və digər tibbi sənədləri PDF və ya şəkil kimi söhbətə əlavə edə bilərsiniz.",
                )}
              </p>
            </details>
            <details>
              <summary>{copy("azdoc həkimi əvəz edirmi?")}</summary>
              <p>
                {copy(
                  "Xeyr. azdoc səhv edə bilər. Cavablar məlumat üçündür. Diaqnozu həkim qoyur, müalicəni həkim təyin edir. Təcili tibbi yardım üçün 103-ə zəng edin.",
                )}
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className="wrap">
        <BrandLogo />
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
