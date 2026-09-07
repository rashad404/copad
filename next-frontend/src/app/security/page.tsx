import DocumentPage from "@/components/public/DocumentPage";
export default function Page() {
  return (
    <DocumentPage
      namespace="security"
      sections={[
        "dataProtection",
        "encryption",
        "access",
        "compliance",
        "monitoring",
        "contact",
      ]}
    />
  );
}
