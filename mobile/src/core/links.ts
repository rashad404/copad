import { URL } from "react-native-url-polyfill";
import { Linking } from "react-native";
// Internal website links stay inside the app, including article links.
export async function openLink(nav: any, href: string) {
  const url = new URL(href, "https://azdoc.ai");
  if (["azdoc.ai", "www.azdoc.ai"].includes(url.hostname)) {
    const parts = url.pathname
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
    const [root, slug] = parts;
    if (!root) return nav.navigate("Home");
    if (["dermanlar", "hekimler", "laboratoriyalar"].includes(root)) {
      if (slug)
        return nav.push(
          {
            dermanlar: "Medicine",
            hekimler: "Doctor",
            laboratoriyalar: "Laboratory",
          }[root],
          { slug },
        );
      return nav.navigate("Directory", {
        kind: {
          dermanlar: "medicines",
          hekimler: "doctors",
          laboratoriyalar: "labs",
        }[root],
      });
    }
    if (root === "blog")
      return slug && !["search", "tag"].includes(slug)
        ? nav.push("Article", { slug })
        : nav.push("Blog", {
            tag: slug === "tag" ? parts[2] : undefined,
            q:
              url.searchParams.get("keyword") ||
              url.searchParams.get("q") ||
              "",
          });
    const screens: Record<string, string> = {
      chat: "Chat",
      "health-record": "Records",
      profile: parts[1] === "privacy" ? "Privacy" : "Profile",
      dashboard: "Dashboard",
      login: "Auth",
      register: "Auth",
      "hekim-panel": "DoctorPortal",
    };
    if (screens[root])
      return nav.navigate(
        screens[root],
        root === "register" ? { register: true } : undefined,
      );
    if (root === "randevularim" || root === "analizlerim")
      return nav.navigate("Orders", {
        kind: root === "randevularim" ? "bookings" : "labs",
      });
    if (
      [
        "about",
        "contact",
        "faq",
        "security",
        "privacy-policy",
        "terms-of-service",
      ].includes(root)
    )
      return nav.push("Information", { page: root });
  }
  if (["https:", "http:", "mailto:", "tel:"].includes(url.protocol))
    await Linking.openURL(url.toString());
}
