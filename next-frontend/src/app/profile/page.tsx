"use client";
import { useEffect, useState } from "react";
import api from "@/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductLayout, {
  PageIntro,
  usePublicCopy,
} from "@/components/public/ProductLayout";
interface MedicalProfile {
  height: string;
  weight: string;
  conditions: string;
  allergies: string;
  medications: string;
  lifestyle: string;
}

interface Profile {
  name: string;
  email: string;
  age: string;
  gender: string;
  medicalProfile: MedicalProfile;
}

/** The API omits optional fields entirely, so every value is treated as absent-able. */
type RawProfile = Partial<Omit<Profile, "medicalProfile">> & {
  medicalProfile?: Partial<MedicalProfile>;
};

const normalizeProfile = (data: RawProfile): Profile => ({
  ...data,
  name: data.name ?? "",
  email: data.email ?? "",
  age: data.age ?? "",
  gender: data.gender ?? "",
  medicalProfile: {
    height: data.medicalProfile?.height ?? "",
    weight: data.medicalProfile?.weight ?? "",
    conditions: data.medicalProfile?.conditions ?? "",
    allergies: data.medicalProfile?.allergies ?? "",
    medications: data.medicalProfile?.medications ?? "",
    lifestyle: data.medicalProfile?.lifestyle ?? "",
  },
});

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const c = usePublicCopy();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile>(normalizeProfile({}));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    setLoading(true);
    setError("");
    api
      .get("/profile")
      .then((res) => {
        if (active) {
          setProfile(normalizeProfile(res.data));
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active)
          setError(
            t("profile.errorLoading", {
              defaultValue: i18n.language.startsWith("az")
                ? "Profilinizi yükləmək mümkün olmadı. Yenidən cəhd edin."
                : "Unable to load your profile. Please try again.",
            }),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated, retry, t, i18n.language]);
  function edit(key: keyof Omit<Profile, "medicalProfile">, value: string) {
    setSaved(false);
    setProfile((p) => ({ ...p, [key]: value }));
  }
  function editMedical(key: keyof MedicalProfile, value: string) {
    setSaved(false);
    setProfile((p) => ({
      ...p,
      medicalProfile: { ...p.medicalProfile, [key]: value },
    }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.put("/profile", profile);
      setSaved(true);
    } catch {
      setError(
        t("profile.errorSaving", {
          defaultValue: c(
            "Unable to save changes. Please try again.",
            "Dəyişiklikləri saxlamaq mümkün olmadı. Yenidən cəhd edin.",
          ),
        }),
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <ProtectedRoute>
      <ProductLayout>
        <div className="public-container">
          <PageIntro
            eyebrow={c("Your account", "Hesabınız")}
            title={t("profile.title")}
            description={t("profile.subtitle")}
          />
          <div className="public-profile-grid">
            <aside className="public-toc">
              <a href="#personal">
                01 <span>{t("profile.personalInfo.title")}</span>
              </a>
              <a href="#medical">
                02 <span>{t("profile.medicalInfo.title")}</span>
              </a>
              <p className="public-small">
                {c(
                  "Share only the details you're comfortable adding. You can update them here.",
                  "Yalnız paylaşmaq istədiyiniz məlumatları əlavə edin. Onları burada yeniləyə bilərsiniz.",
                )}
              </p>
            </aside>
            <div>
              {error && (
                <div className="public-error" role="alert">
                  {error}
                  {!loaded && (
                    <button
                      type="button"
                      onClick={() => setRetry((x) => x + 1)}
                    >
                      {c("Try again", "Yenidən cəhd et")}
                    </button>
                  )}
                </div>
              )}
              {loading ? (
                <p role="status" className="public-loading">
                  {t("profile.loading")}
                </p>
              ) : (
                loaded && (
                  <form
                    id="profile-form"
                    className="public-profile-form"
                    onSubmit={submit}
                  >
                    <fieldset disabled={saving}>
                      <section id="personal">
                        <div className="public-section-heading">
                          <span className="public-section-number">01</span>
                          <h2>{t("profile.personalInfo.title")}</h2>
                        </div>
                        <div className="public-field-grid">
                          {(["name", "email", "age"] as const).map((key) => (
                            <label key={key} htmlFor={key}>
                              {t(
                                `profile.personalInfo.${key === "name" ? "fullName" : key}`,
                              )}
                              <input
                                id={key}
                                name={key}
                                autoComplete={key === "age" ? "off" : key}
                                type={
                                  key === "age"
                                    ? "number"
                                    : key === "email"
                                      ? "email"
                                      : "text"
                                }
                                min={key === "age" ? 0 : undefined}
                                max={key === "age" ? 130 : undefined}
                                required={key !== "age"}
                                value={profile[key]}
                                onChange={(e) => edit(key, e.target.value)}
                              />
                            </label>
                          ))}
                          <label htmlFor="gender">
                            {t("profile.personalInfo.gender")}
                            <select
                              id="gender"
                              value={profile.gender}
                              onChange={(e) => edit("gender", e.target.value)}
                            >
                              <option value="">
                                {t("profile.personalInfo.genderPlaceholder")}
                              </option>
                              <option value="male">
                                {t("profile.personalInfo.genderOptions.male")}
                              </option>
                              <option value="female">
                                {t("profile.personalInfo.genderOptions.female")}
                              </option>
                            </select>
                          </label>
                        </div>
                      </section>
                      <section id="medical">
                        <div className="public-section-heading">
                          <span className="public-section-number">02</span>
                          <h2>{t("profile.medicalInfo.title")}</h2>
                        </div>
                        <div className="public-field-grid">
                          {(["height", "weight"] as const).map((key) => (
                            <label key={key} htmlFor={key}>
                              {t(`profile.medicalInfo.${key}`)}
                              <input
                                id={key}
                                type="number"
                                min="0"
                                step="any"
                                value={profile.medicalProfile[key]}
                                onChange={(e) =>
                                  editMedical(key, e.target.value)
                                }
                              />
                            </label>
                          ))}
                          {(
                            [
                              "conditions",
                              "allergies",
                              "medications",
                              "lifestyle",
                            ] as const
                          ).map((key) => (
                            <label
                              key={key}
                              htmlFor={key}
                              className="public-field-wide"
                            >
                              {t(`profile.medicalInfo.${key}`)}
                              <textarea
                                id={key}
                                rows={3}
                                placeholder={t(
                                  `profile.medicalInfo.${key}Placeholder`,
                                )}
                                value={profile.medicalProfile[key]}
                                onChange={(e) =>
                                  editMedical(key, e.target.value)
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </section>
                    </fieldset>
                    <div className="public-save-bar">
                      <span role="status">
                        {saved
                          ? t("profile.saved")
                          : c(
                              "Changes are saved when you select save.",
                              "Dəyişikliklər yadda saxlama düyməsi ilə saxlanılır.",
                            )}
                      </span>
                      <button
                        className="public-button"
                        disabled={saving}
                        type="submit"
                      >
                        {saving
                          ? c("Saving...", "Saxlanılır...")
                          : t("profile.saveChanges")}
                      </button>
                    </div>
                  </form>
                )
              )}
            </div>
          </div>
        </div>
      </ProductLayout>
    </ProtectedRoute>
  );
}
