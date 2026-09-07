"use client";
import RegistrationConsents from "@/components/privacy/RegistrationConsents";
import { usePrivacyCopy } from "@/components/privacy/usePrivacyCopy";
import { saveRegistrationConsents } from "@/api/privacy";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LoaderCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSiteContext } from "@/context/SiteContext";
import SiteHeader from "@/components/navigation/SiteHeader";
import PublicRoute from "@/components/PublicRoute";
import api from "@/api";
import { supportedLanguage } from "@/utils/languages";
import { authCopy } from "./copy";
import { authDestination } from "./redirect";
import styles from "./auth.module.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const { t, i18n } = useTranslation();
  const language =
    supportedLanguage(i18n.resolvedLanguage || i18n.language) || "en";
  const copy = authCopy[language];
  const { WEBSITE_NAME } = useSiteContext();
  const brand =
    WEBSITE_NAME === "Localhost" ? "azdoc" : WEBSITE_NAME.toLowerCase();
  const { login, register } = useAuth();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const alternate = `${registering ? "/login" : "/register"}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
  const { p: privacyCopy } = usePrivacyCopy();
  const [choices, setChoices] = useState({ storage: false, ai: false });
  const [accountCreated, setAccountCreated] = useState(false);
  const createdRef = useRef(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      if (registering) {
        if (!createdRef.current) {
          await register(form.email.trim(), form.password, form.name.trim());
          createdRef.current = true;
          setAccountCreated(true);
          setForm((previous) => ({ ...previous, password: "" }));
        }
        await saveRegistrationConsents(choices.storage, choices.ai);
      } else await login(form.email.trim(), form.password);
      window.location.assign(
        authDestination(redirect, registering ? "/chat" : "/dashboard"),
      );
    } catch {
      setError(
        createdRef.current
          ? privacyCopy.saveFailed
          : registering
            ? copy.registrationFailed
            : copy.loginFailed,
      );
      setLoading(false);
      submitting.current = false;
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  };
  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };
  const google = () => {
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    window.location.assign(
      `${api.defaults.baseURL}/oauth2/authorization/google`,
    );
  };

  return (
    <PublicRoute>
      <div className={`${styles.page} ${manrope.className}`} lang={language}>
        <div className={styles.siteHeader}>
          <SiteHeader />
        </div>
        <main className={styles.main}>
          <aside className={styles.story}>
            <div className={styles.orbitOne} aria-hidden="true" />
            <div className={styles.orbitTwo} aria-hidden="true" />
            <div className={styles.eyebrow}>
              <span />
              {copy.eyebrow}
            </div>
            <h2>
              {copy.lineOne}
              <br /> {copy.lineTwo}
              <br /> <em>{copy.lineThree}</em>
            </h2>
            <p className={styles.storyText}>{copy.story}</p>
            <div className={styles.illustration}>
              <div className={styles.conversation}>
                <div className={styles.sampleHeading}>
                  <MessageCircle size={17} aria-hidden="true" />
                  <span>{copy.sample}</span>
                  <span className={styles.dots} aria-hidden="true">
                    ···
                  </span>
                </div>
                <div className={styles.question}>{copy.sampleQuestion}</div>
                <div className={styles.response}>
                  <span className={styles.assistantIcon}>
                    <Sparkles size={15} aria-hidden="true" />
                  </span>
                  <p>{copy.sampleAnswer}</p>
                </div>
              </div>
              <div className={styles.note}>
                <span aria-hidden="true">↳</span>
                <div>
                  <strong>{copy.note}</strong>
                  <p>{copy.noteDetail}</p>
                </div>
              </div>
            </div>
            <p className={styles.storyFoot}>{copy.smallPrint}</p>
          </aside>
          <section className={styles.formSide} aria-labelledby="auth-title">
            <div className={styles.formContent}>
              <div className={styles.eyebrow}>
                {registering ? copy.registerEyebrow : copy.loginEyebrow}
              </div>
              <h1 id="auth-title">
                {registering ? copy.registerTitle : copy.loginTitle}
              </h1>
              <p className={styles.subtitle}>
                {registering ? copy.registerSubtitle : copy.loginSubtitle}
              </p>
              {!registering && (
                <>
                  <button
                    className={styles.google}
                    onClick={google}
                    disabled={loading}
                    type="button"
                  >
                    <Image
                      src="/google-icon.svg"
                      width={19}
                      height={19}
                      alt=""
                    />
                    {t("auth.login_with_google")}
                  </button>
                  <div className={styles.divider}>
                    <span>{copy.emailDivider}</span>
                  </div>
                </>
              )}
              {error && (
                <div
                  role="alert"
                  tabIndex={-1}
                  ref={errorRef}
                  id="auth-error"
                  className={styles.error}
                >
                  {error}
                </div>
              )}
              <form
                onSubmit={submit}
                className={styles.form}
                aria-busy={loading}
              >
                <fieldset disabled={loading}>
                  {registering && (
                    <div className={styles.field}>
                      <label htmlFor="name">
                        {t("register.form.fullName")}
                      </label>
                      <input
                        id="name"
                        name="name"
                        autoComplete="name"
                        required={!accountCreated}
                        value={form.name}
                        onChange={change}
                        disabled={accountCreated}
                        placeholder={copy.namePlaceholder}
                      />
                    </div>
                  )}
                  <div className={styles.field}>
                    <label htmlFor="email">{t("auth.email")}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      required={!accountCreated}
                      value={form.email}
                      onChange={change}
                      disabled={accountCreated}
                      placeholder="you@example.com"
                      aria-describedby={error ? "auth-error" : undefined}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="password">{t("auth.password")}</label>
                    <div className={styles.password}>
                      <input
                        id="password"
                        name="password"
                        type={visible ? "text" : "password"}
                        autoComplete={
                          registering ? "new-password" : "current-password"
                        }
                        minLength={registering ? 8 : undefined}
                        required={!accountCreated}
                        value={form.password}
                        onChange={change}
                        disabled={accountCreated}
                        placeholder="--------"
                        aria-describedby={
                          registering ? "password-hint" : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        aria-label={
                          visible ? copy.hidePassword : copy.showPassword
                        }
                        aria-pressed={visible}
                      >
                        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {registering && (
                      <p id="password-hint" className={styles.hint}>
                        {copy.passwordHelp}
                      </p>
                    )}
                  </div>
                  {registering && (
                    <RegistrationConsents
                      storage={choices.storage}
                      ai={choices.ai}
                      onChange={(key, value) =>
                        setChoices((previous) => ({
                          ...previous,
                          [key]: value,
                        }))
                      }
                    />
                  )}
                  {accountCreated && <p role="status">{privacyCopy.created}</p>}
                  {registering && (
                    <div className={styles.terms}>
                      <input type="checkbox" id="terms" required />
                      <label htmlFor="terms">
                        {copy.termsIntro}{" "}
                        <Link
                          href="/terms-of-service"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("register.form.termsLink")}
                        </Link>{" "}
                        .
                      </label>
                    </div>
                  )}
                  {registering && (
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {privacyCopy.policy}
                    </Link>
                  )}
                  <button type="submit" className={styles.submit}>
                    {loading ? (
                      <>
                        <LoaderCircle
                          className={styles.spinner}
                          size={18}
                          aria-hidden="true"
                        />
                        {t(
                          registering
                            ? "auth.register.creating_account"
                            : "auth.login.signing_in",
                        )}
                      </>
                    ) : accountCreated ? (
                      privacyCopy.retryChoices
                    ) : (
                      <>
                        {t(
                          registering
                            ? "auth.register.create_account"
                            : "auth.login.sign_in",
                        )}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </fieldset>
              </form>
              <p className={styles.alternate}>
                {registering ? copy.haveAccount : copy.noAccount}{" "}
                <Link href={alternate}>
                  {t(
                    registering
                      ? "auth.login.sign_in"
                      : "auth.register.create_account",
                  )}{" "}
                  <span aria-hidden="true">^</span>
                </Link>
              </p>
              <Link href="/contact" className={styles.help}>
                {copy.contact}
              </Link>
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} {brand}
          </span>
          <div>
            <Link href="/privacy-policy">{copy.privacy}</Link>
            <Link href="/terms-of-service">{copy.terms}</Link>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
}
