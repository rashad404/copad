import DocumentPage from "@/components/public/DocumentPage";
export default function Page() {
  return (
    <DocumentPage
      namespace="privacy"
      sections={[
        "owner",
        "information",
        "usage",
        "transfer",
        "recipients",
        "retention",
        "security",
        "rights",
        "contact",
      ]}
    />
  );
}
