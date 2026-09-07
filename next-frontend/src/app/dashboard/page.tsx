"use client";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, UserRound, BookOpen } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import ProductLayout, {
  PageIntro,
  usePublicCopy,
} from "@/components/public/ProductLayout";
export default function DashboardPage() {
  const { user } = useAuth();
  const c = usePublicCopy();
  return (
    <ProtectedRoute>
      <ProductLayout>
        <div className="public-container">
          <PageIntro
            eyebrow={c("Your space", "Hesabınız")}
            title={
              user?.name
                ? c(
                    `Hello, ${user.name.split(" ")[0]}.`,
                    `Salam, ${user.name.split(" ")[0]}.`,
                  )
                : c("Welcome back.", "Xoş gəlmisiniz.")
            }
            description={c(
              "What would you like to understand today?",
              "Söhbətlərinizə keçin və ya ailənizin sağlamlıq qeydlərinə baxın.",
            )}
          />
          <div className="public-dashboard-grid">
            <section className="public-conversation-panel">
              <MessageCircle size={32} />
              <h2>
                {c(
                  "Let's talk about how you feel.",
                  "Sağlamlıqla bağlı sualınız var?",
                )}
              </h2>
              <p>
                {c(
                  "Ask a health question, discuss a concern, or bring a document into your conversation.",
                  "Əlamətlər, analiz nəticələri və dərmanlar haqqında soruşun. Tibbi sənəd də əlavə edə bilərsiniz.",
                )}
              </p>
              <Link href="/chat" className="public-button">
                {c("Open conversations", "Söhbətlərə keç")}
                <ArrowUpRight size={20} />
              </Link>
              <small>
                {c(
                  "AI guidance does not replace professional medical care.",
                  "Cavabları süni intellekt hazırlayır. azdoc həkimi əvəz etmir.",
                )}
              </small>
            </section>
            <aside className="public-account-panel">
              <span className="public-avatar">
                {user?.name?.charAt(0).toUpperCase() || <UserRound />}
              </span>
              <p className="public-eyebrow">{c("Your account", "Hesabınız")}</p>
              <h2>{user?.name || c("My profile", "Profilim")}</h2>
              <p className="public-account-email">{user?.email}</p>
              <div className="public-divider" />
              <p>
                {c(
                  "Keep your personal and medical details up to date in your profile.",
                  "Şəxsi və tibbi məlumatlarınızı profilinizdə yeniləyin.",
                )}
              </p>
              <Link href="/profile" className="public-text-link">
                {c("Review my profile", "Profilimə bax")} {'->'}
              </Link>
            </aside>
          </div>
          <section className="public-next-section">
            <Link className="public-resource-row" href="/health-record">
              <UserRound />
              <div>
                <h3>
                  {c(
                    "Your family's health record",
                    "Ailənizin sağlamlıq qeydləri",
                  )}
                </h3>
                <p>
                  {c(
                    "Members, clinical records, and measurements in one place.",
                    "Allergiyalar, dərmanlar, peyvəndlər və ölçülər.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
          </section>
          <section className="public-next-section">
            <h2>{c("A little more clarity", "Faydalı məlumatlar")}</h2>
            <Link className="public-resource-row" href="/blog">
              <BookOpen />
              <div>
                <h3>{c("Explore the journal", "Sağlamlıq haqqında məqalələr")}</h3>
                <p>
                  {c(
                    "Read articles and explore health topics at your own pace.",
                    "Xəstəliklər və dərmanlar haqqında bloq yazılarını oxuyun.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
            <Link className="public-resource-row" href="/privacy-policy">
              <UserRound />
              <div>
                <h3>
                  {c(
                    "Understand your privacy",
                    "Məxfilik siyasəti",
                  )}
                </h3>
                <p>
                  {c(
                    "Learn how your information is handled.",
                    "Məlumatlarınızın necə işləndiyini öyrənin.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
          </section>
        </div>
      </ProductLayout>
    </ProtectedRoute>
  );
}
