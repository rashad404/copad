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
            eyebrow={c("Your space", "Sizin məkanınız")}
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
              "Bu gün nəyi öyrənmək istərdiniz?",
            )}
          />
          <div className="public-dashboard-grid">
            <section className="public-conversation-panel">
              <MessageCircle size={32} />
              <h2>
                {c(
                  "Let’s talk about how you feel.",
                  "Özünüzü necə hiss etdiyinizdən danışaq.",
                )}
              </h2>
              <p>
                {c(
                  "Ask a health question, discuss a concern, or bring a document into your conversation.",
                  "Sağlamlıqla bağlı sual verin, narahatlığınızı bölüşün və ya söhbətə sənəd əlavə edin.",
                )}
              </p>
              <Link href="/chat" className="public-button">
                {c("Open conversations", "Söhbətlərə keç")}
                <ArrowUpRight size={20} />
              </Link>
              <small>
                {c(
                  "AI guidance does not replace professional medical care.",
                  "Süni intellektin məlumatları peşəkar tibbi yardımı əvəz etmir.",
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
                {c("Review my profile", "Profilimə bax")} →
              </Link>
            </aside>
          </div>
          <section className="public-next-section">
            <h2>{c("A little more clarity", "Bir az daha aydınlıq")}</h2>
            <Link className="public-resource-row" href="/blog">
              <BookOpen />
              <div>
                <h3>{c("Explore the journal", "Bloqu kəşf edin")}</h3>
                <p>
                  {c(
                    "Read articles and explore health topics at your own pace.",
                    "Məqalələri oxuyun və sağlamlıq mövzularını öz tempinizdə araşdırın.",
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
                    "Məxfiliyiniz barədə məlumat alın",
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
